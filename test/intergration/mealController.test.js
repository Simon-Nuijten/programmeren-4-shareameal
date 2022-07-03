process.env.DB_DATABASE=process.env.DB_DATABASE || 2184065
// 1234567 of share-a-meal-testdb local normal db
const chai=require('chai')
const chaiHttp=require('chai-http')
const server=require('../../index')
const dbconnection=require('../../dbconnection')
const { jwtSecretKey, logger } = require('../../config/config')
const jwt = require('jsonwebtoken')
const assert = require('assert')
require('dotenv').config()
chai.should();
chai.use(chaiHttp)


const CLEAR_MEAL_TABLE = 'DELETE IGNORE FROM `meal`;'
const CLEAR_PARTICIPANTS_TABLE = 'DELETE IGNORE FROM `meal_participants_user`;'
const CLEAR_USERS_TABLE = 'DELETE IGNORE FROM `user`;'
const CLEAR_DB = CLEAR_MEAL_TABLE + CLEAR_PARTICIPANTS_TABLE + CLEAR_USERS_TABLE

const INSERT_USER =
    'INSERT INTO `user` (`id`, `firstName`, `lastName`, `emailAdress`, `password`, `street`, `city` ) VALUES' +
    '(1, "first", "last", "name@server.nl", "secret", "street", "city");'


const INSERT_MEALS =
    'INSERT INTO `meal` (`id`, `name`, `description`, `imageUrl`, `dateTime`, `maxAmountOfParticipants`, `price`, `cookId`) VALUES' +
    "(1, 'Meal A', 'description', 'image url', NOW(), 5, 6.50, 1)," +
    "(2, 'Meal B', 'description', 'image url', NOW(), 5, 6.50, 1);"

const INSERT_MEALS_PAR =
    'INSERT INTO `meal_participants_user` (`userId`, `mealId`) VALUES' +
    "(1, 1);"

describe('Meals API', () => {
    //
    // informatie over before, after, beforeEach, afterEach:
    // https://mochajs.org/#hooks
    //
    before((done) => {
        logger.debug(
            'before: hier zorg je eventueel dat de precondities correct zijn'
        )
        logger.debug('before done')
        done()
    })
    describe('Validatie token en gebruiker bestaat', () => {
        //
        beforeEach((done) => {
            logger.debug('beforeEach called')
            // maak de testdatabase opnieuw aan zodat we onze testen kunnen uitvoeren.
            dbconnection.getConnection(function (err, connection) {
                if (err) throw err // not connected!
                connection.query(
                    CLEAR_DB + INSERT_USER + INSERT_MEALS,
                    function (error, results, fields) {
                        // When done with the connection, release it.
                        connection.release()
                        // Handle error after the release.
                        if (error) throw error
                        // Let op dat je done() pas aanroept als de query callback eindigt!
                        logger.debug('beforeEach done')
                        done()
                    }
                )
            })
        })

        it('TC 203-2 Valide token en gebruiker bestaat', (done) => {
            chai.request(server)
                .post('/api/login')
                .send({
                    emailAdress: 'name@server.nl',
                    password: 'secret',
                })
                .end((err, res) => {
                    assert.ifError(err)
                    res.should.have.status(200)
                    res.should.be.an('object')

                    res.body.should.be
                        .an('object')
                        .that.has.all.keys('results', 'statusCode')
                    done()
                })
        })
        // En hier komen meer testcases
    })
    describe('TC 101-1 verplicht veld ontbreekt', () => {
        //
        beforeEach((done) => {
            logger.debug('beforeEach called')
            // maak de testdatabase opnieuw aan zodat we onze testen kunnen uitvoeren.
            dbconnection.getConnection(function (err, connection) {
                if (err) throw err // not connected!
                connection.query(
                    CLEAR_DB + INSERT_USER + INSERT_MEALS,
                    function (error, results, fields) {
                        // When done with the connection, release it.
                        connection.release()
                        // Handle error after the release.
                        if (error) throw error
                        // Let op dat je done() pas aanroept als de query callback eindigt!
                        logger.debug('beforeEach done')
                        done()
                    }
                )
            })
        })

        it('TC 101-1 verplicht veld ontbreekt', (done) => {
            chai.request(server)
                .put('/api/login')
                .send({
                    password: 'secretFout',
                })
                .end((err, res) => {
                    assert.ifError(err)

                    res.should.have.status(400)

                    res.body.should.be
                        .an('object')
                        .that.has.all.keys('result', 'status')

                    const { status, result } = res.body
                    status.should.be.an('number')
                    done()
                })
        })
        // En hier komen meer testcases
    })
    describe('TC-101-2 niet goed email', () => {
        //
        beforeEach((done) => {
            logger.debug('beforeEach called')
            // maak de testdatabase opnieuw aan zodat we onze testen kunnen uitvoeren.
            dbconnection.getConnection(function (err, connection) {
                if (err) throw err // not connected!
                connection.query(
                    CLEAR_DB + INSERT_USER + INSERT_MEALS,
                    function (error, results, fields) {
                        // When done with the connection, release it.
                        connection.release()
                        // Handle error after the release.
                        if (error) throw error
                        // Let op dat je done() pas aanroept als de query callback eindigt!
                        logger.debug('beforeEach done')
                        done()
                    }
                )
            })
        })

        it('TC-101-2 niet goed email', (done) => {
            chai.request(server)
                .post('/api/login')
                .send({
                    emailAdress: 'nameserver.nl',
                    password: 'secretFout',
                })
                .end((err, res) => {
                    assert.ifError(err)
                    res.should.have.status(401)
                    res.should.be.an('object')

                    res.body.should.be
                        .an('object')
                        .that.has.all.keys('message', 'datetime')
                    done()
                })
        })
       
        // En hier komen meer testcases
    })
    // describe('TC-101-2 niet goed email', () => {
    //     //
    //     beforeEach((done) => {
    //         logger.debug('beforeEach called')
    //         // maak de testdatabase opnieuw aan zodat we onze testen kunnen uitvoeren.
    //         dbconnection.getConnection(function (err, connection) {
    //             if (err) throw err // not connected!
    //             connection.query(
    //                 CLEAR_DB + INSERT_USER + INSERT_MEALS,
    //                 function (error, results, fields) {
    //                     // When done with the connection, release it.
    //                     connection.release()
    //                     // Handle error after the release.
    //                     if (error) throw error
    //                     // Let op dat je done() pas aanroept als de query callback eindigt!
    //                     logger.debug('beforeEach done')
    //                     done()
    //                 }
    //             )
    //         })
    //     })

    //     it('TC-101-2 niet goed wachtwoord', (done) => {
    //         chai.request(server)
    //             .post('/api/login')
    //             .send({
    //                 emailAdress: 'name@server.nl',
    //                 password: 'h',
    //             })
    //             .end((err, res) => {
    //                 assert.ifError(err)
    //                 res.should.have.status(400)
    //                 res.should.be.an('object')

    //                 res.body.should.be
    //                     .an('object')
    //                     .that.has.all.keys('message', 'statusCode')
    //                 done()
    //             })
    //     })
       
    //     // En hier komen meer testcases
    // })
    describe('TC204-1 Validatie token en gebruiker bestaat niet', () => {
        //
        beforeEach((done) => {
            logger.debug('beforeEach called')
            // maak de testdatabase opnieuw aan zodat we onze testen kunnen uitvoeren.
            dbconnection.getConnection(function (err, connection) {
                if (err) throw err // not connected!
                connection.query(
                    CLEAR_DB + INSERT_USER + INSERT_MEALS,
                    function (error, results, fields) {
                        // When done with the connection, release it.
                        connection.release()
                        // Handle error after the release.
                        if (error) throw error
                        // Let op dat je done() pas aanroept als de query callback eindigt!
                        logger.debug('beforeEach done')
                        done()
                    }
                )
            })
        })

        it('TC204-1 Validatie token en gebruiker bestaat niet', (done) => {
            chai.request(server)
                .post('/api/login')
                .send({
                    emailAdress: 'name@server.nl',
                    password: 'secretFout',
                })
                .end((err, res) => {
                    assert.ifError(err)
                    res.should.have.status(401)
                    res.should.be.an('object')

                    res.body.should.be
                        .an('object')
                        .that.has.all.keys('message', 'datetime')
                    done()
                })
        })
        // En hier komen meer testcases
    })
    describe('TC 204-3 gebruiker naam bestaat niet', () => {
        //
        beforeEach((done) => {
            logger.debug('beforeEach called')
            // maak de testdatabase opnieuw aan zodat we onze testen kunnen uitvoeren.
            dbconnection.getConnection(function (err, connection) {
                if (err) throw err // not connected!
                connection.query(
                    CLEAR_DB + INSERT_USER + INSERT_MEALS,
                    function (error, results, fields) {
                        // When done with the connection, release it.
                        connection.release()
                        // Handle error after the release.
                        if (error) throw error
                        // Let op dat je done() pas aanroept als de query callback eindigt!
                        logger.debug('beforeEach done')
                        done()
                    }
                )
            })
        })

        it('TC 204-3 gebruiker naam bestaat niet', (done) => {
            chai.request(server)
                .get('/api/user/?firstName=klaas')
                .set(
                    'authorization',
                    'Bearer ' + jwt.sign({ userId: 1 }, jwtSecretKey)
                )
                .end((err, res) => {
                    assert.ifError(err)

                    res.should.have.status(200)

                    res.body.should.be
                        .an('object')
                        .that.has.all.keys('result', 'statusCode')

                    const { statusCode, result } = res.body
                    statusCode.should.be.an('number')
                    // result.should.be.a("string").that.equals("");
                    done()
                })
        })
        // En hier komen meer testcases
    })
    describe('TC 202-6 toon gebruikers met een bestaande naam', () => {
        //
        beforeEach((done) => {
            logger.debug('beforeEach called')
            // maak de testdatabase opnieuw aan zodat we onze testen kunnen uitvoeren.
            dbconnection.getConnection(function (err, connection) {
                if (err) throw err // not connected!
                connection.query(
                    CLEAR_DB + INSERT_USER + INSERT_MEALS,
                    function (error, results, fields) {
                        // When done with the connection, release it.
                        connection.release()
                        // Handle error after the release.
                        if (error) throw error
                        // Let op dat je done() pas aanroept als de query callback eindigt!
                        logger.debug('beforeEach done')
                        done()
                    }
                )
            })
        })

        it('TC 202-6 toon gebruikers met een bestaande naam', (done) => {
            chai.request(server)
                .get('/api/user/?firstName=first')
                .set(
                    'authorization',
                    'Bearer ' + jwt.sign({ userId: 1 }, jwtSecretKey)
                )
                .end((err, res) => {
                    assert.ifError(err)

                    res.should.have.status(200)

                    res.body.should.be
                        .an('object')
                        .that.has.all.keys('result', 'statusCode')

                    const { statusCode, result } = res.body
                    // statusCode.should.be.an('number')
                    done()
                })
        })
        // En hier komen meer testcases
    })
    
    describe('TC 204-3 Gebruiker-ID bestaat', () => {
        //
        beforeEach((done) => {
            logger.debug('beforeEach called')
            // maak de testdatabase opnieuw aan zodat we onze testen kunnen uitvoeren.
            dbconnection.getConnection(function (err, connection) {
                if (err) throw err // not connected!
                connection.query(
                    CLEAR_DB + INSERT_USER + INSERT_MEALS,
                    function (error, results, fields) {
                        // When done with the connection, release it.
                        connection.release()
                        // Handle error after the release.
                        if (error) throw error
                        // Let op dat je done() pas aanroept als de query callback eindigt!
                        logger.debug('beforeEach done')
                        done()
                    }
                )
            })
        })

        it('TC 204-3 Gebruiker-ID bestaat', (done) => {
            chai.request(server)
                .get('/api/user/1')
                .set(
                    'authorization',
                    'Bearer ' + jwt.sign({ userId: 1 }, jwtSecretKey)
                )
                .end((err, res) => {
                    assert.ifError(err)
                    let { status, results} = res.body;
                    res.should.have.status(200)

                    res.body.should.be
                        .an('object')
                        .that.has.all.keys('results', 'statusCode')

                    const { statusCode, result } = res.body
                    statusCode.should.be.an('number')
                    done()
                })
        })
        it("TC-201-5 Gebruiker succesvol geregistreerd", (done) => {
            chai
              .request(server)
              .post("/api/user")
              .send({
                firstName: "Boudewijn",
                lastName: "Roderick",
                street: "Bernardlaan",
                city: "Breda",
                isActive: true,
                emailAdress: "Avans@avans.nl",
                password: "secret#f4Dtfeer",
                phoneNumber: "06 12425475",
                roles: "admin"
              }).set(
                'authorization',
                'Bearer ' + jwt.sign({ userId: 1 }, jwtSecretKey)
            )
              .end((err, res) => {
                res.should.be.an("Object");
                let { status, results } = res.body;
                res.should.have.status(201)
                results.firstName.should.be.a("string").that.equals("Boudewijn");
                results.lastName.should.be.a("string").that.equals("Roderick");
                results.street.should.be
                  .a("string")
                  .that.equals("Bernardlaan");
                  results.city.should.be.a("string").that.equals("Breda");
                  results.isActive.should.be.a("boolean").that.equals(true);
                  results.emailAdress.should.be
                  .a("string")
                  .that.equals("Avans@avans.nl");
                  results.password.should.be.a("string").that.equals("secret#f4Dtfeer");
                  results.phoneNumber.should.be.a("string").that.equals("06 12425475");
                done();
              });
          });
    })
    describe('TC 204-4 Gebruiker-ID bestaat niet', () => {
        //
        beforeEach((done) => {
            logger.debug('beforeEach called')
            // maak de testdatabase opnieuw aan zodat we onze testen kunnen uitvoeren.
            dbconnection.getConnection(function (err, connection) {
                if (err) throw err // not connected!
                connection.query(
                    CLEAR_DB + INSERT_USER + INSERT_MEALS,
                    function (error, results, fields) {
                        // When done with the connection, release it.
                        connection.release()
                        // Handle error after the release.
                        if (error) throw error
                        // Let op dat je done() pas aanroept als de query callback eindigt!
                        logger.debug('beforeEach done')
                        done()
                    }
                )
            })
        })

        it('TC 204-4', (done) => {
            chai.request(server)
                .put('/api/user/1000000')
                .set(
                    'authorization',
                    'Bearer ' + jwt.sign({ userId: 1 }, jwtSecretKey)
                )
                .end((err, res) => {
                    assert.ifError(err)

                    res.should.have.status(400)

                    res.body.should.be
                        .an('object')
                        .that.has.all.keys('result', 'statusCode')

                    const { statusCode, result } = res.body
                    statusCode.should.be.an('number')
                    done()
                })
        })
        // En hier komen meer testcases
    })
    describe('UC-301 Create meal', () => {
        //
        beforeEach((done) => {
            logger.debug('beforeEach called')
            // maak de testdatabase leeg zodat we onze testen kunnen uitvoeren.
            dbconnection.getConnection(function (err, connection) {
                if (err) throw err // not connected!

                // Use the connection
                connection.query(
                    CLEAR_DB + INSERT_USER,
                    function (error, results, fields) {
                        // When done with the connection, release it.
                        connection.release()

                        // Handle error after the release.
                        if (error) throw error
                        // Let op dat je done() pas aanroept als de query callback eindigt!
                        logger.debug('beforeEach done')
                        done()
                    }
                )
            })
        })

        it('TC 201 Create user', (done) => {
            chai.request(server)
                .post('/api/user')
                .send({
                    firstName: "Klaas",
                    lastName: "van den Dullemen",
                    isActive: 1,
                    emailAdress: "m@server.nl",
                    password: "secret",
                    phoneNumber: "",
                    roles: "",
                    street: "",
                    city: ""
                }).set(
                    'authorization',
                    'Bearer ' + jwt.sign({ userId: 1 }, jwtSecretKey)
                )
                .end((err, res) => {
                    assert.ifError(err)
                    res.should.be.an("Object");
                    let { status, results } = res.body;
                    res.should.have.status(201)
                    results.firstName.should.be.a("string").that.equals("Klaas");
                    results.lastName.should.be.a("string").that.equals("van den Dullemen");
                    results.emailAdress.should.be.a("string").that.equals("m@server.nl");
                    results.password.should.be.a("string").that.equals("secret");
                    res.body.should.be
                        .an('object')
                        .that.has.all.keys('status', 'results')
                    done()
                })
        })
        it('TC 201 Create user met ontbrekend veld (email)', (done) => {
            chai.request(server)
                .post('/api/user')
                .send({
                    firstName: "Klaas",
                    lastName: "van den Dullemen",
                    isActive: 1,
                    password: "secret",
                    phoneNumber: "",
                    roles: "",
                    street: "",
                    city: ""
                }).set(
                    'authorization',
                    'Bearer ' + jwt.sign({ userId: 1 }, jwtSecretKey)
                )
                .end((err, res) => {
                    assert.ifError(err)
                    res.should.be.an("Object");
                    let { status, results } = res.body;
                    res.should.have.status(400)
                    done()
                })
        })

        // En hier komen meer testcases
    })
    describe('UC-301 Create meal', () => {
        //
        beforeEach((done) => {
            logger.debug('beforeEach called')
            // maak de testdatabase leeg zodat we onze testen kunnen uitvoeren.
            dbconnection.getConnection(function (err, connection) {
                if (err) throw err // not connected!

                // Use the connection
                connection.query(
                    CLEAR_DB + INSERT_USER,
                    function (error, results, fields) {
                        // When done with the connection, release it.
                        connection.release()

                        // Handle error after the release.
                        if (error) throw error
                        // Let op dat je done() pas aanroept als de query callback eindigt!
                        logger.debug('beforeEach done')
                        done()
                    }
                )
            })
        })

        it('TC 301-3 Create meal', (done) => {
            chai.request(server)
                .post('/api/meal')
                .send({
                    isActive: true,
                    isVega: 1,
                    isVegan: 1,
                    isToTakeHome: 1,
                    maxAmountOfParticipants: 6,
                    price: 2.50,
                    imageUrl: 'hoppa.com',
                    cookId: 1,
                    name: 'pannenkoeken',
                    description: 'met stroop',
                    allergenes: 'gluten',
                }).set(
                    'authorization',
                    'Bearer ' + jwt.sign({ userId: 1 }, jwtSecretKey)
                )
                .end((err, res) => {
                    assert.ifError(err)
                    res.should.be.an("Object");
                    let { status, results } = res.body;
                    res.should.have.status(201)
                    results.name.should.be.a("string").that.equals("pannenkoeken");
                    results.description.should.be.a("string").that.equals("met stroop");
                    results.allergenes.should.be.a("string").that.equals("gluten");
                    results.isActive.should.be.a("boolean").that.equals(true);
                    res.body.should.be
                        .an('object')
                        .that.has.all.keys('statusCode', 'results')
                    done()
                })
        })
        it('TC 301-4 Create meal zonder login', (done) => {
            chai.request(server)
                .post('/api/meal')
                .send({
                    isActive: true,
                    isVega: 1,
                    isVegan: 1,
                    isToTakeHome: 1,
                    maxAmountOfParticipants: 6,
                    price: 2.50,
                    imageUrl: 'hoppa.com',
                    cookId: 1,
                    name: 'pannenkoeken',
                    description: 'met stroop',
                    allergenes: 'gluten',
                })
                .end((err, res) => {
                    assert.ifError(err)
                    res.should.be.an("Object");
                    let { status, results } = res.body;
                    res.should.have.status(401)
                   
                    res.body.should.be
                        .an('object')
                        .that.has.all.keys('error', 'datetime')
                    done()
                })
        })
        // En hier komen meer testcases
    })
    
    describe('TC 302-2 update meal without login', () => {
        //
        beforeEach((done) => {
            logger.debug('beforeEach called')
            // maak de testdatabase leeg zodat we onze testen kunnen uitvoeren.
            dbconnection.getConnection(function (err, connection) {
                if (err) throw err // not connected!

                // Use the connection
                connection.query(
                    CLEAR_DB + INSERT_USER,
                    function (error, results, fields) {
                        // When done with the connection, release it.
                        connection.release()

                        // Handle error after the release.
                        if (error) throw error
                        // Let op dat je done() pas aanroept als de query callback eindigt!
                        logger.debug('beforeEach done')
                        done()
                    }
                )
            })
        })

        it('TC 302-2 update meal without login', (done) => {
            chai.request(server)
                .put('/api/meal/1')
                .send({
                    // name is missing
                    isActive: 1,
                    isVega: 1,
                    isVegan: 1,
                    isToTakeHome: 1,
                    dateTime: new Date(),
                    maxAmountOfParticipants: 6,
                    price: 2.50,
                    imageUrl: 'hoppa.com',
                    cookId: 1,
                    createDate: new Date(),
                    updateDate: new Date(),
                    name: 'pannenkoeken',
                    description: 'met stroop',
                    allergenes: 'gluten',
                })
                .end((err, res) => {
                    assert.ifError(err)
                    res.should.have.status(401)
                    res.should.be.an('object')

                    res.body.should.be
                        .an('object')
                        .that.has.all.keys('error', 'datetime')
                    done()
                })
        })

        // En hier komen meer testcases
    })
    describe('TC 302-2 update meal missing field', () => {
        //
        beforeEach((done) => {
            logger.debug('beforeEach called')
            // maak de testdatabase leeg zodat we onze testen kunnen uitvoeren.
            dbconnection.getConnection(function (err, connection) {
                if (err) throw err // not connected!

                // Use the connection
                connection.query(
                    CLEAR_DB + INSERT_USER,
                    function (error, results, fields) {
                        // When done with the connection, release it.
                        connection.release()

                        // Handle error after the release.
                        if (error) throw error
                        // Let op dat je done() pas aanroept als de query callback eindigt!
                        logger.debug('beforeEach done')
                        done()
                    }
                )
            })
        })

        it('TC 302-4 update meal, meal doesnt exist', (done) => {
            chai.request(server)
                .put('/api/meal/1234234')
                .send({
                    // price is missing
                    isActive: 1,
                    isVega: 1,
                    isVegan: 1,
                    isToTakeHome: 1,
                    dateTime: new Date(),
                    maxAmountOfParticipants: 6,
                    imageUrl: 'hoppa.com',
                    cookId: 1,
                    createDate: new Date(),
                    updateDate: new Date(),
                    name: 'pannenkoeken',
                    description: 'met stroop',
                    allergenes: 'gluten',
                })
                .end((err, res) => {
                    assert.ifError(err)
                    res.should.have.status(401)
                    res.should.be.an('object')

                    res.body.should.be
                        .an('object')
                        .that.has.all.keys('error', 'datetime')
                    done()
                })
        })

        // En hier komen meer testcases
    })
    describe('TC 302-2 update meal missing field', () => {
        //
        beforeEach((done) => {
            logger.debug('beforeEach called')
            // maak de testdatabase leeg zodat we onze testen kunnen uitvoeren.
            dbconnection.getConnection(function (err, connection) {
                if (err) throw err // not connected!

                // Use the connection
                connection.query(
                    CLEAR_DB + INSERT_USER,
                    function (error, results, fields) {
                        // When done with the connection, release it.
                        connection.release()

                        // Handle error after the release.
                        if (error) throw error
                        // Let op dat je done() pas aanroept als de query callback eindigt!
                        logger.debug('beforeEach done')
                        done()
                    }
                )
            })
        })

        it('TC 302-2 update meal missing field', (done) => {
            chai.request(server)
                .put('/api/meal/1')
                .send({
                    // price is missing
                    isActive: 1,
                    isVega: 1,
                    isVegan: 1,
                    isToTakeHome: 1,
                    dateTime: new Date(),
                    maxAmountOfParticipants: 6,
                    imageUrl: 'hoppa.com',
                    cookId: 1,
                    createDate: new Date(),
                    updateDate: new Date(),
                    name: 'pannenkoeken',
                    description: 'met stroop',
                    allergenes: 'gluten',
                })
                .end((err, res) => {
                    assert.ifError(err)
                    res.should.have.status(401)
                    res.should.be.an('object')

                    res.body.should.be
                        .an('object')
                        .that.has.all.keys('error', 'datetime')
                    done()
                })
        })

        // En hier komen meer testcases
    })
    describe('TC 302-5 update meal with login', () => {
        //
        beforeEach((done) => {
            logger.debug('beforeEach called')
            // maak de testdatabase leeg zodat we onze testen kunnen uitvoeren.
            dbconnection.getConnection(function (err, connection) {
                if (err) throw err // not connected!

                // Use the connection
                connection.query(
                    CLEAR_DB + INSERT_USER,
                    function (error, results, fields) {
                        // When done with the connection, release it.
                        connection.release()

                        // Handle error after the release.
                        if (error) throw error
                        // Let op dat je done() pas aanroept als de query callback eindigt!
                        logger.debug('beforeEach done')
                        done()
                    }
                )
            })
        })

        it('TC 302-5 update meal with login', (done) => {
            chai.request(server)
                .put('/api/meal/1')
                .send({
                    // name is missing
                    isActive: 1,
                    isVega: 1,
                    isVegan: 1,
                    isToTakeHome: 1,
                    dateTime: new Date(),
                    maxAmountOfParticipants: 6,
                    price: 2.50,
                    imageUrl: 'hoppa.com',
                    cookId: 1,
                    createDate: new Date(),
                    updateDate: new Date(),
                    name: 'pannenkoeken',
                    description: 'met stroop',
                    allergenes: 'gluten',
                })
                .set(
                    'authorization',
                    'Bearer ' + jwt.sign({ userId: 1 }, jwtSecretKey)
                )
                .end((err, res) => {
                    assert.ifError(err)
                    res.should.have.status(404)
                    res.should.be.an('object')

                    res.body.should.be
                        .an('object')
                        .that.has.all.keys('statusCode', 'message')
                    done()
                })
        })

        // En hier komen meer testcases
    })
    describe('UC201 Create meal met ontbrekende items', () => {
        //
        beforeEach((done) => {
            logger.debug('beforeEach called')
            // maak de testdatabase leeg zodat we onze testen kunnen uitvoeren.
            dbconnection.getConnection(function (err, connection) {
                if (err) throw err // not connected!

                // Use the connection
                connection.query(
                    CLEAR_DB + INSERT_USER,
                    function (error, results, fields) {
                        // When done with the connection, release it.
                        connection.release()

                        // Handle error after the release.
                        if (error) throw error
                        // Let op dat je done() pas aanroept als de query callback eindigt!
                        logger.debug('beforeEach done')
                        done()
                    }
                )
            })
        })

        it('TC-201-1 should return valid error when required value is not present', (done) => {
            chai.request(server)
                .post('/api/meal')
                .send({
                    // name is missing
                    isActive: 1,
                    isVega: 1,
                    isVegan: 1,

                })
                .end((err, res) => {
                    assert.ifError(err)
                    res.should.have.status(401)
                    res.should.be.an('object')

                    res.body.should.be
                        .an('object')
                        .that.has.all.keys('error', 'datetime')
                    done()
                })
        })

        it('TC-201-2 should return a valid error when postal code is invalid', (done) => {
            // Zelf verder aanvullen
            done()
        })

        // En hier komen meer testcases
    })
    describe('UC-303 Lijst van maaltijden opvragen /api/meal', () => {
        //
        beforeEach((done) => {
            logger.debug('beforeEach called')
            // maak de testdatabase opnieuw aan zodat we onze testen kunnen uitvoeren.
            dbconnection.getConnection(function (err, connection) {
                if (err) throw err // not connected!
                connection.query(
                    CLEAR_DB + INSERT_USER + INSERT_MEALS,
                    function (error, results, fields) {
                        // When done with the connection, release it.
                        connection.release()
                        // Handle error after the release.
                        if (error) throw error
                        // Let op dat je done() pas aanroept als de query callback eindigt!
                        logger.debug('beforeEach done')
                        done()
                    }
                )
            })
        })

        it('TC-303-1 Lijst van maaltijden wordt succesvol geretourneerd', (done) => {
            chai.request(server)
                .get('/api/meals')
                .set(
                    'authorization',
                    'Bearer ' + jwt.sign({ userId: 1 }, jwtSecretKey)
                )
                .end((err, res) => {
                    assert.ifError(err)

                    res.should.have.status(200)
                    res.should.be.an('object')

                    res.body.should.be
                        .an('object')
                        .that.has.all.keys('results', 'statusCode')

                    const { statusCode, results } = res.body
                    statusCode.should.be.an('number')
                    results.should.be.an('array').that.has.length(2)
                    results[0].name.should.equal('Meal A')
                    results[0].id.should.equal(1)
                    done()
                })
        })
        // En hier komen meer testcases
    })
    describe('UC-303 Lijst van maaltijden opvragen /api/meal', () => {
        //
        beforeEach((done) => {
            logger.debug('beforeEach called')
            // maak de testdatabase opnieuw aan zodat we onze testen kunnen uitvoeren.
            dbconnection.getConnection(function (err, connection) {
                if (err) throw err // not connected!
                connection.query(
                    CLEAR_DB + INSERT_USER + INSERT_MEALS,
                    function (error, results, fields) {
                        // When done with the connection, release it.
                        connection.release()
                        // Handle error after the release.
                        if (error) throw error
                        // Let op dat je done() pas aanroept als de query callback eindigt!
                        logger.debug('beforeEach done')
                        done()
                    }
                )
            })
        })

        it('TC-303-1 Lijst van maaltijden wordt succesvol geretourneerd', (done) => {
            chai.request(server)
                .get('/api/meals')
                .set(
                    'authorization',
                    'Bearer ' + jwt.sign({ userId: 1 }, jwtSecretKey)
                )
                .end((err, res) => {
                    assert.ifError(err)

                    res.should.have.status(200)
                    res.should.be.an('object')

                    res.body.should.be
                        .an('object')
                        .that.has.all.keys('results', 'statusCode')

                    const { statusCode, results } = res.body
                    statusCode.should.be.an('number')
                    results.should.be.an('array').that.has.length(2)
                    results[0].name.should.equal('Meal A')
                    results[0].id.should.equal(1)
                    done()
                })
        })
        // En hier komen meer testcases
    })
    describe('UC-304 Details van maaltijden opvragen /api/meal/1', () => {
        //
        beforeEach((done) => {
            logger.debug('beforeEach called')
            // maak de testdatabase opnieuw aan zodat we onze testen kunnen uitvoeren.
            dbconnection.getConnection(function (err, connection) {
                if (err) throw err // not connected!
                connection.query(
                    CLEAR_DB + INSERT_USER + INSERT_MEALS,
                    function (error, results, fields) {
                        // When done with the connection, release it.
                        connection.release()
                        // Handle error after the release.
                        if (error) throw error
                        // Let op dat je done() pas aanroept als de query callback eindigt!
                        logger.debug('beforeEach done')
                        done()
                    }
                )
            })
        })

        it('UC-304 Details van maaltijden opvragen /api/meal/1', (done) => {
            chai.request(server)
                .get('/api/meal/1')
                .set(
                    'authorization',
                    'Bearer ' + jwt.sign({ userId: 1 }, jwtSecretKey)
                )
                .end((err, res) => {
                    assert.ifError(err)

                    res.should.have.status(200)
                    res.should.be.an('object')

                    res.body.should.be
                        .an('object')
                        .that.has.all.keys('results', 'statusCode')

                    const { statusCode, results } = res.body
                    statusCode.should.be.an('number')
                    results.should.be.an('array').that.has.length(1)
                    results[0].name.should.equal('Meal A')
                    results[0].id.should.equal(1)
                    done()
                })
        })
        // En hier komen meer testcases
    })
    describe('UC-304-1 Details van maaltijden opvragen die niet bestaat /api/meal/52423425', () => {
        //
        beforeEach((done) => {
            logger.debug('beforeEach called')
            // maak de testdatabase opnieuw aan zodat we onze testen kunnen uitvoeren.
            dbconnection.getConnection(function (err, connection) {
                if (err) throw err // not connected!
                connection.query(
                    CLEAR_DB + INSERT_USER + INSERT_MEALS,
                    function (error, results, fields) {
                        // When done with the connection, release it.
                        connection.release()
                        // Handle error after the release.
                        if (error) throw error
                        // Let op dat je done() pas aanroept als de query callback eindigt!
                        logger.debug('beforeEach done')
                        done()
                    }
                )
            })
        })

        it('UC-304 Details van maaltijden opvragen die niet bestaat /api/meal/52423425', (done) => {
            chai.request(server)
                .get('/api/meal/52423425')
                .set(
                    'authorization',
                    'Bearer ' + jwt.sign({ userId: 1 }, jwtSecretKey)
                )
                .end((err, res) => {
                    assert.ifError(err)

                    res.should.have.status(404)

                    res.body.should.be
                        .an('object')
                        .that.has.all.keys('message', 'statusCode')

                    const { statusCode, message } = res.body
                    statusCode.should.be.an('number')
                    done()
                })
        })
        // En hier komen meer testcases
    })
    describe('UC-305 meal verwijderen', () => {
        //
        beforeEach((done) => {
            logger.debug('beforeEach called')
            // maak de testdatabase opnieuw aan zodat we onze testen kunnen uitvoeren.
            dbconnection.getConnection(function (err, connection) {
                if (err) throw err // not connected!
                connection.query(
                    CLEAR_DB + INSERT_USER + INSERT_MEALS,
                    function (error, results, fields) {
                        // When done with the connection, release it.
                        connection.release()
                        // Handle error after the release.
                        if (error) throw error
                        // Let op dat je done() pas aanroept als de query callback eindigt!
                        logger.debug('beforeEach done')
                        done()
                    }
                )
            })
        })

        it('UC-305 meal verwijderen', (done) => {
            chai.request(server)
                .delete('/api/meal/24233')
                .set(
                    'authorization',
                    'Bearer ' + jwt.sign({ userId: 1 }, jwtSecretKey)
                )
                .end((err, res) => {
                    assert.ifError(err)

                    res.should.have.status(404)

                    res.body.should.be
                        .an('object')
                        .that.has.all.keys('message', 'statusCode')

                    const { statusCode, message } = res.body
                    statusCode.should.be.an('number')
                    done()
                })
        })
        // En hier komen meer testcases
    })
    describe('TC-401-1 Niet ingelogd voor het updaten van een meal', () => {
        //
        beforeEach((done) => {
            logger.debug('beforeEach called')
            // maak de testdatabase opnieuw aan zodat we onze testen kunnen uitvoeren.
            dbconnection.getConnection(function (err, connection) {
                if (err) throw err // not connected!
                connection.query(
                    CLEAR_DB + INSERT_USER + INSERT_MEALS,
                    function (error, results, fields) {
                        // When done with the connection, release it.
                        connection.release()
                        // Handle error after the release.
                        if (error) throw error
                        // Let op dat je done() pas aanroept als de query callback eindigt!
                        logger.debug('beforeEach done')
                        done()
                    }
                )
            })
        })

        it('TC-401-1 Niet ingelogd voor het aanmaken van een meal', (done) => {
            chai.request(server)
                .post('/api/meal')
                .end((err, res) => {
                    assert.ifError(err)

                    res.should.have.status(401)
                    res.should.be.an('object')

                    res.body.should.be
                        .an('object')
                        .that.has.all.keys('error', 'datetime')

                    const { error, datetime } = res.body
                    error.should.be.an('string')
                    done()
                })
        })
        // En hier komen meer testcases
    })
    describe('UC-305 meal verwijderen die niet bestaat', () => {
        //
        beforeEach((done) => {
            logger.debug('beforeEach called')
            // maak de testdatabase opnieuw aan zodat we onze testen kunnen uitvoeren.
            dbconnection.getConnection(function (err, connection) {
                if (err) throw err // not connected!
                connection.query(
                    CLEAR_DB + INSERT_USER + INSERT_MEALS,
                    function (error, results, fields) {
                        // When done with the connection, release it.
                        connection.release()
                        // Handle error after the release.
                        if (error) throw error
                        // Let op dat je done() pas aanroept als de query callback eindigt!
                        logger.debug('beforeEach done')
                        done()
                    }
                )
            })
        })

        it('UC-305 meal verwijderen die niet bestaat', (done) => {
            chai.request(server)
                .delete('/api/meal/34704')
                .set(
                    'authorization',
                    'Bearer ' + jwt.sign({ userId: 1 }, jwtSecretKey)
                )
                .end((err, res) => {
                    assert.ifError(err)

                    res.should.have.status(404)

                    res.body.should.be
                        .an('object')
                        .that.has.all.keys('message', 'statusCode')

                    const { statusCode, message } = res.body
                    statusCode.should.be.an('number')
                    done()
                })
        })
        // En hier komen meer testcases
    })
    describe('TC-401-1 Niet ingelogd aanmelden voor een meal', () => {
        //
        beforeEach((done) => {
            logger.debug('beforeEach called')
            // maak de testdatabase opnieuw aan zodat we onze testen kunnen uitvoeren.
            dbconnection.getConnection(function (err, connection) {
                if (err) throw err // not connected!
                connection.query(
                    CLEAR_DB + INSERT_USER + INSERT_MEALS,
                    function (error, results, fields) {
                        // When done with the connection, release it.
                        connection.release()
                        // Handle error after the release.
                        if (error) throw error
                        // Let op dat je done() pas aanroept als de query callback eindigt!
                        logger.debug('beforeEach done')
                        done()
                    }
                )
            })
        })

        it('TC 305-2 niet ingelogd voor het verwijderen', (done) => {
            chai.request(server)
                .delete('/api/meal/1')
                .end((err, res) => {
                    assert.ifError(err)

                    res.should.have.status(401)
                    res.should.be.an('object')

                    res.body.should.be
                        .an('object')
                        .that.has.all.keys('error', 'datetime')

                    const { error, datetime } = res.body
                    error.should.be.an('string')
                    done()
                })
        })
        // En hier komen meer testcases
    })
    describe('TC 205-5 niet ingelogd', () => {
        //
        beforeEach((done) => {
            logger.debug('beforeEach called')
            // maak de testdatabase opnieuw aan zodat we onze testen kunnen uitvoeren.
            dbconnection.getConnection(function (err, connection) {
                if (err) throw err // not connected!
                connection.query(
                    CLEAR_DB + INSERT_USER + INSERT_MEALS,
                    function (error, results, fields) {
                        // When done with the connection, release it.
                        connection.release()
                        // Handle error after the release.
                        if (error) throw error
                        // Let op dat je done() pas aanroept als de query callback eindigt!
                        logger.debug('beforeEach done')
                        done()
                    }
                )
            })
        })

        it('TC 205-5 niet ingelogd', (done) => {
            chai.request(server)
                .get('/api/meals')
                .set(
                    'authorization',
                    'Bearer ' + 'adsapod3qwir2-84u2-r[3quy-49y2hqw-r9y-r9fhep9aut-9'
                )
                .end((err, res) => {
                    assert.ifError(err)

                    res.should.have.status(401)
                    res.should.be.an('object')

                    res.body.should.be
                        .an('object')
                        .that.has.all.keys('error', 'datetime')

                    const { error, results } = res.body
                    error.should.be.an('string')
                    done()
                })
        })
        // En hier komen meer testcases
    })
    describe('TC 401-3 succesvol aangemeld', () => {
        //
        beforeEach((done) => {
            logger.debug('beforeEach called')
            // maak de testdatabase opnieuw aan zodat we onze testen kunnen uitvoeren.
            dbconnection.getConnection(function (err, connection) {
                if (err) throw err // not connected!
                connection.query(
                    CLEAR_DB + INSERT_USER + INSERT_MEALS,
                    function (error, results, fields) {
                        // When done with the connection, release it.
                        connection.release()
                        // Handle error after the release.
                        if (error) throw error
                        // Let op dat je done() pas aanroept als de query callback eindigt!
                        logger.debug('beforeEach done')
                        done()
                    }
                )
            })
        })

        it('TC 401-3 succesvol aangemeld', (done) => {
            chai.request(server)
                .post('/api/mealParticepate/1')
                .set(
                    'authorization',
                    'Bearer ' + jwt.sign({ userId: 1 }, jwtSecretKey)
                )
                .end((err, res) => {
                    assert.ifError(err)

                    res.should.have.status(201)

                    res.body.should.be
                        .an('object')
                        .that.has.all.keys('result', 'statusCode')

                    const { statusCode, message } = res.body
                    statusCode.should.be.an('number')
                    done()
                })
        })
        // En hier komen meer testcases
    })
    describe('Aanmelden voor een niet bestaande meal', () => {
        //
        beforeEach((done) => {
            logger.debug('beforeEach called')
            // maak de testdatabase opnieuw aan zodat we onze testen kunnen uitvoeren.
            dbconnection.getConnection(function (err, connection) {
                if (err) throw err // not connected!
                connection.query(
                    CLEAR_DB + INSERT_USER + INSERT_MEALS,
                    function (error, results, fields) {
                        // When done with the connection, release it.
                        connection.release()
                        // Handle error after the release.
                        if (error) throw error
                        // Let op dat je done() pas aanroept als de query callback eindigt!
                        logger.debug('beforeEach done')
                        done()
                    }
                )
            })
        })

        it('Aanmelden voor een niet bestaande meal', (done) => {
            chai.request(server)
                .post('/api/mealParticepate/143535345')
                .set(
                    'authorization',
                    'Bearer ' + jwt.sign({ userId: 1 }, jwtSecretKey)
                )
                .end((err, res) => {
                    assert.ifError(err)

                    res.should.have.status(400)
                    res.should.be.an('object')

                    res.body.should.be
                        .an('object')
                        .that.has.all.keys('result', 'statusCode')

                    const { statusCode, result } = res.body
                    statusCode.should.be.an('number')
                    done()
                })
        })
        // En hier komen meer testcases
    })
    
    describe('TC-401-1 Niet ingelogd aanmelden voor een meal', () => {
        //
        beforeEach((done) => {
            logger.debug('beforeEach called')
            // maak de testdatabase opnieuw aan zodat we onze testen kunnen uitvoeren.
            dbconnection.getConnection(function (err, connection) {
                if (err) throw err // not connected!
                connection.query(
                    CLEAR_DB + INSERT_USER + INSERT_MEALS,
                    function (error, results, fields) {
                        // When done with the connection, release it.
                        connection.release()
                        // Handle error after the release.
                        if (error) throw error
                        // Let op dat je done() pas aanroept als de query callback eindigt!
                        logger.debug('beforeEach done')
                        done()
                    }
                )
            })
        })

        it('TC-401-1 Niet ingelogd aanmelden voor een meal', (done) => {
            chai.request(server)
                .post('/api/mealParticepate/1')
                .end((err, res) => {
                    assert.ifError(err)

                    res.should.have.status(401)
                    res.should.be.an('object')

                    res.body.should.be
                        .an('object')
                        .that.has.all.keys('error', 'datetime')

                    const { error, datetime } = res.body
                    error.should.be.an('string')
                    done()
                })
        })
        // En hier komen meer testcases
    })
    describe('TC-306-1 uitschrijven van een maaltijd', () => {
        //
        beforeEach((done) => {
            logger.debug('beforeEach called')
            // maak de testdatabase opnieuw aan zodat we onze testen kunnen uitvoeren.
            dbconnection.getConnection(function (err, connection) {
                if (err) throw err // not connected!
                connection.query(
                    CLEAR_DB + INSERT_USER + INSERT_MEALS + INSERT_MEALS_PAR,
                    function (error, results, fields) {
                        // When done with the connection, release it.
                        connection.release()
                        // Handle error after the release.
                        if (error) throw error
                        // Let op dat je done() pas aanroept als de query callback eindigt!
                        logger.debug('beforeEach done')
                        done()
                    }
                )
            })
        })

        it('TC-306-1 uitschrijven van een maaltijd', (done) => {
            chai.request(server)
                .delete('/api/mealParticepate/1')
                .set(
                    'authorization',
                    'Bearer ' + jwt.sign({ userId: 1 }, jwtSecretKey)
                )
                .end((err, res) => {
                    assert.ifError(err)
                    res.should.have.status(200)
                    res.should.be.an('object')

                    res.body.should.be
                        .an('object')
                        .that.has.all.keys('results', 'statusCode')
                    done()
                })
        })
        // En hier komen meer testcases
    })
    describe('TC-305-3 Niet de eigenaar van de meal', () => {
        //
        beforeEach((done) => {
            logger.debug('beforeEach called')
            // maak de testdatabase opnieuw aan zodat we onze testen kunnen uitvoeren.
            dbconnection.getConnection(function (err, connection) {
                if (err) throw err // not connected!
                connection.query(
                    CLEAR_DB + INSERT_USER + INSERT_MEALS + INSERT_MEALS_PAR,
                    function (error, results, fields) {
                        // When done with the connection, release it.
                        connection.release()
                        // Handle error after the release.
                        if (error) throw error
                        // Let op dat je done() pas aanroept als de query callback eindigt!
                        logger.debug('beforeEach done')
                        done()
                    }
                )
            })
        })

        it('TC-305-3 Niet de eigenaar van de meal', (done) => {
            chai.request(server)
                .delete('/api/meal/1')
                .set(
                    'authorization',
                    'Bearer ' + jwt.sign({ userId: 100 }, jwtSecretKey)
                )
                .end((err, res) => {
                    assert.ifError(err)
                    res.should.have.status(404)
                    res.should.be.an('object')

                    res.body.should.be
                        .an('object')
                        .that.has.all.keys('message', 'statusCode')
                    done()
                })
        })
        // En hier komen meer testcases
    })
    describe('TC-306-1 uitschrijven voor een niet bestaande maaltijd', () => {
        //
        beforeEach((done) => {
            logger.debug('beforeEach called')
            // maak de testdatabase opnieuw aan zodat we onze testen kunnen uitvoeren.
            dbconnection.getConnection(function (err, connection) {
                if (err) throw err // not connected!
                connection.query(
                    CLEAR_DB + INSERT_USER + INSERT_MEALS + INSERT_MEALS_PAR,
                    function (error, results, fields) {
                        // When done with the connection, release it.
                        connection.release()
                        // Handle error after the release.
                        if (error) throw error
                        // Let op dat je done() pas aanroept als de query callback eindigt!
                        logger.debug('beforeEach done')
                        done()
                    }
                )
            })
        })

        it('TC-306-1 uitschrijven voor een niet bestaande maaltijd', (done) => {
            chai.request(server)
                .delete('/api/mealParticepate/16453424')
                .end((err, res) => {
                    assert.ifError(err)
                    res.should.have.status(401)
                    res.should.be.an('object')

                    res.body.should.be
                        .an('object')
                        .that.has.all.keys('error', 'datetime')
                    done()
                })
        })
        // En hier komen meer testcases
    })
    describe('TC-306-1 uitschrijven van een maaltijd zonder ingelogd te zijn', () => {
        //
        beforeEach((done) => {
            logger.debug('beforeEach called')
            // maak de testdatabase opnieuw aan zodat we onze testen kunnen uitvoeren.
            dbconnection.getConnection(function (err, connection) {
                if (err) throw err // not connected!
                connection.query(
                    CLEAR_DB + INSERT_USER + INSERT_MEALS + INSERT_MEALS_PAR,
                    function (error, results, fields) {
                        // When done with the connection, release it.
                        connection.release()
                        // Handle error after the release.
                        if (error) throw error
                        // Let op dat je done() pas aanroept als de query callback eindigt!
                        logger.debug('beforeEach done')
                        done()
                    }
                )
            })
        })

        it('TC-306-2 uitschrijven van een maaltijd', (done) => {
            chai.request(server)
                .delete('/api/mealParticepate/1')
                .end((err, res) => {
                    assert.ifError(err)
                    res.should.have.status(401)
                    res.should.be.an('object')

                    res.body.should.be
                        .an('object')
                        .that.has.all.keys('error', 'datetime')
                    done()
                })
        })
        // En hier komen meer testcases
    })
    describe('TC-202-3 Toon gebruikers met zoekterm op bestaande naam', () => {
        //
        beforeEach((done) => {
            logger.debug('beforeEach called')
            // maak de testdatabase opnieuw aan zodat we onze testen kunnen uitvoeren.
            dbconnection.getConnection(function (err, connection) {
                if (err) throw err // not connected!
                connection.query(
                    CLEAR_DB + INSERT_USER + INSERT_MEALS,
                    function (error, results, fields) {
                        // When done with the connection, release it.
                        connection.release()
                        // Handle error after the release.
                        if (error) throw error
                        // Let op dat je done() pas aanroept als de query callback eindigt!
                        logger.debug('beforeEach done')
                        done()
                    }
                )
            })
        })

        it('TC-202-3 Toon gebruikers met zoekterm op bestaande naam', (done) => {
            chai.request(server)
                .get('/api/user?firstName=Jan')
                .set(
                    'authorization',
                    'Bearer ' + jwt.sign({ userId: 1 }, jwtSecretKey)
                )
                .end((err, res) => {
                    assert.ifError(err)

                    res.should.have.status(200)
                    res.should.be.an('object')

                    res.body.should.be
                        .an('object')
                        .that.has.all.keys('result', 'statusCode')

                    const { statusCode, results } = res.body
                    statusCode.should.be.an('number')
                    // results.should.be.an('array').that.has.length(1)
                    // results[0].name.should.equal('Meal A')
                    // results[0].id.should.equal(1)
                    done()
                })
        })
        it('TC-202-3 Toon gebruikers met zoekterm op niet-bestaande naam', (done) => {
            chai.request(server)
                .get('/api/user?firstName=DezeNaamKomtVanJupiter')
                .set(
                    'authorization',
                    'Bearer ' + jwt.sign({ userId: 1 }, jwtSecretKey)
                )
                .end((err, res) => {
                    assert.ifError(err)

                    res.should.have.status(200)
                    res.should.be.an('object')

                    res.body.should.be
                        .an('object')
                        .that.has.all.keys('result', 'statusCode')

                    const { statusCode, result } = res.body
                    statusCode.should.be.an('number')
                    result.should.be.an("array").that.has.length(0);
                    done()
                })
        })
        it('TC-202-4 Toon actieve gebruikers', (done) => {
            chai.request(server)
                .get('/api/user?isActive=1')
                .set(
                    'authorization',
                    'Bearer ' + jwt.sign({ userId: 1 }, jwtSecretKey)
                )
                .end((err, res) => {
                    assert.ifError(err)

                    res.should.have.status(200)
                    res.should.be.an('object')

                    res.body.should.be
                        .an('object')
                        .that.has.all.keys('result', 'statusCode')

                    const { statusCode, result } = res.body
                    statusCode.should.be.an('number')
                    // result.should.be.an("array").that.has.length(0);
                    done()
                })
        })
        it('TC-202-5 Toon inactieve gebruikers', (done) => {
            chai.request(server)
                .get('/api/user?isActive=0')
                .set(
                    'authorization',
                    'Bearer ' + jwt.sign({ userId: 1 }, jwtSecretKey)
                )
                .end((err, res) => {
                    assert.ifError(err)

                    res.should.have.status(200)
                    res.should.be.an('object')

                    res.body.should.be
                        .an('object')
                        .that.has.all.keys('result', 'statusCode')

                    const { statusCode, result } = res.body
                    statusCode.should.be.an('number')
                    // result.should.be.an("array").that.has.length(0);
                    done()
                })
        })
        it('TC-202-5 Toon actieve gebruikers met een bestaande naam', (done) => {
            chai.request(server)
                .get('/api/user?isActive=1&firstName=Jan')
                .set(
                    'authorization',
                    'Bearer ' + jwt.sign({ userId: 1 }, jwtSecretKey)
                )
                .end((err, res) => {
                    assert.ifError(err)

                    res.should.have.status(200)
                    res.should.be.an('object')

                    res.body.should.be
                        .an('object')
                        .that.has.all.keys('result', 'statusCode')

                    const { statusCode, result } = res.body
                    statusCode.should.be.an('number')
                    // result.should.be.an("array").that.has.length(0);
                    done()
                })
        })
    })
    
})