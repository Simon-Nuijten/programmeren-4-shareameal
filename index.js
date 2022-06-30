const express = require("express");
const app = express();
require('dotenv').config();
const port = process.env.PORT || 3000;
// const movieController = require('./controllers/movieController')
const userController = require('./controllers/userController')
const authController = require('./controllers/authController')
const mealController = require('./controllers/mealController')

const bodyParser = require("body-parser");
const req = require("express/lib/request");
app.use(bodyParser.json());

//Meal routes
app.get('/api/meals', authController.validateToken, mealController.getAllmeals)
app.get('/api/meal/:mealId', authController.validateToken, mealController.getDetailMeal)
app.delete('/api/meal/:mealId', authController.validateToken, mealController.deleteMeal)
app.post('/api/meal', authController.validateToken, mealController.createMeal)
app.post('/api/mealParticepate/:mealId', authController.validateToken, mealController.particepate)
app.delete('/api/mealParticepate/:mealId', authController.validateToken, mealController.particepateDelete)
app.put('/api/meal/:mealId', authController.validateToken, mealController.updateMeal)
//User routes
// app.get('/api/user', authController.validateToken, userController.getAllusers)
app.get('/api/user/:userId', authController.validateToken, userController.getDetailUser)
app.post('/api/user', authController.validateToken, userController.storeUser)
app.delete('/api/user/:userId', authController.validateToken, userController.deleteUser)
app.put('/api/user/:userId', authController.validateToken, userController.updateUser)
app.get( "/api/user", userController.userList);
app.get('/api/userActive', authController.validateToken, userController.getAllActiveUsers)

app.post('/api/login', authController.login)

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

module.exports = app