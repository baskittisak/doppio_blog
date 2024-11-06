import express from "express";
import { register, login } from "../controllers/auth.controller.js";
import { validateBodyRequest } from "../middleware/validate.middleware.js";
import { typeUser } from "../models/user.model.js";

export const router = express.Router();

router.post("/register", validateBodyRequest(typeUser), register);
router.post("/login", validateBodyRequest(typeUser), login);
