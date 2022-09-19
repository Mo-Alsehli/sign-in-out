import { User, UserModel } from "../models/user";
import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import auth from "../.././middleware/authintication";
import "express-async-errors";

dotenv.config();
const store = new UserModel();

const createUser = async (req: Request, res: Response) => {
  try {
    const user: User = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    };

    const newUser = await store.create(user);
    const token = jwt.sign(
      { name: newUser.name, id: newUser.id },
      process.env.JWT_SECRET as string
    );
    res.json({ name: newUser.name, token });
  } catch (error) {
    console.log(error);
  }
};

const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await store.index();
    res.json({ count: users.length, users });
  } catch (error) {
    console.log(error);
  }
};

const login = async (req: Request, res: Response) => {
  const user = { email: req.body.email, password: req.body.password };
  if (!user.email || !user.password) {
    throw new Error("Please Provide Email And Password");
  }
  try {
    const loggedUser = await store.login(user);
    if (!loggedUser) {
      throw new Error("User Doesn't Exist");
    }
    const token = jwt.sign(
      { token: loggedUser },
      process.env.JWT_SECRET as string
    );
    res.json({ name: loggedUser.name, token });
  } catch (error) {
    console.log(error);
  }
};

export const user_routes = (app: express.Application) => {
  app.get("/api/v1/users", auth, getUsers);
  app.post("/api/v1/register", createUser);
  app.post("/api/v1/login", login);
};
