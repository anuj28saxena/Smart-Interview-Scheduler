
import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth.routes.js';
import slotRouter from './routes/slot.routes.js';
import bookingRouter from './routes/booking.routes.js';
import notificationRouter from './routes/notification.routes.js';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config({ quiet: true });

const app = express();

const FRONTEND_URLS = (process.env.FRONTEND_URLS || 'http://localhost:5173,http://127.0.0.1:5173,https://smart-interview-scheduler-smoky.vercel.app').split(',').map(u => u.trim());

app.use(cors({
  origin: FRONTEND_URLS,
  credentials: true
}))

app.use((req, res, next) => {
  const allowedOrigins = FRONTEND_URLS;
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  next();
});

app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.send('Welcome to the Smart Interview Scheduler API');
});

app.use('/api/auth', authRouter);
app.use('/api/slots', slotRouter);
app.use('/api/bookings', bookingRouter);
app.use('/api/notifications', notificationRouter);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.statusCode || 500).json({
    message: err.message || 'Internal server error'
  });
});

export default app;
