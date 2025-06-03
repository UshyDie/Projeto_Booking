import 'dotenv/config';
import { Router } from 'express';
import { connectDb } from '../../config/db.js';
import User from './model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = Router();
const bcryptSalt = bcrypt.genSaltSync();
const { JWT_SECRET_KEY } = process.env;

router.get('/', async (req, res) => {
  connectDb();

  try {
    const userDoc = await User.find();
    res.json(userDoc);
  } catch (error) {
    res.status(500).json(JSON.stringify(error));
  }
});

router.get('/profile', async (req, res) => {
  const { token } = req.cookies;

  if (token) {
    try {
      const userInfo = jwt.verify(token, JWT_SECRET_KEY);

      res.json(userInfo);
    } catch (error) {
      res.status(500).json(JSON.stringify(error));
    }
  } else {
    res.json(null);
  }
});

router.post('/', async (req, res) => {
  connectDb();

  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json('Email já cadastrado');
    }
    const encryptedPassword = bcrypt.hashSync(password, bcryptSalt);
    const newUserDoc = await User.create({
      name,
      email,
      password: encryptedPassword,
    });

    // Gerar token JWT
    const userPayload = {
      _id: newUserDoc._id,
      name: newUserDoc.name,
      email: newUserDoc.email,
    };

    const token = jwt.sign(userPayload, JWT_SECRET_KEY);

    // Enviar token no cookie (para login automático)
    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'lax', // ou 'strict' se quiser mais segurança
    });

    res.json(userPayload); // envia os dados do usuário sem senha
  } catch (error) {
    res.status(500).json(JSON.stringify(error));
  }
});

router.post('/login', async (req, res) => {
  connectDb();

  const { email, password } = req.body;

  try {
    const userDoc = await User.findOne({ email });
    if (userDoc) {
      const passwordCorrect = bcrypt.compareSync(password, userDoc.password);
      const { name, _id } = userDoc;

      if (passwordCorrect) {
        const newUserObj = { _id, name, email };
        const token = jwt.sign(newUserObj, JWT_SECRET_KEY);

        res
          .cookie('token', token, {
            httpOnly: true,
            sameSite: 'lax', // ou 'strict'
            secure: false, // use true se for https
          })
          .json(newUserObj);
      } else {
        res.status(400).json('Senha inválida!');
      }
    } else {
      res.status(400).json('Usuário não encontrado!');
    }
  } catch (error) {
    console.error('Erro ao logar:', error);
    res.status(500).json(JSON.stringify(error));
  }
});

export default router;
