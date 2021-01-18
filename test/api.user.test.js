const { app, server} = require('../server')
const request = require('supertest');
const mongoose = require('mongoose');
let res = null
let TOKEN = ""

console.log(TOKEN)

beforeAll(async () =>{
  res = request(app)
  await res.post('/auth/')
    .send({
      email: "andre.luiz@al.infnet.com.br",
      password: "a12345678c"
    }).then(response => {
      TOKEN = response.body.token
  })
})

const data = {
    "name": "André Luiz3",
    "username": "andreluiz3",
    "email": "andre.luiz3@al.infnet.com.br",
    "gender": "NaN",
    "password" : "a12345678c",
    "place": "Rio de Janeiro"
}

describe('GET /user', function() {
    it('responds with json list', function(done) {
      res.get('/user')
        .set('Accept', 'application/json')
        .set('x-auth-token', TOKEN)
        .expect('Content-Type', /json/)
        .expect(200, done);
    });

    it('should post a new user', function(done) {
        res.post('/user').send(data)
          .set('Accept', 'application/json')
          .expect(200)
          .end(function(err, res) {
            if (err) return done(err);
            done();
          });
      });
  });

afterAll(async ()=>{
    server.close()
    await mongoose.connection.close()
})