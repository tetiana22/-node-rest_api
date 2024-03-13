import HttpError from "../helpers/HttpError.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.js";
import dotenv from "dotenv";
dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY;

export const authenticate = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return next(HttpError(401));
  }

  const [bearer, token] = authorization.split(" ");

  if (bearer !== "Bearer") {
    return next(new HttpError(401));
  }

  try {
    const { id } = jwt.verify(token, SECRET_KEY);
    const user = await User.findById(id);

    if (!user) {
      return next(HttpError(401));
    }
    req.user = user;
    next();
  } catch (error) {
    return next(HttpError(401));
  }
};
