import 'dotenv/config';
import jwt from 'jsonwebtoken';
import User from '../domains/users/model.js';

const { JWT_SECRET_KEY } = process.env;

export const JWTVerify = (req) => {
  const { token } = req.cookies;

  if (token) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, JWT_SECRET_KEY, {}, (error, userInfo) => {
        if (error) {
          console.error('Deu algum erro ao verificar com o JWT:', error);
          reject(error);
        }

        resolve(userInfo);
      });
    });
  } else {
    return null;
  }
};

export const JWTSing = (newUserObj) => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      newUserObj,
      JWT_SECRET_KEY,
      { expiresIn: '1d' },
      (error, token) => {
        if (error || !token) {
          console.error('Erro ao gerar token:', error);
          reject('Erro ao gerar token');
        }
        // Enviar token no cookie

        resolve(token);
      }
    );
  });
};
