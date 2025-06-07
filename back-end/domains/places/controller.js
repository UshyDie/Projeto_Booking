import 'dotenv/config';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import fs from 'fs';
import download from 'image-downloader';
import mime from 'mime-types';
import multer from 'multer';
import { __dirname } from '../../server.js';

const { S3_ACCESS_KEY, S3_SECRET_KEY, BUCKET } = process.env;

const getExtension = (path) => {
  const mimeType = mime.lookup(path);
  const contentType = mime.contentType(mimeType);
  const extension = mime.extension(contentType);

  return { extension, mimeType };
};

export const sendToS3 = async (filename, path, mimetype) => {
  const client = new S3Client({
    region: 'us-east-2',
    credentials: {
      accessKeyId: S3_ACCESS_KEY,
      secretAccessKey: S3_SECRET_KEY,
    },
  });
  // Cria um comando para enviar o arquivo para o S3
  const command = new PutObjectCommand({
    Bucket: BUCKET, // Nome do bucket S3
    Key: filename, // Nome do arquivo a ser criado no S3
    Body: fs.readFileSync(path), // Conteúdo do arquivo
    ContentType: mimetype, // Tipo de conteúdo do arquivo
    ACL: 'public-read', // Permissão de leitura pública
  });

  try {
    await client.send(command);

    return `https://${BUCKET}.s3.us-east-2.amazonaws.com/${filename}`;
  } catch (error) {
    console.log('Erro ao enviar arquivo para o S3:', error);
    throw error;
  }
};

export const downloadImage = async (link) => {
  const mimeType = mime.lookup(link);
  const contentType = mime.contentType(mimeType);
  const extension = mime.extension(contentType);
  const destination = `${__dirname}/tmp/`;

  const filename = `${Date.now()}.${extension}`;
  const fullPath = `${destination}${filename}`;

  try {
    const options = {
      url: link,
      dest: fullPath,
    };

    // console.log('Downloading image from:', link);
    await download.image(options);

    console.log(mimeType);
    return { filename, fullPath, mimeType };

    // console.log('Saved to', filename);
  } catch (error) {
    console.error('Download failed:', error);
    throw error;
  }
};

export const uploadImage = () => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, `${__dirname}/tmp/`);
    },
    filename: function (req, file, cb) {
      const { extension } = getExtension(file.originalname);
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);

      cb(null, `${uniqueSuffix}.${extension}`);
    },
  });

  return multer({ storage });
};
