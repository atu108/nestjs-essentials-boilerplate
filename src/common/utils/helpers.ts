import * as bycrpt from 'bcrypt';
import * as url from 'url';
import { v1 as uuidv1 } from 'uuid';
import * as xlsx from 'xlsx';
import * as path from 'path';
import * as xl from 'excel4node';
import * as fs from 'fs';
/**
 * generateSalt
 *
 * @param factor number
 */
export const generateSalt = (factor: number): Promise<string> => {
  return bycrpt.genSalt(factor);
};

/**
 * toHash
 *
 * @param {*} pass
 *
 * password hashing
 */
export const toHash = async (pass: string): Promise<string> => {
  return bycrpt.hash(pass, 10);
};

/**
 * checkHash
 *
 * @param {*} plain
 * @param {*} encrypted
 *
 * compare password hash with plain text
 */
export const checkHash = (
  plain: string,
  encrypted: string,
): Promise<boolean> => {
  return bycrpt.compare(plain, encrypted);
};

export const uuid = () => {
  return uuidv1();
};

export const nameFromSlug = (slug: string) => {
  return slug.indexOf('-') !== -1
    ? slug
        .split('-')
        .map((s: string) => `${s.charAt(0).toUpperCase()}${s.slice(1)}`)
        .join(' ')
    : `${slug.charAt(0).toUpperCase()}${slug.slice(1)}`;
};

export const mapByField = (data: any[], field: string) => {
  return data.map((entry: any) => entry[field]);
};

export const generatePassword = (length) => {
  if (process.env.NODE_ENV == 'development') {
    return 'Test@123';
  }
  const alpha = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const integers = '0123456789';
  const exCharacters = '!@#$%&*_';
  const possibles = alpha + integers + exCharacters;
  let password = '';
  for (let i = 0; i < length; i++) {
    password += possibles.charAt(Math.floor(Math.random() * possibles.length));
  }
  return password;
};

export const parseConnectionString = (connectionString: string): any => {
  const config: any = {};
  const options: any = {};

  const urlParts = url.parse(connectionString);

  options.dialect = urlParts.protocol.replace(/:$/, '');
  options.host = urlParts.hostname;

  // if (options.dialect === 'sqlite' && urlParts.pathname && urlParts.pathname.indexOf('/:memory') !== 0) {
  //   const path = path.join(options.host, urlParts.pathname);
  //   options.storage = options.storage || path;
  // }

  if (urlParts.pathname) {
    config.database = urlParts.pathname.replace(/^\//, '');
  }

  if (urlParts.port) {
    options.port = urlParts.port;
  }

  if (urlParts.auth) {
    const authParts = urlParts.auth.split(':');

    config.username = authParts[0];

    if (authParts.length > 1) config.password = authParts.slice(1).join(':');
  }

  const result = Object.assign({}, config, options);

  return result;
};

export const generateRandomNumber = (
  digits: number = +process.env.OTP_LENGTH || 4,
) => {
  if (process.env.NODE_ENV == 'development') {
    return 1234;
  }
  return Math.floor(Math.random() * Math.pow(10, digits));
};

export const generateAndHashOtp = async () => {
  const otp = generateRandomNumber();
  const hashedOtp = await toHash(`${otp}`);
  return [otp, hashedOtp];
};

export const excelToJson = (file) => {
  const headers = 0;
  const workbook = xlsx.readFile(file.path);
  fs.unlinkSync(file.path);
  const ws = workbook.Sheets[workbook.SheetNames[0]];
  const rows: any = xlsx.utils.sheet_to_json(ws, {
    header: headers,
  });
  return rows;
};

export const createExcel = async (
  head: string[],
  basePath: string,
  type: string,
) => {
  const fileFormat = '.xlsx';
  const filename = `${type.toLowerCase()}_template${fileFormat}`;
  const filepath = path.join(basePath, filename);
  const wb = new xl.Workbook();
  const ws = wb.addWorksheet('Sheet 1');

  for (let i = 0; i < head.length; i++) {
    ws.cell(1, i + 1).string(head[i].toString());
  }
  return new Promise(function (resolve, reject) {
    wb.write(filepath, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve(filepath);
      }
    });
  });
};
