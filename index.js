import express from "express";
import dotenv from "dotenv";
import { contacts } from "./controller/mongodb.controller.js";
import { ObjectId } from "mongodb";

dotenv.config();

const app = express();
const port = process.env.port || 5500;
app.use(express.json());

app.post("/contact", (req, res) => {
  const body = req.body;
  if (!body?.name || (!body.phone && !body.email)) {
    res.sendStatus(400);
    return;
  }

  contacts
    .insertOne({ name: body.name, phone: body.phone, email: body.email })
    .then((result) => {
      res.status(201).json({ id: result.insertedId });
    })
    .catch((err) => {
      res.sendStatus(500);
      console.error(err);
    });
});

app.get("/contacts", (req, res) => {
  const list = [];
  contacts
    .find()
    .forEach((doc) => list.push(doc))
    .then(() => {
      res.json({ contacts: list });
    })
    .catch((err) => {
      res.sendStatus(500);
      console.error(err);
    });
});

app.get("/contact/:id", (req, res) => {
  let id;
  try {
    id = ObjectId.createFromHexString(req.params.id);
  } catch {
    res.sendStatus(400);
    return;
  }

  contacts
    .findOne({ _id: id })
    .then((result) => {
      if (!result) {
        res.sendStatus(404);
        return;
      }

      res.json(result);
    })
    .catch((err) => {
      res.sendStatus(500);
      console.error(err);
    });
});

app.delete("/contact/:id", (req, res) => {
  let id;
  try {
    id = ObjectId.createFromHexString(req.params.id);
  } catch {
    res.sendStatus(400);
    return;
  }

  contacts
    .deleteOne({ _id: id })
    .then((result) => {
      if (result.deletedCount != 1) {
        res.sendStatus(404);
        return;
      }

      res.sendStatus(200);
    })
    .catch((err) => {
      res.sendStatus(500);
      console.error(err);
    });
});

app.patch("/contact/:id", (req, res) => {
  const body = req.body;

  if (!body?.name && !body.phone && !body.email) {
    res.sendStatus(400);
    return;
  }

  let id;
  try {
    id = ObjectId.createFromHexString(req.params.id);
  } catch {
    res.sendStatus(400);
    return;
  }

  const change = {};

  if (body.name) change.name = body.name;
  if (body.phone) change.phone = body.phone;
  if (body.email) change.email = body.email;

  contacts
    .findOneAndUpdate({ _id: id }, { $set: change })
    .then((result) => {
      if (result.ok) {
        res.sendStatus(200);
        return;
      }

      if (!result.value) {
        res.sendStatus(404);
        return;
      }

      res.sendStatus(500);
    })
    .catch((err) => {
      res.sendStatus(500);
      console.error(err);
    });
});

app.listen(port, () => {
  console.log(`Listening to port ${port}`);
});
