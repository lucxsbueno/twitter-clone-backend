const { verify } = require('jsonwebtoken');

module.exports = {
  checkToken: (req, res, next) => {
    const userId = req.params.id;
    let token = req.get("authorization");

    if (token) {

      token = token.slice(7);

      verify(token, "123456", (error, decoded) => {

        const { user } = decoded;

        if (error) {

          if (error.name === "TokenExpiredError") {
            res.status(401).json({
              error: true,
              message: "Token expirado.",
              expiredAt: error.expiredAt
            });
          }

          if (error.name === "JsonWebTokenError") {
            res.status(401).json({
              error: true,
              message: "O token fornecido é inválido."
            });
          }
        } else {

          if (userId !== user.id) {
            res.status(401).json({
              error: true,
              message: "O token não pertence a este usuário."
            });
          }

          next();
        }
      })
    } else {
      res.status(401).json({
        error: true,
        message: "Acesso negado! Usuário não autorizado."
      });
    }
  }
}