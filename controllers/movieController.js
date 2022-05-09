const express = require("express");
const app = express();
const assert = require('assert');
const dbconnection = require('../../programmeren-4-shareameal/dbconnection')
let id = 0;
let movieController = {
  validateMovie:(req, res, next)=>{
    let movie = req.body
    let {
      title, year, studio
    } = movie;
    try{
      assert(typeof title === 'string', 'Title moet een String zijn')
      assert(typeof year === 'number', 'Year moet een number zijn')
      assert(typeof studio === 'string', 'Studio moet een String zijn')
      next()
    } catch (err){
      const error = {
        status: 400,
        response: err.message
      }
      console.log(err)
      res.status(400).json({
        status: 400,
        result: err.toString(),
      })
      next(error)
    }
  },
    getAllMovies(req, res) {
        dbconnection.getConnection(function (err, connection) {
          if (err) throw err; // not connected!
        
          // Use the connection
          connection.query(
            "SELECT id, name FROM meal;",
            function (error, results, fields) {
              // When done with the connection, release it.
              connection.release();
        
              // Handle error after the release.
              if (error) throw error;
              
              res.status(200).json({
                statusCode: 300,
                results: results
              })
              console.log("result = ", results);
        
              dbconnection.end( (err) => {
                console.log('pool party is closed')
              });
            }
          );
        });
        
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
          dbconnection.getConnection(function (err, connection) {
            if (err) throw err; // not connected!
          
            // Use the connection
            connection.query(
              "SELECT id, name FROM meal WHERE meal.id = " + movieId + ";",
              function (error, results, fields) {
                // When done with the connection, release it.
                connection.release();
          
                // Handle error after the release.
                if (error) throw error;
                
                res.status(200).json({
                  statusCode: 300,
                  results: results
                })
                console.log("result = ", results);
          
                dbconnection.end( (err) => {
                  console.log('pool party is closed')
                });
              }
            );
          });
          console.log(`Movie met ID ${movieId} gezocht`);
        },
      deleteMovie(req, res, next)  {
          const movieId = req.params.movieId;
          console.log(`Movie met ID ${movieId} verwijdert`);
          dbconnection.getConnection(function (err, connection) {
            if (err) throw err; // not connected!
          
            // Use the connection
            connection.query(
              "DELETE FROM meals WHERE id = "+ movieId +";",
              function (error, results, fields) {
                // When done with the connection, release it.
                connection.release();
          
                // Handle error after the release.
                if (error) throw error;
                
                res.status(200).json({
                  statusCode: 300,
                  results: results
                })
                console.log("result = ", results);
          
                dbconnection.end( (err) => {
                  console.log('pool party is closed')
                });
              }
            );
          });

            res.status(401).json({
              status: 401,
              result: `Movie with ID ${movieId} not found`,
            });
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
    