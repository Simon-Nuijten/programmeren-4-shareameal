const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const movieController = require('./controllers/movieController')
const userController = require('./controllers/userController')

const bodyParser = require("body-parser");
const req = require("express/lib/request");
app.use(bodyParser.json());

let database = [];

//Movie routes
app.get('/movies', movieController.getAllMovies)
app.get('/movieDetail/:movieId', movieController.getDetailMovie)
app.post('/movieAdd', movieController.storeMovie)

//User routes
app.get('/users', userController.getAllusers)
app.get('/userDetail/:userId', userController.getDetailUser)
app.post('/userAdd', userController.storeUser)


app.all("*", (req, res, next) => {
  const method = req.method;
  console.log(`Method ${method} is aangeroepen`);
  next();
});

app.get("/", (req, res) => {
  res.status(200).json({
    status: 200,
    result: "Hello World",
  });
});


app.all("*", (req, res) => {
  res.status(401).json({
    status: 401,
    result: "End-point not found",
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
