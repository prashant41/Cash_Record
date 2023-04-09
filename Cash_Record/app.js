require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const port = 3001;

const ejs = require("ejs");
app.set("view engine", "ejs");



//Database Connectivity
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true });
var db = mongoose.connection;
db.on('error', () => {
    console.log("Error in connecting to database");
});
db.once('open', () => {
    console.log("Connected to database");
});
//Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

//Routes

app.get("/", (req, res) => {
    res.set({ "Allow-access-Allow-Origin": "*" });
    return res.redirect('index.html');
});

app.post("/record", (req, res) => {
    var cash = req.body.cash;
    var book = req.body.book;
    var delivery = req.body.delivery;

    var data = {
        "date": new Date(),
        "cash": Number(cash),
        "book": Number(book),
        "delivery": Number(delivery),
    };
    db.collection('amount').insertOne(data, (err, collection) => {
        if (err) {
            throw err;
        }
        console.log("Record inserted successfully");
    });
    return res.redirect('record_success.html');
});


app.get("/display", (req, res) => {
    mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true });
    var db = mongoose.connection;

    db.collection("amount").find({}).toArray((err, data) => {
      if (err) throw err;
      res.render("display", { data: data });
    });
  });
  

//Port
app.listen(port, () => {
    console.log(`Server is running at ${port}`);
});
