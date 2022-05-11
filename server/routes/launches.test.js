require('dotenv').config();
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const database = require('../src/db');

describe('Launches API', () => {
  beforeAll(async () => {
    await database();
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });
  describe('Test GET /launches', () => {
    test('it should respond with 200 code success', async () => {
      const res = await request(app)
        .get('/v1/launches')
        .expect('Content-Type', /json/)
        .expect(200);
      // expect(res.statusCode).toBe(200);
    });
  });

  describe('Test POST /', () => {
    const launchData = {
      mission: 'USS Enterprise',
      rocket: 'NCC 1701-D',
      target: 'Kepler-62 f',
      launchDate: 'january 4, 2028',
    };

    const launchDataWithoutDate = {
      mission: 'USS Enterprise',
      rocket: 'NCC 1701-D',
      target: 'Kepler-62 f',
    };

    const launchDataWithInvalidDate = {
      mission: 'USS Enterprise',
      rocket: 'NCC 1701-D',
      target: 'Kepler-62 f',
      launchDate: 'null',
    };

    test('it should respond with 201 created', async () => {
      const res = await request(app)
        .post('/v1/launches')
        .send(launchData)
        .expect('Content-Type', /json/)
        .expect(201);

      const requestData = new Date(launchData.launchDate).valueOf();
      const resData = new Date(res.body.launchDate).valueOf();

      expect(resData).toBe(requestData);

      expect(res.body).toMatchObject(launchDataWithoutDate);
    });

    test('it should catch missing required properties', async () => {
      const res = await request(app)
        .post('/v1/launches')
        .send(launchDataWithoutDate)
        .expect('Content-Type', /json/)
        .expect(400);

      expect(res.body).toStrictEqual({
        error: 'Missing required launch property',
      });
    });

    test('it should catch invalid dates', async () => {
      const res = await request(app)
        .post('/v1/launches')
        .send(launchDataWithInvalidDate)
        .expect('Content-Type', /json/)
        .expect(400);

      expect(res.body).toStrictEqual({
        error: 'invalid date',
      });
    });
  });
});
