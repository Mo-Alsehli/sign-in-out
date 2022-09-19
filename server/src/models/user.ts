import client from "../database";
import bcrypt from "bcryptjs";
import "express-async-errors";

export type User = {
  id?: string;
  name?: string;
  email: string;
  password: string;
};

export class UserModel {
  async index(): Promise<User[]> {
    try {
      const conn = await client.connect();
      const sql = "SELECT * FROM users;";
      const result = await conn.query(sql);
      return result.rows;
    } catch (error) {
      throw new Error(`Couldn't Get Users Data: User Model: ${error}`);
    }
  }

  async create(u: User): Promise<User> {
    try {
      const conn = await client.connect();
      const sql =
        "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *;";
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(u.password, salt);
      const result = await conn.query(sql, [u.name, u.email, hash]);
      const user = result.rows[0];
      conn.release();
      return user;
    } catch (error) {
      throw new Error(`Couldn't Create User: User Model: ${error}`);
    }
  }

  async login(u: User) {
    try {
    } catch (error) {
      throw new Error(`Can't Login User:${u}: ${error}`);
    }
    const conn = await client.connect();
    const sql = "SELECT password FROM users WHERE email=$1;";
    const result = await conn.query(sql, [u.email]);
    if (result.rows.length) {
      const user = result.rows[0];
      const isPassed = await bcrypt.compare(u.password, user.password);
      if (isPassed) {
        const sql = "SELECT email, name FROM users WHERE email=$1;";
        const userInfo = await conn.query(sql, [u.email]);
        return userInfo.rows[0];
      }
    }
    conn.release();
    return null;
  }
}
