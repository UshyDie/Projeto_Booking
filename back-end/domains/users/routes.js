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
  connectDb();
  const token = req.cookies?.token;

  if (token) {
    // try {
    jwt.verify(token, JWT_SECRET_KEY, {}, (error, userData) => {
      if (error) {
        console.error('Erro ao decodificar token:', error);
        return res.status(401).json('Token inválido ou expirado');
      }
      console.log('Token decodificado:', userData);
      const { _id, name, email } = userData;
      // Buscar usuário no banco de dados para garantir que o usuário existe
      console.log({ _id, name, email });
      res.json({ _id, name, email });
    });
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

    const token = jwt.sign(userPayload, JWT_SECRET_KEY, {}, (error, token) => {
      if (error) {
        console.error('Erro ao gerar token:', error);
        return res.status(500).json('Erro ao gerar token');
      }
      // Enviar token no cookie (para login automático)
      res
        .cookie('token', token, {
          httpOnly: true,
          sameSite: 'lax', // ou 'strict' se quiser mais segurança
        })
        .json(userPayload); // envia os dados do usuário sem senha
    });
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
        jwt.sign(newUserObj, JWT_SECRET_KEY, {}, (error, token) => {
          if (error) {
            console.error('Erro ao gerar token:', error);
            return res.status(500).json('Erro ao gerar token');
          }
          // Enviar token no cookie
          console.log('Token gerado com sucesso:', token);
          res
            .cookie('token', token, {
              httpOnly: true,
              sameSite: 'lax', // ou 'strict'
              secure: false, // use true se for https
            })
            .json(newUserObj);
        });
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

router.post('/logout', (req, res) => {
  connectDb();
  res.clearCookie('token').json('Deslogado com sucesso');
});

export default router;
