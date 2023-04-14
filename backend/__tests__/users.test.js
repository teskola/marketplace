const { describe, test, expect, afterAll } = require('@jest/globals');
const supertest = require('supertest');
const connection = require('../db/pool');
const app = require('../app');

describe('SIGNUP users endpoint', () => { 

    afterAll(async () => {
     const deleteQuery = 'DELETE FROM users WHERE email=? OR email=?;'
      connection.query(deleteQuery, ['tony@stark.com', 'tony@testi'], (err, result) => {
        if(err) {
          console.log(err);
        }
      });
    });

    test('too short password', async () => {
        const data = {
            name: 'Tony Stark',
            email: 'tony@stark.com',
            password: 'testi'
        }
        const response = await supertest(app)
        .post('/api/users/signup')
        .set('Accept', 'application/json')
        .set('Content', 'application/json')
        .send(data)
        expect(response.status).toEqual(403);
    });

    test('invalid email', async () => {
        const data = {
            name: 'Tony Stark',
            email: 'tony@testi',
            password: 'testi1234'
        }
        const response = await supertest(app)
        .post('/api/users/signup')
        .set('Accept', 'application/json')
        .set('Content', 'application/json')
        .send(data)
        expect(response.status).toEqual(403);
    });
  
    test('should signup user with valid credentials', async () => {
      const data = {
        name: 'Tony Stark',
        email: 'tony@stark.com',
        password: 'password123',
        phone: '050123123',
      }
  
      const response = await supertest(app)
        .post('/api/users/signup')
        .set('Accept', 'application/json')
        .set('Content', 'application/json')
        .send(data)
  
        expect(response.status).toEqual(201);
        expect(response.headers['content-type']).toMatch(/json/);
        expect(response.body.id).toBeTruthy();
        expect(response.body.email).toBeTruthy();
        expect(response.body.token).toBeTruthy();
    }); 

    test('wrong password', async () => {
        const data = {
            name: 'Tony Stark',
            email: 'tony@stark.com',
            password: 'password1234'
        }
        const response = await supertest(app)
        .post('/api/users/login')
        .set('Accept', 'application/json')
        .set('Content', 'application/json')
        .send(data)
  
        expect(response.status).toEqual(401);
    });

    test('wrong email', async () => {
        const data = {
            email: 'tony@test.com',
            password: 'password123'
        }
        const response = await supertest(app)
        .post('/api/users/login')
        .set('Accept', 'application/json')
        .set('Content', 'application/json')
        .send(data)
  
        expect(response.status).toEqual(401);
    });

    test('user already exists', async () => {
        const data = {
            name: 'Tony Stark Again',
            email: 'tony@stark.com',
            password: 'testi1234',
          }
      
          const response = await supertest(app)
            .post('/api/users/signup')
            .set('Accept', 'application/json')
            .set('Content', 'application/json')
            .send(data)
      
            expect(response.status).toEqual(422);
    })

  
    test('should login user with valid credentials', async () => {
      const data = {
        email: 'tony@stark.com',
        password: 'password123'
      }
  
      const response = await supertest(app)
        .post('/api/users/login')
        .set('Accept', 'application/json')
        .set('Content', 'application/json')
        .send(data)
  
        expect(response.status).toEqual(201);
        expect(response.headers['content-type']).toMatch(/json/);
        expect(response.body.id).toBeTruthy();
        expect(response.body.email).toBeTruthy();
        expect(response.body.token).toBeTruthy();
    }); 
    
  });