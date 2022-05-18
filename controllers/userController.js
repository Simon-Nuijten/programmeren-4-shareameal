const express = require("express");
const { query } = require("../dbconnection");
const app = express();

const dbconnection = require('../dbconnection')

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
      
            dbconnection.end( (err) => {
              console.log('pool party is closed')
            });
          }
          })
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
                   Status: 200,
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
                Status: 400,
                message: "Je mag geen velden leeg laten",
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
                    Status: 409,
                    message: "User email bestaat al"
                  })
                } else {
                  return res.status(201).json({
                    Status: 201,
                    results: values
                })
                }
                
          
                dbconnection.end( (err) => {
                  console.log('pool party is closed')
                });
              })
          });
        
    },
    getDetailUser(req, res, next)  {
          const param = req.params.userId;
          dbconnection.getConnection(function (err, connection) {
            if (err) throw err; // not connected!
            console.log(param)
            let queryDetail
            if (param + 5 >= 0) {
               console.log("number")
               queryDetail = "SELECT * FROM user WHERE user.id = " + param + ";"
            } else {
              console.log("String")
               queryDetail = `SELECT * FROM user WHERE user.firstName = '${param}';`
            }
            console.log(queryDetail)
            connection.query(
              queryDetail,
              function (error, results, fields) {
                connection.release();

                if (error) throw error;
                
                if (results.length>0){
                  return res.status(200).json({
                       Status: 200,
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
                       Status: 200,
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
      deleteUser(req, res, next)  {
          const userid = req.params.userId;
          console.log(`User met ID ${userid} verwijdert`);
          dbconnection.getConnection(function (err, connection) {
            if (err) throw err; // not connected!
          
            connection.query(
              "DELETE FROM user WHERE user.id = " + userid + ";",
              function (error, results, fields) {
                connection.release();

                if (results.affectedRows > 0){
                  return res.status(200).json({
                    Status: 200,
                    results: "User succesvol verwijdert",
               })
                }
                else {
                  res.status(400).json({
                    Status: 400,
                    message: 'There is no user with this id!',
               })
                }
                
                  
          
          
                dbconnection.end( (err) => {
                  console.log('pool party is closed')
                });
              
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
                Status: 400,
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
                    status: 400,
                    error: error.message,
                  });
                }
      
                // succesfull query handlers
                if (results.affectedRows > 0) {
                  res.status(200).json({
                    status: 200,
                    result: `User with id ${req.params.userId} updated.`,
                  });
                } else {
                  res.status(400).json({
                    status: 400,
                    result: `Updating user failed.`,
                  });
                }
              }
            );
          })
        },
}
module.exports = userController;
    