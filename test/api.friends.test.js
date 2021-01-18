const { app, server} = require('../server')
const request = require('supertest');
const mongoose = require('mongoose');
let res = null
let TOKEN = ""


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

const data = {}

describe('GET /friend', function() {
  it('responds with json list', function(done) {
    res.get('/friends')
      .set('Accept', 'application/json')
      .set('x-auth-token', TOKEN)
      .expect('Content-Type', /json/)
      .expect(200, done);
  });

  it('should add a new friend to user logged', function(done) {
    res.post('/friends').send({id : '5fc4d728b731e25d8a61b37f'})
      .set('Accept', 'application/json')
      .set('x-auth-token', TOKEN)
      .expect('Content-Type', /json/)
      .expect(200, done);
  });

})

afterAll(async ()=>{
    server.close()
    await mongoose.connection.close()
})