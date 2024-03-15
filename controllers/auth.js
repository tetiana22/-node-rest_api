import jwt from "jsonwebtoken";
import HttpError from "../helpers/HttpError.js";
import { User } from "../models/user.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import gravatar from "gravatar";
import fs from "fs/promises";
import { fileURLToPath } from "url";
import { dirname } from "path";
import Jimp from "jimp";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const tmpDir = path.join(__dirname, "../tmp");

dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY;
const avatarDir = path.join(__dirname, "../", "public", "avatars");

export const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user) {
      throw HttpError(409, "Email in use");
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const avatarURL = gravatar.url(email);
    const newUser = await User.create({
      ...req.body,
      password: hashPassword,
      avatarURL,
    });
    res.status(201).json({
      user: {
        subscription: newUser.subscription,
        email: newUser.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      throw HttpError(401, "Email or password is wrong");
    }

    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      throw HttpError(401, "Email or password is wrong");
    }

    const { _id: id } = user;
    const payload = { id };

    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
    await User.findByIdAndUpdate(id, { token });

    const subscription = user.subscription;

    res.json({
      token: token,
      user: {
        email: email,
        subscription: subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getCurrent = async (req, res, next) => {
  try {
    const { email, subscription } = req.user;
    res.json({
      email: email,
      subscription: subscription,
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { token: " " });
    res.status(204).json("No Content");
  } catch (error) {
    next(error);
  }
};

export const updateSubscription = async (req, res, next) => {
  try {
    const { subscription } = req.body;
    if (!["starter", "pro", "business"].includes(subscription)) {
      throw HttpError(400, "Invalid subscription type");
    }
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { subscription },
      { new: true }
    );
    res.json({
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateAvatars = async (req, res, next) => {
  try {
    if (!req.file) {
      res.status(400).json({ message: "File not uploaded" });
      return;
    }
    const { _id } = req.user;
    const { path: tmpUpload, originalname } = req.file;
    const filename = `${_id}_${originalname}`;
    const resultUpload = path.join(avatarDir, filename);
    await fs.rename(tmpUpload, resultUpload);
    const avatar = await Jimp.read(resultUpload);
    await avatar.resize(250, 250).writeAsync(resultUpload);
    const avatarURL = path.join("avatars", filename);
    await User.findByIdAndUpdate(_id, { avatarURL });
    res.json({ avatarURL });
    if (!avatarURL) {
      throw new HttpError(401, "not avatar");
    }
  } catch (error) {
    next(error);
  }
};
