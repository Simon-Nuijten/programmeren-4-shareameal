let userDatabase = []
let id = 0;
let userController = {

    getAllusers(req, res) {
        console.log('get all called')
        res.status(200).json({
            status: 200,
            result: userDatabase,
        })
    },
    storeUser(req, res)  {
          let user = req.body;
          id++;
          user = {
            id,
            ...user,
          };
          let userEmail =  req.body.emailAdress;
          let item = userDatabase.filter((item) => item.emailAdress == userEmail)
          if(item.length > 0){
            res.status(401).json({
              status: 401,
              result: "User allready exists",
            });
          } else {
            console.log(user);
          userDatabase.push(user);
            res.status(201).json({
              status: 201,
              result: userDatabase,
            });
          }  
    },
    getDetailUser(req, res, next)  {
          const userid = req.params.userId;
          console.log(`User met ID ${userid} gezocht`);
          let user = userDatabase.filter((item) => item.id == userid);
          if (user.length > 0) {
            console.log(user);
            res.status(200).json({
              status: 200,
              result: user,
            });
          } else {
            res.status(401).json({
              status: 401,
              result: `User with ID ${userid} not found`,
            });
          }
        },
      deleteUser(req, res, next)  {
          const userid = req.params.userId;
          console.log(`User met ID ${userid} gezocht`);
          let user = userDatabase.filter((item) => item.id == userid);
          if (user.length > 0) {
            console.log(user);
            console.log('RIP user')
            userDatabase.splice(user)
            res.status(200).json({
              status: 200,
              result: "User deleted " + user,
            });
          } else {
            res.status(401).json({
              status: 401,
              result: `User with ID ${userid} not found`,
            });
          }
        },
        updateUser(req, res, next)  {
          const userid = req.params.userId;
          let userBody = req.body;
          console.log(`User met ID ${userid} gezocht`);
          let user = userDatabase.filter((item) => item.id == userid);
          if (user.length > 0) {
            console.log(user);
            let id = userid;
            userBody = {
              id,
              ...userBody,
            };
            userDatabase.splice(userDatabase.indexOf(userid), 1, (userBody))
            res.status(200).json({
              status: 200,
              result: "User updated",
            });
          } else {
            res.status(401).json({
              status: 401,
              result: `User with ID ${userid} not found`,
            });
          }
        },
}
module.exports = userController;
    