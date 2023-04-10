import jwt from "jsonwebtoken";
import findByIdService from "../services/service.user.js"
import dotenv from "dotenv";
dotenv.config();

const authMiddleware = (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (!authorization) {
      return res.send(401);
    }

    const parts = authorization.split(" ");

    if (parts.length !== 2) {
      return res.send(401);
    }

    const [schema, token] = parts;

    if (schema !== "Bearer") {
      return res.send(401);
    }

    jwt.verify(token, process.env.JWT_TOKEN, async (error, decoded) => {
      if (error) {
        return res.status(401).send({ message: "Token invalid!" });
      }

      const user = await findByIdService.findByIdService(decoded.id);

      if (!user || !user.id) {
        return res.status(401).send({ message: "Invalid token!" });
      }

      req.userId = user.id;

      return next();
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

export  {authMiddleware} ;
