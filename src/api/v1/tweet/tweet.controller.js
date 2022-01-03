const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

module.exports = {
  findTweetById: async (req, res, next) => {
    const id = req.params.id;

    try {
      const response = await prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          tweet: true,
          date: true,
          user: {
            select: {
              id: true,
              name: true,
              username: true,
              verified: true
            }
          }
        }
      });

      if (response === null) {
        return res.status(401).json({
          message: "Tweet não econtrado."
        });
      }

      return res.status(200).json(response);
    } catch (error) {
      console.log(error);

      return res.status(401).json({
        error,
        message: "Ocorreu um erro na sua solicitação.",
      });
    }
  },

  findAllTweets: async (req, res, next) => {

    try {
      const response = await prisma.tweet.findMany({
        orderBy: {
          date: 'desc'
        },
        select: {
          id: true,
          tweet: true,
          date: true,
          user: {
            select: {
              id: true,
              name: true,
              username: true,
              verified: true
            }
          }
        }
      });

      if (response === null) {
        return res.status(204).json([]);
      }

      return res.status(200).json(response);
    } catch (error) {

    }
  },

  createTweet: async (req, res, next) => {

    //passing user id parameter
    const id = req.params.id;

    const { tweet } = req.body;

    try {
      const response = await prisma.tweet.create({ data: { tweet, userId: id } });

      if (response === null) {
        return res.status(204).json([]);
      }

      return res.status(200).json(response);
    } catch (error) {
      console.log(error);
    }
  },

  deleteTweet: async (req, res, next) => {

    try {
      const response = await prisma.tweet.delete({ where: id });

      if (response===null) {
        return res.status(204).json({
          error: true,
          message: "O tweet não foi localizado ou não existe."
        });
      }

      return res.status(204).json({
        error: false,
        message: "Tweet deletado com sucesso!"
      });

    } catch (error) {
      
    }
  }
}