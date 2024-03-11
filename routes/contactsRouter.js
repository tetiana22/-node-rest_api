import express from "express";
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
  updateFavorite,
} from "../controllers/contactsControllers.js";
import validateBody from "../middlewares/validateBody.js";
import {
  createContactSchema,
  updateContactSchema,
  favoriteUpdateSchema,
} from "../models/contacts.js";
import { isValidId } from "../middlewares/isValidId.js";
import { authenticate } from "../middlewares/authenticate.js";

const contactsRouter = express.Router();

contactsRouter.get("/", authenticate, getAllContacts);

contactsRouter.get("/:contactId", authenticate, isValidId, getOneContact);

contactsRouter.delete("/:contactId", authenticate, isValidId, deleteContact);

contactsRouter.post(
  "/",
  authenticate,
  validateBody(createContactSchema),
  createContact
);

contactsRouter.put(
  "/:contactId",
  authenticate,
  isValidId,
  validateBody(updateContactSchema),
  updateContact
);
contactsRouter.patch(
  "/:contactId/favorite",
  authenticate,
  isValidId,
  validateBody(favoriteUpdateSchema),
  updateFavorite
);

export default contactsRouter;
