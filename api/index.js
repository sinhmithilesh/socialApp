const express = require("express");
const app = express();
const cors = require("cors");
const fs = require("fs");
const multer = require("multer");
const path = require("path");

const mongoose = require("mongoose");
const helmet = require("helmet");
const morgan = require("morgan");
const dotenv = require("dotenv");

const userRoutes = require("./routes/user");
const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/post");

dotenv.config();

// middlewares
app.use(express.json()); // it is req.body parser when we make request

app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

app.use(morgan("common"));


/* it is not good idea to use rest api for file server storages, we can use amazon or firebase, 
but here just for practice i m doing.

-- below line tells express not to perform request whenever it recieves "images" path, 
insted go to given directory , here public/images */


app.use("/images", express.static(path.join(__dirname, "public/images")));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    console.log("boy::", req.body);
    cb(null, file.originalname); // it is the name that we sending form client
  },
});

const upload = multer({ storage });


app.post("/api/upload", upload.single("file"), (req, res) => {
  try {
    return res.status(200).json("Files uploaded successfully");
  } catch (err) {
    console.log(err);
  }
});

//enables cors
app.use(cors());
app.options("*", cors());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);

async function main() {
  await mongoose.connect(`${process.env.MONGO_URL}`, { useNewUrlParser: true });
  // console.log('DB connected')
  app.listen(8085, () => console.log("server is running on 8085"));
}

main()
  .then(() => console.log("DB connected"))
  .catch((err) => console.log(err));
