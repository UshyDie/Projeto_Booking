import 'dotenv/config';
import jwt from 'jsonwebtoken';
import User from '../domains/users/model.js';

const { JWT_SECRET_KEY } = process.env;

export const JWTVerify = (req, res) => {
  const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];

  // console.log('resposta de token', token);
  if (!token) {
    console.error('Token não fornecido ou inválido');
    return res.status(401).json('Token não fornecido', error);
  }

  return new Promise((resolve, reject) => {
    jwt.verify(token, JWT_SECRET_KEY, {}, (error, userData) => {
      if (error) {
        console.error('Erro ao verificar token:', error);
        reject(error);
      }
      // console.log('Token decodificado:', userData);
      resolve(userData);
    });
  });
};

export const JWTSing = (newUserObj) => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      newUserObj,
      JWT_SECRET_KEY,
      { expiresIn: '1d' },
      (error, token) => {
        if (error) {
          console.error('Erro ao gerar token:', error);
          reject('Erro ao gerar token');
        }
        // Enviar token no cookie

        resolve(token);
      }
    );
  });
};
