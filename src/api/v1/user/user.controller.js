const { genSaltSync, hashSync, compareSync } = require('bcrypt');
const { sign, verify } = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = {
  findAllUsers: async (req, res, next) => {
    try {
      const response = await prisma.user.findMany({
        select: {
          id: true,
          email: true,
          username: true,
          verified: true
        }
      });

      if (response === null) {
        return res.status(204).json([]);
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

  findUserById: async (req, res, next) => {
    const id = req.params.id;

    try {
      const response = await prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          email: true,
          username: true,
          verified: true,
          tweets: {
            select: {
              id: true,
              tweet: true,
              date: true
            }
          }
        }
      });

      if (response === null) {
        return res.status(204).json([]);
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

  createUser: async (req, res, next) => {
    const salt = genSaltSync(10);
    req.body.password = hashSync(req.body.password, salt);

    const user = req.body;

    try {
      const response = await prisma.user.create({ data: user });

      if (response === null) {
        return res.status(204).json([]);
      }

      return res.status(201).json({
        error: false,
        message: "Sua conta foi criada com sucesso!"
      });
    } catch (error) {
      console.log(error);

      return res.status(400).json({
        error: true,
        message: "Não foi possível criar a conta."
      });
    }
  },

  updateUser: async (req, res, next) => {
    const id = req.params.id;
    const user = req.body;

    try {
      const response = await prisma.user.update({ where: { id }, data: user });

      if (response === null) {
        return res.status(204).json([]);
      }

      return res.status(200).json({
        error: false,
        message: "Conta editada com sucesso!"
      });
    } catch (error) {
      console.log(error);

      return res.status(400).json({
        error: true,
        message: "Não foi possível editar a conta, revise seus dados."
      });
    }
  },

  deleteUser: async (req, res, next) => {
    const id = req.params.id;

    try {
      const response = await prisma.user.delete({ where: { id } });

      if (response === null) {
        return res.status(204).json([]);
      }

      return res.status(200).json({
        error: false,
        message: "Conta deletada com sucesso!"
      });
    } catch (error) {
      console.log(error);

      return res.status(400).json({
        error: true,
        message: "Não foi possível deletar a conta."
      });
    }
  },

  signIn: async (req, res, next) => {
    const user = req.body;

    try {
      const hasEmail = await prisma.user.findUnique({ where: { email: user.email } });

      if (hasEmail!==null) {
        
        const isRight = compareSync(req.body.password, hasEmail.password);

        if (isRight) {

          const jwt = {
            //data transfer to jwt
            payload: { user: hasEmail },
            secret: "123456",
            options: {
              issuer: "twitter-clone-backend",
              algorithm: "HS256",
              expiresIn: "24h"
            }
          }

          sign(
            jwt.payload,
            jwt.secret,
            jwt.options,
            //callBack
            (err, token) => {
              if (err) {
                console.log("[jwt error]: ", err);
              }

              hasEmail.password = undefined;

              return res.status(202).json({
                error: false,
                message: "Login efetuado com sucesso!",
                token: token,
                user: hasEmail
              });
            }
          );

        } else {
          return res.status(404).json({
            error: true,
            message: `E-mail ou senha inválidos, tente novamente.`
          });
        }

      } else {
        return res.status(404).json({
          error: true,
          message: `E-mail ou senha inválidos, tente novamente.`
        });
      }

    } catch (error) {
      console.log(error);

      return res.status(400).json({
        error: true,
        message: "Ocorreu um erro no processo da sua solicitação."
      });
    }

  }
}