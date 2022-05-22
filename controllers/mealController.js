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
                     Status: 404,
                     message: 'There is no user with this id!',
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
        const param = req.params.mealId;
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
                  results: "Meal succesvol verwijdert",
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
          let name  =  req.name;
          let description  =  req.description;
          let allergenes  =  req.allergenes;
          let createDate  =  req.createDate;
          let updateDate  =  req.updateDate;
          dbconnection.getConnection(function (err, connection) {
            let query = `INSERT INTO meal (id, isActive, isVega, isVegan, isToTakeHome, dateTime, maxAmountOfParticipants, price, imageUrl,cookId , createDate, updateDate, name, description, allergenes) VALUES ?`
            var values = [
                [
                    id,
                    isActive,
                    isVega,
                    isVegan,
                    isToTakeHome,
                    dateTime,
                    maxAmountOfParticipants,
                    price,
                    imageUrl,
                    cookId,
                    2008-04-04,
                    2008-04-04,
                    'pannenkoeken',
                    'met stroop',
                    'gluten',
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
                  return res.status(201).json({
                    statusCode: 201,
                    result: values
                })
                }
                dbconnection.end( (err) => {
                    console.log('pool party is closed')
                  });
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
}
module.exports = mealController;
    