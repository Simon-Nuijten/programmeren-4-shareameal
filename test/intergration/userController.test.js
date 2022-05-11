const INSERT_USER =
  "INSERT INTO `user` (`firstName`, `lastName`, `street`, `city`, `isActive`, `emailAdress`, `password`, `phoneNumber` ) VALUES" +
  '("Quincy", "van Deursen", "Lisdodde", "Breda", 1, "Q@gmail.com", "Secret1!", "061234567");';

const CLEAR_USERS_TABLE = "DELETE IGNORE FROM `user`;";
const CLEAR_MEAL_TABLE = "DELETE IGNORE FROM `meal`;";
const CLEAR_MEAL_PARTICIPANT_TABLE =
  "DELETE IGNORE FROM `meal_participants_user`;";
const CLEAR_DB =
  CLEAR_MEAL_PARTICIPANT_TABLE + CLEAR_USERS_TABLE + CLEAR_MEAL_TABLE;

chai.should();
chai.use(chaiHttp);
// all tests below belong to the route api/user/
describe("Users", () => {
  describe("Testcases of UC-201, create a new user, api/user/ ", () => {
    beforeEach((done) => {
      console.log("beforeEach called");
      dbconnection.getConnection(function (err, connection) {
        if (err) throw err; // not connected!
        connection.query(
          CLEAR_DB + INSERT_USER,
          function (error, results, fields) {
            // When done with the connection, release it.
            connection.release();

            // Handle error after the release.
            if (error) throw error;
            done();
          }
        );
      });
    });

    it("TC-201-1 required field is missing. error should be returned.", (done) => {
      chai
        .request(server)
        .post("/api/user")
        .send({
          // firstname is missing
          lastName: "van Deursen",
          street: "Lisdodde",
          city: "Breda",
          isActive: 1,
          emailAdress: "q.vandeursen@student.avans.nl",
          password: "SecretPas1",
          phoneNumber: "061234567",
        })
        .end((err, res) => {
          res.should.be.an("object");
          let { status, message } = res.body;
          status.should.equals(400);
          message.should.be
            .a("string")
            .that.equals("firstname must be of type string");
          done();
        });
    });
});
const INSERT_USER =
  "INSERT INTO `user` (`firstName`, `lastName`, `street`, `city`, `isActive`, `emailAdress`, `password`, `phoneNumber` ) VALUES" +
  '("Quincy", "van Deursen", "Lisdodde", "Breda", 1, "Quincyvandeursen@gmail.com", "Secret1!", "061234567");';

const CLEAR_USERS_TABLE = "DELETE IGNORE FROM `user`;";
const CLEAR_MEAL_TABLE = "DELETE IGNORE FROM `meal`;";