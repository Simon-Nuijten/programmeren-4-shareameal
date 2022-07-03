const express = require("express");
const dbconnection = require('../dbconnection')
const app = express();

const assert = require('assert')
const jwt = require('jsonwebtoken')
// const validateEmail = require('../util/emailvalidator')
const logger = require('../config/config').logger
const jwtSecretKey = require('../config/config').jwtSecretKey

let userController = {
    emailCheck(email) {
      dbconnection.getConnection(function (err, connection) {
        if (err) throw err; // not connected!
      
        connection.query(
          "SELECT * FROM user WHERE user.emailAdress = " + email + ";",
          function (error, results, fields) {
            connection.release();

            if (error) throw error;
            
            if (results.length>0){
              return true;
          }else{
              return false;
      
          }
          })
        });
    },
    getAllActiveUsers(req, res) {
      dbconnection.getConnection(function (err, connection) {
        if (err) throw err; // not connected!
      
        connection.query(
          "SELECT * FROM user WHERE isActive = 1 ;",
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
      
          
          }
          })
      });
    },
    userList: (req, res, next) => {
      logger.debug("userController: getAllUsers is called");
      let query = `SELECT * FROM user`;
      const { length, isActive, firstName } = req.query;
      logger.debug(
        `userController: GetAllUsers params --> length = ${length}, isActive = ${isActive}, firstName = ${firstName}`
      );
  
      if (isActive && firstName) {
        query += ` WHERE firstName = '${firstName}' AND isActive = ${isActive}`;
      } else if (isActive) {
        query += ` WHERE isActive = ${isActive}`;
      } else if (firstName) {
        query += ` WHERE firstName = '${firstName}'`;
      }
      if (length) {
        query += ` LIMIT ${length}`;
      }
  
      logger.debug("userController: getAllUsers --> Query: " + query);
  
      dbconnection.getConnection(function (err, connection) {
        //not connected
        if (err) {
          next(err);
        }
  
        // Use the connection
        connection.query(query, function (error, results, fields) {
          // When done with the connection, release it.
          connection.release();
  
          // Handle error after the release.
          if (error) {
            next(error);
          }
          res.status(200).json({
            statusCode: 200,
            result: results,
          });
        });
      });
    },
    getAllusers(req, res) {
      dbconnection.getConnection(function (err, connection) {
        if (err) throw err; // not connected!
      
        connection.query(
          "SELECT * FROM user;",
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
      
          
          }
          })
      });
    },
    storeUser(req, res)  {
          let firstName =  req.body.firstName;
          let lastName =  req.body.lastName;
          let userEmail =  req.body.emailAdress;
          let isActive =  req.body.isActive;
          let password =  req.body.password;
          let phoneNumber =  req.body.phoneNumber;
          let roles =  req.body.roles;
          let street =  req.body.street;
          let city =  req.body.city;
          dbconnection.getConnection(function (err, connection) {
            // if (err)
            //     return res.status(400).json({
            //         Status: 400,
            //         Error: err,
            //     })
            if(firstName == null | lastName == null | userEmail == null | password == null | isActive == null | phoneNumber == null | roles == null){
              return res.status(400).json({
                statusCode: 400,
                result: "Je mag geen velden leeg laten",
              })
            }
            let query = `INSERT INTO user (firstName, lastName, isActive, emailAdress, password, phoneNumber, roles, street, city) VALUES ?`
            var values = [
                [
                    firstName,
                    lastName,
                    isActive,
                    userEmail,
                    password,
                    phoneNumber,
                    roles,
                    street,
                    city,
                ],
            ]
            connection.query(
                query,
                [values],
                function (error, results, fields) {
                connection.release();

                if (error){
                  return res.status(409).json({
                    statusCode: 409,
                    result: "User email bestaat al"
                  })
                } else {
                  return res.status(201).json({
                    status: 201,
                    results: req.body
                })
                }
                
          
                
              })
          });
        
    },
    getDetailUser(req, res, next)  {
          const param = req.params.userId;
          dbconnection.getConnection(function (err, connection) {
            if (err) throw err; // not connected!
            console.log(param)
         
            let queryDetail = "SELECT * FROM user WHERE user.id = " + param + ";"
           
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
                  result: 'There is no user with this id!',
             })
          
             
              }
              })
          });
        
        },
        getNameUsers(req, res, next)  {
          const userName = req.params.userName;
          console.log(`User met ID ${userid} gezocht`);
          dbconnection.getConnection(function (err, connection) {
            if (err) throw err; // not connected!
          
            connection.query(
              "SELECT * FROM user WHERE user.firstName = " + userName + ";",
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
          
           
              }
              })
          });
        
        },
      // deleteUser(req, res, next)  {
      //     const param = req.params.userId;
      //     console.log(`User met ID ${userid} verwijdert`);
      //     dbconnection.getConnection(function (err, connection) {
      //       if (err) throw err; // not connected!
          
      //       connection.query(
      //         "DELETE FROM user WHERE user.id = " + param + ";",
      //         function (error, results, fields) {
      //           connection.release();

      //           if (results.affectedRows > 0){
      //             return res.status(200).json({
      //               statusCode: 200,
      //               results: "User deleted",
      //           })
      //         }
      //           else {
      //             res.status(400).json({
      //               statusCode: 400,
      //               result: 'There is no user with this id!',
      //          })
      //           }
                
      //         })
      //     });
      //   },
        deleteUser(req, res, next)  {
          const param = req.params.userId
            dbconnection.getConnection(function (err, connection) {
                if (err) throw err; // not connected!
                console.log(param)
                
                let queryDetail = "SELECT * FROM user WHERE user.id = " + param + ";"
              
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
                        
                        let queryDetail = "DELETE FROM user WHERE user.id = " + param + ";"
                      
                        console.log(queryDetail)
                        connection.query(
                          queryDetail,
                          function (error, results, fields) {
                            connection.release();
              
                            if (error) throw error;
                            
                            if (results.affectedRows > 0){
                              return res.status(200).json({
                                statusCode: 200,
                                results: "user deleted",
                           })
                          }else{
                            res.status(404).json({
                              statusCode: 404,
                              message: 'There is no user with this id!',
                         })
                      
                          }
                          })
                      });
                        
                  }else{
                    res.status(404).json({
                      statusCode: 404,
                      message: 'This is not your account',
                 })
              
                  }
                  })
              });
        },
        updateUser(req, res, next)  {
          let userReq = req.body;
          let {
            firstName,
            lastName,
            street,
            city,
            isActive,
            emailAdress,
            password,
            phoneNumber,
          } = userReq;
          dbconnection.getConnection(function (err, connection) {
            //not connected
            if (err)
              throw res.status(400).json({
                statusCode: 400,
                Error: err,
              });
      
            // Use the connection
            connection.query(
              `UPDATE user SET firstName = '${firstName}', lastName = '${lastName}', street = '${street}', city = '${city}', isActive = ${isActive}, emailAdress = '${emailAdress}', password = '${password}', phoneNumber = '${phoneNumber}' WHERE id = ${req.params.userId}`,
              function (error, results, fields) {
                // When done with the connection, release it.
                connection.release();
                // Handle error after the release.
                if (error) {
                  console.log(error);
                  return res.status(400).json({
                    statusCode: 400,
                    result: `Updating user failed.`,
                  });
                }
      
                // succesfull query handlers
                if (results.affectedRows > 0) {
                  res.status(200).json({
                    statusCode: 200,
                    result: req.body,
                  });
                } else {
                  res.status(400).json({
                    statusCode: 400,
                    result: `Updating user failed.`,
                  });
                }
              }
            );
          })
        },
}
module.exports = userController;
    