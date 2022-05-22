## Introduction

Hello, I am Simon Nuijten. I made this API for a school project. During this project we learned the basic routes of JavaScript and the combination with SQL. Keep reading to find out how to use this API.

## Features
###### Post routes:
- ✨User creation ✨
- ✨Meal creation ✨
- ✨Meal participation✨
- ✨Login✨

###### Get routes:
- ✨Show all users ✨
- ✨Show detail user✨
- ✨Show all meals✨
- ✨Show detail meal✨

###### put routes:
- ✨Update user✨
- ✨Update meal✨

###### Delete routes:
- ✨Delete user✨
- ✨Delete meal✨
- ✨Delete participation✨

## How to use
The API is very straight forward to use. If you copy paste the routes listed below and use the server (Also listed below) you can make a request to the API. Make sure you use the correct type of routes. Sending a post request to a get route won't work or you accidentally submit a different request

##### Server

```sh
https://nuijten-nodejs.herokuapp.com/
```

| Routes | use |
| ------ | ------ |
| /api/meals | Gets all meals |
| /api/meal/:mealId | Gets a specific meal |
| /api/meal | Stores a meal |
| /api/meal/$id | Updates a meal |
| /api/meal/$id | Deletes a meal |
| /api/mealParticepate/:mealId | Submits user for a meal |
| /api/mealParticepate/:mealId | Deletes user for a meal |
|  ----------------------------------- | -------------------------- |
| /api/users | Gets all users |
| /api/user/:userId | Gets a specific user |
| /api/user | Stores a user |
| /api/user/$id | Updates a user |
| /api/user/$id | Deletes a user |