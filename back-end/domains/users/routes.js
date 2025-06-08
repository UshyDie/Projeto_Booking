import 'dotenv/config';
import { Router } from 'express';
import { connectDb } from '../../config/db.js';
import User from './model.js';
import bcrypt from 'bcryptjs';
import { JWTSing, JWTVerify } from '../../utils/jwt.js';

const router = Router();
const bcryptSalt = bcrypt.genSaltSync();

router.get('/', async (req, res) => {
  connectDb();

  try {
    const userDoc = await User.find();
    // console.log('userDoc: ', userDoc);
    res.json(userDoc);
  } catch (error) {
    res.status(500).json(JSON.stringify(error));
  }
});

router.get('/profile', async (req, res) => {
  connectDb();
  const userData = await JWTVerify(req);
  const { _id, name, email } = userData;
  // console.log('Dados do usuário:', userData);
  // console.log({ _id, name, email });
  res.json(userData, { _id, name, email });
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

    try {
      const token = await JWTSing(userPayload);
      // Enviar token no cookie (para login automático)
      res
        .cookie('token', token, {
          httpOnly: false,
          sameSite: 'lax', // ou 'strict' se quiser mais segurança
        })
        .json(userPayload); // envia os dados do usuário sem senha
    } catch (error) {
      console.error('Erro ao gerar token:', error);
      return res.status(500).json('Erro ao gerar token');
    }
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
      if (passwordCorrect) {
        const { name, _id } = userDoc;

        // Armazena o ID do usuário na sessão
        req.session.userId = _id;
        // console.log('ID do usuário armazenado na sessão:', req.session.userId); // Verifique se o ID está armazenado

        const newUserObj = { _id, name, email };
        const token = await JWTSing(newUserObj);

        res
          .cookie('token', token, {
            httpOnly: true,
            sameSite: 'lax', // ou 'strict'
            secure: false, // Mude para true se estiver usando HTTPS
          })
          .json(newUserObj); // envia os dados do usuário sem senha
      } else {
        return res.status(400).json('Senha inválida!');
      }
    } else {
      return res.status(400).json('Usuário não encontrado!');
    }
  } catch (error) {
    console.error('Erro ao logar:', error);
    return res.status(500).json(JSON.stringify(error));
  }
});

// Rota de Logout
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    // Destrói a sessão
    if (err) {
      console.error('Erro ao deslogar:', err);
      return res.status(500).json({ error: 'Erro ao deslogar' });
    }
    res.clearCookie('token'); // Remove o cookie do token
    res.json({ message: 'Deslogado com sucesso' }); // Envia a resposta
  });
});

export default router;
