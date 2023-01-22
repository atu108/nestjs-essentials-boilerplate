import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';
import * as sharp from 'sharp';
import * as fs from 'fs';
import * as genThumbnail from 'simple-thumbnail';
import { join } from 'path';
import { File } from './entities/file.entity';
import { InjectModel } from '@nestjs/sequelize';
import { Attachment } from './entities/attachment.entity';
import { IMAGE_SIZES } from '../common/constants/app.constant';

@Injectable()
export class FilesService {
  constructor(
    private config: ConfigService,
    @InjectModel(File) private file: typeof File,
    @InjectModel(Attachment) private attachment: typeof Attachment,
  ) {}

  getS3() {
    return new S3({
      accessKeyId: this.config.get('aws.s3.accessKeyId'),
      secretAccessKey: this.config.get('aws.s3.secretAccessKey'),
    });
  }

  async uploadS3(buffer, name) {
    const params = {
      Bucket: this.config.get('aws.s3.bucket'),
      Key: this.config.get('aws.s3.directory') + name,
      Body: buffer,
    };
    const s3 = this.getS3();
    const res = await new Promise(function (resolve, reject) {
      s3.upload(params, function (err, data) {
        if (err) {
          Logger.error(err);
          reject(err.message);
        }
        resolve(data);
      });
    });
    return res;
  }

  async uploadFile(buffer, name) {
    const filePath = this.config.get('disk.path');
    const path = join(filePath, name);
    const parts = path.split('/');
    parts.pop();
    const dir = parts.join('/');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.createWriteStream(path).write(buffer);
    return path;
  }

  async getResizedImage(buffer, requiredWidth) {
    const image = await sharp(buffer);
    const metadata = await image.metadata();
    const width = metadata.width;
    const height = metadata.height;
    const newWidth = requiredWidth;
    const newHeight = Math.floor((height / width) * newWidth);
    if (width > newWidth || height > newHeight) {
      const newBuffer = await sharp(buffer)
        .resize(newWidth, newHeight)
        .toBuffer();
      const image = await sharp(buffer);
      const metadata = await image.metadata();
      return {
        buffer: newBuffer,
        width: newWidth,
        height: newHeight,
        size: metadata.size,
      };
    }
    return {
      buffer,
      width,
      height,
      size: metadata.size,
    };
  }

  addUrls = (file) => {
    const urls = { disk: {}, bucket: {} };
    const storage = this.config.get('storage');
    const s3Url = this.config.get('aws.s3.url');
    const s3Directory = this.config.get('aws.s3.directory');
    const filesServerRoot = this.config.get('disk.serveRoot');
    const filesBaseUrl = this.config.get('disk.baseUrl');

    const paths = file.paths.split(',');
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      if (storage === 'S3' || storage === 'BOTH') {
        urls.bucket['file'] = s3Url + s3Directory + paths[0];
        paths.forEach((f, i) => {
          urls.bucket[['large', 'medium', 'small'][i]] =
            s3Url + s3Directory + f;
        });
      }
      if (storage === 'DISK' || storage === 'BOTH') {
        urls.disk['file'] = filesBaseUrl + filesServerRoot + '/' + paths[0];
        paths.forEach((f, i) => {
          urls.disk[['large', 'medium', 'small'][i]] =
            filesBaseUrl + filesServerRoot + '/' + f;
        });
      }
    }
    if (file.mimetype === 'video/mp4') {
      if (storage === 'S3' || storage === 'BOTH') {
        urls.bucket['file'] = s3Url + s3Directory + paths[0];
        if (paths.length > 1) {
          urls.bucket['thumb'] = s3Url + s3Directory + paths[1];
        }
      }
      if (storage === 'DISK' || storage === 'BOTH') {
        urls.disk['file'] = filesBaseUrl + filesServerRoot + '/' + paths[0];
        if (paths.length > 1) {
          urls.disk['thumb'] = filesBaseUrl + filesServerRoot + '/' + paths[1];
        }
      }
    } else {
      if (storage === 'S3' || storage === 'BOTH') {
        urls.bucket['file'] = s3Url + s3Directory + paths[0];
      }
      if (storage === 'DISK' || storage === 'BOTH') {
        urls.disk['file'] = filesBaseUrl + filesServerRoot + '/' + paths[0];
      }
    }
    file.urls = urls;
    return file;
  };

  async saveToDestination(buffer, fileName, id) {
    const storage = this.config.get('storage');
    if (storage === 'S3' || storage === 'BOTH') {
      this.uploadS3(buffer, `${id}/${fileName}`);
    }
    if (storage === 'DISK' || storage === 'BOTH') {
      this.uploadFile(buffer, `${id}/${fileName}`);
    }
    return `${id}/${fileName}`;
  }

  getExtension(name) {
    return name.split('.').pop().toLowerCase();
  }

  async getResizedImageBuffers(
    buffer,
    options = { large: true, medium: true, small: true },
  ) {
    const images = {};
    const imageSizeTypes = {
      [IMAGE_SIZES['LARGE']]: this.config.get('images.large'),
      [IMAGE_SIZES['MEDIUM']]: this.config.get('images.medium'),
      [IMAGE_SIZES['SMALL']]: this.config.get('images.small'),
    };
    if (options.large) {
      images['large'] = await this.getResizedImage(
        buffer,
        imageSizeTypes['large'],
      );
    }
    if (options.medium) {
      images['medium'] = await this.getResizedImage(
        buffer,
        imageSizeTypes['medium'],
      );
    }
    if (options.small) {
      images['small'] = await this.getResizedImage(
        buffer,
        imageSizeTypes['small'],
      );
    }
    return images;
  }

  async saveAndGetPaths(bufferObj, extension, id) {
    const sizes = Object.keys(bufferObj);
    const paths = [];
    for (let i = 0; i < sizes.length; i++) {
      paths.push(
        await this.saveToDestination(
          bufferObj[sizes[i]].buffer,
          `${sizes[i]}.${extension}`,
          id,
        ),
      );
    }
    return paths;
  }

  async upload(file) {
    const { mimetype, originalname: name, buffer } = file;
    let { size: sizeBase } = file;
    const extension = this.getExtension(name);
    let paths = [];
    let width = null;
    let height = null;
    const { id } = await File.create({ name, extension, mimetype });
    const videoThumbnail = this.config.get('video.thumbnail');
    if (mimetype === 'image/jpeg' || mimetype === 'image/png') {
      const imageBuffers = await this.getResizedImageBuffers(buffer);
      sizeBase = imageBuffers[IMAGE_SIZES['LARGE']].size;
      width = imageBuffers[IMAGE_SIZES['LARGE']].width;
      height = imageBuffers[IMAGE_SIZES['LARGE']].height;
      paths = await this.saveAndGetPaths(imageBuffers, extension, id);
    } else if (file.mimetype === 'video/mp4' && videoThumbnail) {
      const filePath = this.config.get('video.tempPath');
      const ts = Math.round(+new Date() / 1000);
      const tempName = ts + '.' + extension;
      const tempPath = join(filePath, tempName);
      const thumbPath = join(filePath, ts + '_thumb.png');
      let pathThumb = null;
      fs.createWriteStream(tempPath).write(file.buffer);
      try {
        await genThumbnail(tempPath, thumbPath, '1000x?');
        const thumbBuffer = fs.readFileSync(thumbPath);
        pathThumb = await this.saveToDestination(thumbBuffer, `thumb.png`, id);
      } catch (e) {
        console.error(e.message);
        Logger.error(e);
      }
      try {
        fs.unlinkSync(tempPath);
      } finally {
        // Nothing to do
      }
      try {
        fs.unlinkSync(thumbPath);
      } finally {
        // Nothing to do
      }
      const path = await this.saveToDestination(
        file.buffer,
        `file.${extension}`,
        id,
      );
      paths = [path];
      if (pathThumb) {
        paths.push(pathThumb);
      }
    } else {
      const path = await this.saveToDestination(
        file.buffer,
        `file.${extension}`,
        id,
      );
      paths = [path];
    }
    const update = {
      size: sizeBase,
      width: width,
      height: height,
      paths: paths.join(','),
    };
    await this.file.update(update, { where: { id: id } });
    const f = await this.file.findByPk(id);
    return this.addUrls(f);
  }

  async getAttachments(refId: number, attachmentType: Array<string>) {
    const attachments = await this.attachment.findAll({
      include: [{ model: File }],
      where: {
        referenceId: refId,
        type: attachmentType,
      },
    });
    for (const attachment of attachments) {
      attachment.file = this.addUrls(attachment.file);
    }
    return attachments;
  }
}
