import { Router } from 'express';
import Place from './model.js';
import { JWTVerify } from '../../utils/jwt.js';
import { connectDb } from '../../config/db.js';
import { sendToS3, downloadImage, uploadImage } from './controller.js';

const router = Router();

router.get('/', async (req, res) => {
  connectDb();

  try {
    const placeDocs = await Place.find();

    res.json(placeDocs);
  } catch (error) {
    console.error(error);
    res.status(500).json('Deu erro encontrar as Acomodações');
  }
});

router.get('/owner', async (req, res) => {
  connectDb();
  try {
    const { _id } = await JWTVerify(req);
    try {
      const placeDocs = await Place.find({ owner: _id });

      res.json(placeDocs);
    } catch (error) {
      console.error(error);
      res.status(500).json('Deu erro acomodações do usuário');
    }
  } catch (error) {
    console.error(error);
    res.status(500).json('Deu erro encontrar usuário');
  }
});

router.get('/:id', async (req, res) => {
  connectDb();

  const { id: _id } = req.params;

  try {
    const placeDoc = await Place.findOne({ _id });

    res.json(placeDoc);
  } catch (error) {
    console.error(error);
    res.status(500).json('Erro ao encontrar a acomodação reefrente ao id');
  }
});

router.put('/:id', async (req, res) => {
  connectDb(); // Conectando ao banco de dados

  const { id: _id } = req.params;

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
    const updatePlaceDoc = await Place.findOneAndUpdate(
      { _id },
      {
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
      }
    );

    return res.json(updatePlaceDoc); // Responde com o novo lugar criado
  } catch (error) {
    console.error(error);
    return res.status(500).json('Erro ao atualizar as informações', error);
  }
});

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

    // console.log(filename, fullPath, mimeType);
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
      // console.log('Executou o intervalo');
      if (files.length === fileURLArray.length) {
        clearInterval(idInterval);
        // console.log('Limpou o intervalo');
        // console.log(fileURLArray);
        resolve(fileURLArray);
      }
    }, 100);
  });

  const fileURLArrayResolved = await filesPromise;

  res.json(fileURLArrayResolved);
});

export default router;
