const express = require("express");
const multer = require("multer");
require("dotenv").config();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/files");
  },
  filename: (req, file, cb) => {
    const { originalname } = file;
    cb(null, Date.now() + originalname);
  },
});

const upload = multer({ storage });

module.exports = upload;
