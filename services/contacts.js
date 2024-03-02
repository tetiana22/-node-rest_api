import { Contact } from "../models/contacts.js";

export const listContacts = async () => {
  try {
    const contacts = await Contact.find();
    return contacts;
  } catch (error) {
    console.log(error);
  }
};

export const getContactById = async (contactId) => {
  try {
    const contact = Contact.findById(contactId);
    return contact;
  } catch (error) {
    console.log(error);
  }
};

export const removeContact = async (contactId) => {
  try {
    const removeContact = await Contact.findByIdAndDelete(contactId);
    console.log(removeContact);
    return removeContact;
  } catch (error) {}
};

export const addContact = async (contactData) => {
  try {
    const newContact = await Contact.create(contactData);
    return newContact;
  } catch (error) {
    console.log(error);
  }
};

export const updateContacts = async (contactId, data) => {
  try {
    await Contact.findByIdAndUpdate(contactId, data);

    const updateContact = await Contact.findById(contactId);
    return updateContact;
  } catch (error) {}
};
