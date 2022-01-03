const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan(':method :url :response-time'));
app.use(cors());

app.get('/', (req, res) => {
  res.json({
    message: "Welcome to my server application! 😊"
  });
});

/**
 *
 *
 * Routes
 */
const userRouter = require('./api/v1/user/user.router');
app.use('/users', userRouter);

const tweetRouter = require('./api/v1/tweet/tweet.router');
app.use('/tweets', tweetRouter);

const PORT = 8000;

app.listen(PORT, () => {
  console.log(`Api is running on: http://localhost:${PORT}.`);
});