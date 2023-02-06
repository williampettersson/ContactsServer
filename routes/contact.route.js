import express from "express";
import { contacts } from "../controller/mongodb.controller.js";
import { ObjectId } from "mongodb";

const router = express.Router();

router.post("/", (req, res) => {
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

router.get("/", (req, res) => {
  const list = [];
  contacts
    .find()
    .forEach((doc) => {
      doc.id = doc._id;
      delete doc._id;
      list.push(doc);
    })
    .then(() => {
      res.json({ contacts: list });
    })
    .catch((err) => {
      res.sendStatus(500);
      console.error(err);
    });
});

router.get("/:id", (req, res) => {
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

      result.id = result._id;
      delete result._id;

      res.json(result);
    })
    .catch((err) => {
      res.sendStatus(500);
      console.error(err);
    });
});

router.delete("/:id", (req, res) => {
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

router.patch("/:id", (req, res) => {
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

export default router;
