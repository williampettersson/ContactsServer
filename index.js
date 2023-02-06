import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Router } from "express";
import contactRoute from "./routes/contact.route.js";

dotenv.config();

const app = express();
const port = process.env.port || 5500;
app.use(express.json());
app.use(
  cors({
    origin: "https://contactbook-fb7v.onrender.com/",
  })
);
app.use(Router("./routes"));

app.use("/contact", contactRoute);

app.listen(port, () => {
  console.log(`Listening to port ${port}`);
});
