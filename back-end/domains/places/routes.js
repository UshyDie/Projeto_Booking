import { Router } from 'express';
import Place from './model.js';
import { JWTVerify } from '../../utils/jwt.js';
import { connectDb } from '../../config/db.js';
import { __dirname } from '../../server.js';
import { downloadImage } from '../../utils/imageDownloader.js'; // Função para baixar imagens
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
  // connectDb(); // Conectando ao banco de dados
  const { link } = req.body;

  try {
    const fullPath = await downloadImage(link, `${__dirname}/tmp/`); // Função para baixar a imagem do link fornecido
    console.log(fullPath);
    res.json(fullPath);
  } catch (error) {
    console.error('Erro ao processar o link:', error);
    return res.status(500).json({ error: 'Erro ao processar o link' });
  }
});

export default router;

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
