import { Router } from 'express';
import Place from './model.js';
import { JWTVerify } from '../../utils/jwt.js';
import { connectDb } from '../../config/db.js';
import { sendToS3, downloadImage, uploadImage } from './controller.js';

const router = Router();

router.post('/', async (req, res) => {
  connectDb(); // Conectando ao banco de dados

  const {
    title,
    city,
    photos,
    description,
    extras,
    perks,
    price,
    checkin,
    checkout,
    guests,
  } = req.body;

  try {
    const { _id: owner } = await JWTVerify(req); // Verifica o token JWT e obtém as informações do usuário

    if (!owner) {
      console.error('Usuário não autenticado');
      return res.status(401).json({ error: 'Usuário não autenticado' });
    }

    const newPlaceDoc = await Place.create({
      owner,
      title,
      city,
      photos,
      description,
      extras,
      perks,
      price,
      checkin,
      checkout,
      guests,
    });

    return res.json(newPlaceDoc); // Responde com o novo lugar criado
  } catch (error) {
    console.error('Erro ao criar lugar:', error);
    return res.status(500).json({ error: 'Erro ao criar o novo lugar' });
  }
});

router.post('/upload/link', async (req, res) => {
  const { link } = req.body;
  // Caminho para salvar a imagem localmente

  try {
    const { filename, fullPath, mimeType } = await downloadImage(link);

    const fileURL = await sendToS3(filename, fullPath, mimeType);

    console.log(filename, fullPath, mimeType);
    // console.log('Arquivo enviado para o S3:', fileURL);
    res.json(fileURL);
  } catch (error) {
    console.error('Erro ao processar o link:', error);
    return res.status(500).json({ error: 'Erro ao processar o link' });
  }
});

router.post('/upload', uploadImage().array('files', 10), async (req, res) => {
  const { files } = req;

  const filesPromise = new Promise((resolve, reject) => {
    const fileURLArray = [];

    files.forEach(async (file, index) => {
      const { filename, path, mimetype } = file;

      try {
        const fileURL = await sendToS3(filename, path, mimetype);

        fileURLArray.push(fileURL);
      } catch (error) {
        console.error('Erro ao processar o arquivo:', error);
        reject(error);
      }
    });

    const idInterval = setInterval(() => {
      console.log('Executou o intervalo');
      if (files.length === fileURLArray.length) {
        clearInterval(idInterval);
        console.log('Limpou o intervalo');
        console.log(fileURLArray);
        resolve(fileURLArray);
      }
    }, 100);
  });

  const fileURLArrayResolved = await filesPromise;

  res.json(fileURLArrayResolved);
});

export default router;

/* 
{
  fieldname: 'files',
  originalname: '1c99fbb6-372b-4fd2-8eda-be39b716a93d-1741531292093.jpeg',
  encoding: '7bit',
  mimetype: 'image/jpeg',
  destination: 'C:\\Users\\diefe\\OneDrive\\Documentos\\Fullstack\\HTML-CSS-Javascript\\Aulas_ReactJS\\ReactJS\\Projeto_Booking\\back-end/tmp/',
  filename: '1749241815721.jpg',
  path: 'C:\\Users\\diefe\\OneDrive\\Documentos\\Fullstack\\HTML-CSS-Javascript\\Aulas_ReactJS\\ReactJS\\Projeto_Booking\\back-end\\tmp\\1749241815721.jpg',
  size: 55427
}
 */

/* usuario teste15@teste.com senha: teste12345
{
  "owner": "6840ffd1dfaf75be2c267d32",
  "title": "Beautiful Beach House",
  "city": "Rio de Janeiro",
  "photos": ["photo1.jpg", "photo2.jpg"],
  "description": "A beautiful beach house with stunning views.",
  "extras": "WiFi, Pool, Air Conditioning",
  "perks": ["wifi", "tv"],
  "price": 150,
  "checkin": "14:00",
  "checkout": "12:00",
  "guests": 4 
  }


 */
