import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { username, password, email } = req.body;

    const user = await User.findOne({ username, email });
    if (user) {
      res.status(409).json({ message: "User already exists" });
    } else {
      const salt = await bcrypt.genSalt(10);
      const passwordHashed = await bcrypt.hash(password, salt);
      const newUser = {
        username,
        password: passwordHashed,
        email,
      };

      await new User(newUser).save();
      res.status(201).json({ message: "User registered successfully" });
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Internal server error" });
    }
  }
};

const signJwtToken = (user, res) => {
  const payload = {
    username: user.username,
    email: user.email,
  };

  const { SECRET_KEY } = process.env;
  if (!SECRET_KEY) throw "Internal server error: Missing SECRET_KEY";

  jwt.sign(
    payload,
    SECRET_KEY,
    (error, token) => {
      if (error) throw error;
      res.status(200).json({ data: token, message: "User login successfully" });
    }
  );
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (user) {
      const isPasswordCorrect = bcrypt.compare(password, user.password);
      if (isPasswordCorrect) {
        signJwtToken(user, res);
      } else {
        res.status(401).json({ message: "Invalid username or password" });
      }
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Internal server error" });
    }
  }
};
