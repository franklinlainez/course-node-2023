const request = require('supertest');
const app = require('../../app');

describe('Test GET /launches', () => {
  test('It should respond with 200 success', async () => {
    const response = await request(app)
      .get('/launches')
      .expect('Content-Type', /json/)
      .expect(200);
  });
});

describe('Test POST /launch', () => {
  const sentData = {
    mission: 'USS Enterprise',
    rocket: 'NCC 1234',
    target: 'Kepler-186 f'
  };

  const launchDate = 'January 4, 2028';

  test('It should respond with 200 success', async () => {
    const response = await request(app)
      .post('/launches')
      .send({ ...sentData, launchDate })
      .expect('Content-Type', /json/)
      .expect(201);

    expect(response.body).toMatchObject(sentData);
    expect(new Date(response.body.launchDate).valueOf()).toBe(
      new Date(launchDate).valueOf()
    );
  });

  test('It should catch missing required properties', async () => {
    const response = await request(app)
    .post('/launches')
    .send(sentData)
    .expect('Content-Type', /json/)
    .expect(400);

    expect(response.body).toStrictEqual({
        error: 'Missing required launch property'
    })
  });
  test('It should catch invalid dates', async() => {
    const response = await request(app)
    .post('/launches')
    .send({ ...sentData, launchDate: 'Hello Peter' })
    .expect('Content-Type', /json/)
    .expect(400);

    expect(response.body).toStrictEqual({
        error: 'Invalid launch date'
    })

  });
});
