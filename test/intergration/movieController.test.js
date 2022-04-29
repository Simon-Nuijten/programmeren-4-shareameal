const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../index');
const database = [];

chai.should();
chai.use(chaiHttp);

describe('Manage movies',()=>{
    describe('Add movie /movie',()=>{
        beforeEach(()=>{
            database = [];
            done();
        })
        it('When required input is missing',(done)=>{
            chai.request(server).post('/movie').sent({
                // Title ontbreekt
                year: 1939,
                studio: 'Warner bros'
            }).end((err, res)=>{
                res.should.be.an('object')
                let{status, result} = res.body;
                status.should.equals(400)
                result.should.be.an('string').that.equals('Title moet een String zijn')
                done();
            })
        })
    })
})