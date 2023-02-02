import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.port || 5500;

app.get("/", (req, res) => {
  res.send("It's alive!");
});

app.listen(port, () => {
  console.log(`Listening to port ${port}`);
});
