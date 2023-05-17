import express from "express";
import cors from "cors";
import multer from "multer";
import mongoose from "mongoose";
// import ImagedataModel from "./Imagedata.model";
import ImagedataModel from "./Imagedata.model.js";
const app = express();
let url = "your mongo url";

const connection = mongoose
  .connect(url)
  .then(() => {
    console.log("connection sucess");
  })
  .catch((err) => {
    console.log(err, "db error");
  });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const ext = file.mimetype.split("/")[1];
    cb(null, `${file.fieldname}-${Date.now()}.${ext}`);
  },
});

const upload = multer({
  storage: storage,
});

// middleware use
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post(
  "/api/v1/upload",
  upload.single("image"),
  async (req, res) => {
    console.log(req.file, "file");
    try {
      if (req.file) {
        let imageData = new ImagedataModel({
          imageName: req.file.fieldname,
          data: req.file,
        });
        await imageData.save();
        console.log(imageData, "save data");
        res.status(200).json({ message: "file upload", file: imageData.data });
      }
    } catch (error) {
      res.status(200).json({ message: "error" });
    }
  },
  (error, req, res, next) => {
    res.status(400).json({ message: error.message, error: error.stack });
  }
);

export default app;