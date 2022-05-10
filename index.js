const express = require("express");
const app = express();
require('dotenv').config();
const port = process.env.PORT || 3000;
// const movieController = require('./controllers/movieController')
const userController = require('./controllers/userController')

const bodyParser = require("body-parser");
const req = require("express/lib/request");
app.use(bodyParser.json());


//Movie routes
// app.get('/movies', movieController.getAllMovies)
// app.get('/movie/:movieId', movieController.getDetailMovie)
// app.post('/movie', movieController.validateMovie ,movieController.storeMovie)
// app.delete('/movie/:movieId', movieController.deleteMovie)
// app.put('/movie/:movieId', movieController.updateMovie)

//User routes
app.get('/api/user', userController.getAllusers)
app.get('/api/user/:userId', userController.getDetailUser)
app.post('/api/user', userController.storeUser)
app.delete('/api/user/:userId', userController.deleteUser)
app.put('/api/user/:userId', userController.updateUser)


//Alle movie routes
// app.use('/api', );


app.all("*", (req, res, next) => {
  const method = req.method;
  console.log(`Method ${method} is aangeroepen`);
  next();
});


//Error handeler
app.use((err, req, res, next) =>{
  res.status(err.status).json(err)
})


app.get("/", (req, res) => {
  res.status(200).json({
    status: 200,
    result: "Hello",
  });
});


app.all("*", (req, res) => {
  res.status(400).json({
    status: 400,
    result: "End-point not found",
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

module.export = app