import "./database.js";

import bcrypt from "bcrypt";
import express from "express";
import jwt from "jsonwebtoken";
import qrcode from "qrcode";

import { UserModel } from "./models.js";

export const app = express();

app.use(express.json());

app.post("/api/register", async (req, res) => {
  try{
    const { name, email, password } = req.body;

    if (!name) {
      return res.status(400).send({ message: "Name is necessary"})
    }

    if(!email) {
      return res.status(400).send({ message: "Email is necessary"})
    }

    if(!password) {
      return res.status(400).send({ message: "Password is necessary"})
    }
    const existingUser = await UserModel.findOne({ email});
    if(existingUser) {
      return res.status(400).send({ message: "User already exists"})
    }

    await UserModel.create({
      name,
      email,
      password: bcrypt.hashSync(password, 10),
    })

    res.send({ message: "User registered successfully"});
  
  }
  catch(error ){
    console.error("Failed to register", error);
    res.status(500).send({ message: "Failed to register", error});

  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).send({ message: "Email is necessary" });
    }

    if (!password) {
      return res.status(400).send({ message: "Password is necessary" });
    }

    const existingUser = await UserModel.findOne({ email });
    if (!existingUser) {
      return res.status(404).send({ message: "User not found" });
    }

    const isPasswordValid = bcrypt.compareSync(password, existingUser.password);
    if (!isPasswordValid) {
      return res.status(401).send({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: existingUser._id }, "Hareesh404", {
      expiresIn: "1h",
    });

    res.send({ message: "Login successful", token });
  } 
  catch (error) {
    console.error("Failed to login Please Register first", error);
    res.status(500).send({ message: "Failed to login Please Register first", error });
  }
});

app.use("/api", async (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(400).send({ message: "Token is required!" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(400).send({ message: "Invalid token!" });
    }

    req.userId = decoded.userId;

    next();
  } catch (error) {
    console.error("Failed to verify token", error);
    return res.status(400).send({ message: "Invalid token!", error });
  }
});

app.get("/api/qrcode", async (req, res) => {
  try {
    if (!req.query.text) {
      return res.send({ message: "Text is required!" });
    }

    const imageUrl = await qrcode.toDataURL(req.query.text, {
      scale: 15,
    });

    res.send({ imageUrl });
  } catch (error) {
    console.error("Failed to generate QR", error);
    res.send({ message: "Failed to generate QR!", error });
  }
});