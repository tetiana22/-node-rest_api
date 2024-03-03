import { isValidObjectId } from "mongoose";
import HttpError from "../helpers/HttpError.js";

export const isValidId = (req, res, next) => {
  const { contactId } = req.params;
  if (!isValidObjectId) {
    return next(HttpError(404, `${contactId} is not valid id`));
  }
  next();
};
