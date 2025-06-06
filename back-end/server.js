import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import routers from './routes/index.js';
import { fileURLToPath } from 'url';
import { dirname } from 'node:path';

export const app = express();

export const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);

const { SESSION_SECRET } = process.env;

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);

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

// app.use('/uploads', express.static(__dirname + '/uploads'));
app.use('/tmp', express.static(__dirname + '/tmp'));

app.use(routers);
