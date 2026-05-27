
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

const corsOptions = {
  origin(origin, callback) {
    if (!origin || FRONTEND_URLS.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('CORS origin not allowed'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.send('Welcome to the Smart Interview Scheduler API');
});

app.use(['/api/auth', '/auth'], authRouter);
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
