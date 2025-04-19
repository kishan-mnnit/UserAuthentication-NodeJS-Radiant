const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
require('dotenv').config();

const app = express();
connectDB();

app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  cookie: { maxAge: 1000 * 60 * 30 } // 30 min
}));

app.use('/api/auth', authRoutes);

app.listen(3000, () => console.log('Server started on port 3000'));
