const mysql = require("mysql2");
require("dotenv").config();

const pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  connectionLimit: 10,
  waitForConnections: true,
  queueLimit: 0,
  multipleStatements: true,
});

module.exports = pool

// pool.getConnection(function (err, connection) {
//   if (err) throw err; // not connected!

//   // Use the connection
//   connection.query(
//     "SELECT id, name FROM meal;",
//     function (error, results, fields) {
//       // When done with the connection, release it.
//       connection.release();

//       // Handle error after the release.
//       if (error) throw error;

//       // Don't use the connection here, it has been returned to the pool.
//       console.log("result = ", results);

//       pool.end( (err) => {
//         console.log('pool party is closed')
//       });
//     }
//   );
// });
