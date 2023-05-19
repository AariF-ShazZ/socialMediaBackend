import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from "dotenv";
import multer from 'multer';
import helmet from "helmet"
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes  from "./routes/auth.js"
import userRoutes  from "./routes/users.js"
import { register } from './controllers/auth.js';

// // CONFIGURATIONS //

const __filename = fileURLToPath(import.meta.url);
// console.log("directoRy => ",__filename);
const __dirname =path.dirname(__filename);

dotenv.config()
const app  = express()
app.use(express.json())
app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({palicy : "cross-origin"}))
app.use(morgan("common"))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({limit :"30mb",extended:true}))
app.use(bodyParser.urlencoded({limit :"30mb",extended:true}))
app.use(cors())
// app.use("/assets", express.static(path.join(__dirname,"public/assets")));

/* FILE STORAGE */

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
      const ext = file.mimetype.split("/")[1];
      cb(null, `${file.originalname}-${Date.now()}.${ext}`);
    },
  });
  
  const upload = multer({
    storage: storage,
  });
  

/*ROUTES WITH FILES */

app.get("/",(req,res) => {
    res.send("This is Home Page")
    // console.log("This is HOME page");
})

app.post("/auth/register",register)


/* ROUTES */

app.use("/auth",authRoutes)
app.use("/users",userRoutes)
/* MONGOOSE SETUP */

const PORT = process.env.PORT || 8080
 
mongoose
.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));;
})
.catch((error) => console.log(`${error} did not connect`));
