// Imports
const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const app = express();
const port = 8000;
const mysql = require("mysql2");

app.get("/documents", (req, res) => {
    var url = "http://localhost:3000/dokumen";
    axios
      .get(url)
      .then(function (response) {
        res.render("userIndex", {
          title: "daftar User",
          layout: "../layout/main-layout",
          data: response.data,
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  });
