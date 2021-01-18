const { app, server} = require('../server')
const request = require('supertest');
const mongoose = require('mongoose');

let res = null
let TOKEN = ""

beforeAll(() =>{
  res = request(app)
})

describe('POST /auth/', function() {
    it('responds a token', function(done) {
      res.post('/auth/')
        .send({
            email: "andre.luiz@al.infnet.com.br",
            password: "a12345678c"
        })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
          .end(function(err, res) {
            if (err) return done(err);
            else{
                TOKEN = res.body.token
            }
            done();
          });
    });
  });

  afterAll(async ()=>{
    server.close()
    await mongoose.connection.close()
  })
