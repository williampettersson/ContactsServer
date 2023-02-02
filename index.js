import express from "express";
import dotenv from "dotenv";
import { contacts } from "./controller/mongodb.controller.js";

dotenv.config();

const app = express();
const port = process.env.port || 5500;
app.use(express.json());

app.get("/", (req, res) => {
  res.send("It's alive!");
});

app.post("/contact", (req, res) => {
  const body = req.body;
  if (!body?.name || (!body.phone && !body.email)) {
    res.sendStatus(400);
    return;
  }

  contacts
    .insertOne({ name: body.name, phone: body.phone, email: body.email })
    .then((result) => {
      res.json({ id: result.insertedId });
    })
    .catch((err) => {
      res.sendStatus(500);
      console.error(err);
    });
});

app.listen(port, () => {
  console.log(`Listening to port ${port}`);
});
