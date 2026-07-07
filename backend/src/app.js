const compression = require('compression');
const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const errorHandler = require('./middleware/error');
const notFound = require('./middleware/notFound');
const { getAllowedOrigins } = require('./config/env');

const app = express();
const allowedOrigins = getAllowedOrigins();
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many authentication attempts. Please try again shortly.'
  }
});

app.set('trust proxy', 1);
app.disable('x-powered-by');

app.use(helmet());
app.use(compression());
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true
  })
);

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: {
      success: false,
      message: 'Too many requests. Please try again shortly.'
    }
  })
);

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));



app.get('/', (req, res) => {
  res.status(200).json({ success: true, message: 'BloodConnect API is running smoothly' });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'ok',
    uptime: process.uptime()
  });
});

app.use('/api/auth', authLimiter, require('./routes/auth'));
app.use('/api/donors', require('./routes/donors'));
app.use('/api/recipients', require('./routes/recipients'));
app.use('/api/requests', require('./routes/requests'));
app.use('/api/banks', require('./routes/banks'));
app.use('/api/inventory', require('./routes/inventory'));
app.use('/api/appointments', require('./routes/appointments'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/donations', require('./routes/donations'));
app.use('/api/admin', require('./routes/admin'));

app.use(notFound);
app.use(errorHandler);

module.exports = app;
