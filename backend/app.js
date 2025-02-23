require('dotenv').config();
require('express-async-errors');

const express = require('express');

//extra security packages
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const rateLimiter = require('express-rate-limit');

//connectDB
const connectDB = require('./db/db');
const authenticateUser = require('./middleware/authMiddleware');

//routers
const authRoutes = require('./routes/authRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
const commentRoutes = require('./routes/commentRoutes');

const app = express();

// error handler
const notFoundMiddleware = require('./middleware/notFoundMiddleware');
const errorHandlerMiddleware = require('./middleware/errorHandlerMiddleware');

//Limit requests number
app.set('trust proxy', 1);
app.use(rateLimiter({
  windowMs: 15*60*1000, //15 minutes
  max: 100, //limit each IP to 100 requests per windows
}));
app.use(express.json());
app.use(helmet());
app.use(cors({
  origin: [""],  //надо изменить на фронтэнд-домен!!!!
  methods: "GET, POST, PATCH, DELETE",
  credentials: true,
}));
app.use(xss());

app.use(express.static("public"));

// routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/feedback', authenticateUser ,feedbackRoutes);
app.use('/api/v1/comments', authenticateUser ,commentRoutes);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB (process.env.MONGO_URI)
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();