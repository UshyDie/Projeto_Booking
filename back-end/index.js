import 'dotenv/config';
import express from 'express';
import session from 'express-session';
import UserRoutes from './domains/users/routes.js';
import PlaceRoutes from './domains/places/routes.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const app = express();
const { PORT, SESSION_SECRET } = process.env;

export const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);

// CORS antes de tudo
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
    },
  })
);

app.use('/users', UserRoutes);
app.use('/places', PlaceRoutes);

app.listen(PORT, () => {
  console.log(`Servidor está rodando na porta ${PORT}`);
});
