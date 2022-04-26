const express = require("express");
const app = express();


let database = []
let id = 0;
let movieController = {

    getAllMovies(req, res) {
        console.log('get all called')
        res.status(200).json({
            status: 200,
            result: database,
        })
    },
    storeMovie(req, res)  {
          let movie = req.body;
          id++;
          movie = {
            id,
            ...movie,
          };
          console.log(movie);
          database.push(movie);
          res.status(201).json({
            status: 201,
            result: database,
          });
    },
    getDetailMovie(req, res, next)  {
          const movieId = req.params.movieId;
          console.log(`Movie met ID ${movieId} gezocht`);
          let movie = database.filter((item) => item.id == movieId);
          if (movie.length > 0) {
            console.log(movie);
            res.status(200).json({
              status: 200,
              result: movie,
            });
          } else {
            res.status(401).json({
              status: 401,
              result: `Movie with ID ${movieId} not found`,
            });
          }
        },
      deleteMovie(req, res, next)  {
          const movieId = req.params.movieId;
          console.log(`Movie met ID ${movieId} gezocht`);
          let movie = database.filter((item) => item.id == movieId);
          if (movie.length > 0) {
            console.log(movie);
            console.log('RIP movie')
            database.splice(movie)
            res.status(200).json({
              status: 200,
              result: 'Movie deleted '+ movie,
            });
          } else {
            res.status(401).json({
              status: 401,
              result: `Movie with ID ${movieId} not found`,
            });
          }
        },
        updateMovie(req, res, next)  {
          const moveId = req.params.movieId;
          console.log('const = ' + moveId)
          console.log('parm = ' + req.params.movieId)
          let movieBody = req.body;
          console.log(`User met ID ${moveId} gezocht`);
          let movie = database.filter((item) => item.id == moveId);
          if (movie.length > 0) {
            console.log(movie);
            let id = moveId;
            movieBody = {
              id,
              ...movieBody,
            };
            database.splice(database.indexOf(moveId), 1, (movieBody))
            res.status(200).json({
              status: 200,
              result: "Movie updated",
            });
          } else {
            res.status(401).json({
              status: 401,
              result: `Movie with ID ${moveId} not found`,
            });
          }
        },
}
module.exports = movieController;
    