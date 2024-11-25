///
const express = require('express');
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const cors = require("cors");

///app
const app = express();


///port
const port = process.env.PORT || 5005;

////routes



///middleware
app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

////protectedRoute 






app.get('/', (req, res) => {
  res.send('Express JS on Vercel')
})

app.get('/ping', (req, res) => {
  res.send('pong 🏓')
})

app.listen(port, (err, res) => {
  if (err) {
    console.log(err)
    return res.status(500).send(err.message)
  } else {
    console.log("-INFO- Server is running on port: ", port)
    mongoose.set("useFindAndModify", false);
    mongoose.set("useUnifiedTopology", true);
    mongoose.connect(process.env.DB_STRING, { useNewUrlParser: true })
  }
})
