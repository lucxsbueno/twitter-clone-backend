const router = require('express').Router();

const { checkToken } = require('../../middlewares/check.token');

const { findAllTweets, findTweetById, createTweet, deleteTweet } = require('./tweet.controller');

router.get('/', findAllTweets);
router.get('/:id', findTweetById);
router.post('/:id', checkToken, createTweet);
router.delete('/:id', checkToken, deleteTweet);

module.exports = router;