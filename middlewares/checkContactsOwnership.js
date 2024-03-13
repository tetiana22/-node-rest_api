import { Contact } from "../models/contacts.js";
import HttpError from "../helpers/HttpError.js";

export const checkContactOwnership = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const { contactId } = req.params;
    const contact = await Contact.findOne({
      _id: contactId,
      owner: _id,
    });

    if (!contact) {
      throw HttpError(404, "Not found");
    }

    next();
  } catch (error) {
    next(error);
  }
};
