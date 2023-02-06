import express from "express";
import { contacts } from "../controller/mongodb.controller.js";
import { ObjectId } from "mongodb";

const router = express.Router();

const serverError = { statusCode: 500, message: "Internal Server Error." };
const notFound = {
  statusCode: 404,
  message: "URL cannot be found or user is not found.",
};

router.post("/", (req, res) => {
  const body = req.body;
  if (!body?.name || (!body.phone && !body.email)) {
    res.status(400).json({
      statusCode: 400,
      message: "Input must contain phone and/or email.",
    });
    return;
  }

  if (body.name.length > 50 || body.phone.length > 15) {
    res.status(400).json({
      statusCode: 400,
      message: "Name or phone have too many characters.",
    });
    return;
  }

  contacts
    .insertOne({ name: body.name, phone: body.phone, email: body.email })
    .then((result) => {
      res.status(201).json({ id: result.insertedId });
    })
    .catch((err) => {
      res.status(500).json(serverError);
      console.error(serverError.message);
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
      res.status(500).json(serverError);
      console.error(serverError.message);
    });
});

router.get("/:id", (req, res) => {
  let id;
  try {
    id = ObjectId.createFromHexString(req.params.id);
  } catch {
    res.status(400).json({ statusCode: 400, message: "Invalid Id" });
    return;
  }

  contacts
    .findOne({ _id: id })
    .then((result) => {
      if (!result) {
        res.status(404).json(notFound);
        return;
      }

      result.id = result._id;
      delete result._id;

      res.json(result);
    })
    .catch((err) => {
      res.status(500).json(serverError);
      console.error(err);
    });
});

router.delete("/:id", (req, res) => {
  let id;
  try {
    id = ObjectId.createFromHexString(req.params.id);
  } catch {
    res.status(404).json(notFound);
    return;
  }

  contacts
    .deleteOne({ _id: id })
    .then((result) => {
      if (result.deletedCount != 1) {
        res.status(404).json(notFound);
        return;
      }

      res.sendStatus(200);
    })
    .catch((err) => {
      res.status(500).json(serverError);
      console.error(serverError.message);
    });
});

router.patch("/:id", (req, res) => {
  const body = req.body;

  if (!body?.name && !body.phone && !body.email) {
    res.status(404).json(notFound);
    return;
  }

  let id;
  try {
    id = ObjectId.createFromHexString(req.params.id);
  } catch {
    res.status(404).json(notFound);
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
        res.status(404).json(notFound);
        return;
      }

      res.status(500).json(serverError);
    })
    .catch((err) => {
      res.status(500).json(serverError);
      console.error(serverError.message);
    });
});

export default router;
