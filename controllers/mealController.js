const express = require("express");
const { query } = require("../dbconnection");
const app = express();
const authController = require('./authController')

const dbconnection = require('../dbconnection')

const assert = require('assert')
const jwt = require('jsonwebtoken')
// const validateEmail = require('../util/emailvalidator')
const logger = require('../config/config').logger
const jwtSecretKey = require('../config/config').jwtSecretKey

let mealController = {
    getAllmeals(req, res) {
        dbconnection.getConnection(function (err, connection) {
          if (err) throw err; // not connected!
        
          connection.query(
            "SELECT * FROM meal;",
            function (error, results, fields) {
              connection.release();
  
              if (error) throw error;
              
              if (results.length>0){
                return res.status(200).json({
                     statusCode: 200,
                     results: results,
                })
            }else{
                res.status(404).json({
                     statusCode: 404,
                     result: 'There is no user with this id!',
                })
        
              dbconnection.end( (err) => {
                console.log('pool party is closed')
              });
            }
            })
        });
      },
      getDetailMeal(req, res, next)  {
        const param = req.params.mealId;
        dbconnection.getConnection(function (err, connection) {
          if (err) throw err; // not connected!
          console.log(param)
          
          let queryDetail = "SELECT * FROM meal WHERE meal.id = " + param + ";"
        
          console.log(queryDetail)
          connection.query(
            queryDetail,
            function (error, results, fields) {
              connection.release();

              if (error) throw error;
              
              if (results.length>0){
                return res.status(200).json({
                     statusCode: 200,
                     results: results,
                })
            }else{
              res.status(404).json({
                statusCode: 404,
                message: 'There is no meal with this id!',
           })
        
            }
            })
        });
      
      },
      deleteMeal(req, res, next)  {
        const param = req.params.mealId
          dbconnection.getConnection(function (err, connection) {
              if (err) throw err; // not connected!
              console.log(param)
              
              let queryDetail = "SELECT * FROM meal WHERE meal.id = " + param + " AND meal.cookId = " + req.userId +  ";"
            
              console.log(queryDetail)
              connection.query(
                queryDetail,
                function (error, results, fields) {
                  connection.release();
    
                  if (error) throw error;
                  
                  if (results.length>0){
                    dbconnection.getConnection(function (err, connection) {
                      if (err) throw err; // not connected!
                      console.log(param)
                      
                      let queryDetail = "DELETE FROM meal WHERE meal.id = " + param + ";"
                    
                      console.log(queryDetail)
                      connection.query(
                        queryDetail,
                        function (error, results, fields) {
                          connection.release();
            
                          if (error) throw error;
                          
                          if (results.affectedRows > 0){
                            return res.status(200).json({
                              statusCode: 200,
                              results: "Meal deleted",
                         })
                        }else{
                          res.status(404).json({
                            statusCode: 404,
                            message: 'There is no meal with this id!',
                       })
                    
                        }
                        })
                    });
                      
                }else{
                  res.status(404).json({
                    statusCode: 404,
                    message: 'This is not your meal',
               })
            
                }
                })
            });
      },
      createMeal(req, res, next)  {
        console.log(req.userId)
          let id =  req.body.id;
          let isActive =  req.body.isActive;
          let isVega =  req.body.isVega;
          let isVegan =  req.body.isVegan;
          let isToTakeHome =  req.body.isToTakeHome;
          let dateTime =  req.body.dateTime;
          let maxAmountOfParticipants =  req.body.maxAmountOfParticipants;
          let price =  req.body.price;
          let imageUrl =  req.body.imageUrl;
          let cookId  =  req.userId;
          let nameBody  =  req.body.name;
          let descriptionBody  =  req.body.description;
          let allergenesBody  =  req.body.allergenes;
          dbconnection.getConnection(function (err, connection) {
            let query = `INSERT INTO meal (id, isActive, isVega, isVegan, isToTakeHome, dateTime, maxAmountOfParticipants, price, imageUrl,cookId , createDate, updateDate, name, description, allergenes) VALUES ?`
            var values = [
                [
                    id,
                    isActive,
                    isVega,
                    isVegan,
                    isToTakeHome,
                    "2020-01-01 10:10:10",
                    maxAmountOfParticipants,
                    price,
                    imageUrl,
                    cookId,
                    "2020-01-01 10:10:10",
                    "2020-01-01 10:10:10",
                    nameBody,
                    descriptionBody,
                    allergenesBody,
                ],
            ]
            connection.query(
                query,
                [values],
                function (error, results, fields) {
                connection.release();

                if (error){
                  return res.status(401).json({
                    statusCode: 401,
                    message: error
                  })
                } else {
                  let meal = { id: results.insertId, ...req.body };
                  return res.status(201).json({
                    statusCode: 201,
                    results: meal
                })
                }
                })
            });
      },
      particepate(req, res)  {
        const param = req.params.mealId
        dbconnection.getConnection(function (err, connection) {
            if (err) throw err; // not connected!
            console.log(param)
            
            let queryDetail = "SELECT * FROM meal WHERE meal.id = " + param + ";"
          
            console.log(queryDetail)
            connection.query(
              queryDetail,
              function (error, results, fields) {
                connection.release();
  
                if (error) throw error;
                
                if (results.length>0){
                    dbconnection.getConnection(function (err, connection) {
                        let query = `INSERT INTO meal_participants_user (mealId, userId) VALUES ?`
                        var values = [
                            [
                                req.params.mealId,
                                req.userId,
                            ],
                        ]
                        console.log('Meal id: ' + req.params.mealId)
                        console.log('User id : ' + req.userId)
                        connection.query(
                            query,
                            [values],
                            function (error, results, fields) {
                            connection.release();
            
                            if (error){
                              return res.status(400).json({
                                statusCode: 400,
                                result: "Er is iets fout gegaan"
                              })
                            } else {
                              return res.status(201).json({
                                statusCode: 201,
                                result: "Succesvol ingeschreven"
                            })
                            }
                            })
                        });
              }else{
                res.status(400).json({
                  statusCode: 400,
                  result: 'There is no meal with this id!',
             })
          
              }
              })
          });
        },
        particepateDelete(req, res)  {
          const param = req.params.mealId
          dbconnection.getConnection(function (err, connection) {
              if (err) throw err; // not connected!
              console.log(param)
              
              let queryDetail = "SELECT * FROM meal WHERE meal.id = " + param + ";"
            
              console.log(queryDetail)
              connection.query(
                queryDetail,
                function (error, results, fields) {
                  connection.release();
    
                  if (error) throw error;
                  
                  if (results.length>0){
                    dbconnection.getConnection(function (err, connection) {
                      if (err) throw err; // not connected!
                      console.log(param)
                      
                      let queryDetail = "DELETE FROM meal_participants_user WHERE meal_participants_user.mealId = " + param + " AND meal_participants_user.userId ="+ req.userId+" ;"
                    
                      console.log(queryDetail)
                      connection.query(
                        queryDetail,
                        function (error, results, fields) {
                          connection.release();
            
                          if (error) throw error;
                          
                          if (results.affectedRows > 0){
                            return res.status(200).json({
                              statusCode: 200,
                              results: "Deelnamen succesvol verwijdert",
                         })
                        }else{
                          res.status(404).json({
                            statusCode: 404,
                            message: 'Jij staat niet ingeschreven voor deze meal',
                       })
                    
                        }
                        })
                    });
                      
                }else{
                  res.status(400).json({
                    statusCode: 400,
                    result: 'There is no meal with this id!',
               })
            
                }
                })
            });
          },
          updateMeal: (req, res, next) => {
            logger.debug("mealController: updateMeal called.");
            //format allergenes JSON to the right string for the query
            const allergenes = req.body.allergenes;
            let allergenesString = "";
            for (let index = 0; index < allergenes.length; index++) {
              allergenesString += allergenes[index] + ",";
            }
            if (allergenesString !== "") {
              allergenesString = allergenesString.slice(0, -1);
            }
        
            let mealReq = req.body;
            mealReq.allergenes = allergenesString;
            logger.debug("mealController: updateMeal --> altered mealReq.");
            logger.debug(mealReq);
            dbconnection.getConnection(function (err, connection) {
              //not connected
              if (err) {
                next(err);
              }
              connection.query(
                "SELECT * FROM meal WHERE id = ?",
                [req.params.mealId],
                function (error, results, fields) {
                  // When done with the connection, release it.
                  connection.release();
                  // Handle error after the release.
                  if (error) {
                    next(error);
                  }
                  if (results.length === 0) {
                    return res.status(404).json({
                      status: 404,
                      message: `Meal doesn't exist.`,
                    });
                  }
                  // succesfull query handlers
                  if (results[0].cookId != req.userId) {
                    return res.status(403).json({
                      status: 403,
                      message: `Not authorized to update the meal.`,
                    });
                  } else {
                    // Use the connection
                    connection.query(
                      "UPDATE meal SET ? WHERE id = ?",
                      [mealReq, req.params.mealId],
                      function (error, results, fields) {
                        // When done with the connection, release it.
                        connection.release();
        
                        // Handle error after the release.
                        if (error) {
                          next(error);
                        }
        
                        // succesfull query handlers
                        if (results.affectedRows > 0) {
                          let mealUpdated = req.body;
                          res.status(200).json({
                            status: 200,
                            result: { id: req.params.mealId, ...mealUpdated },
                          });
                        }
                      }
                    );
                  }
                }
              );
            });
          },
}
module.exports = mealController;
    