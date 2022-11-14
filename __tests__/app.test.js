const request = require('supertest');
const seed = require('../db/seeds/seed')
const testData = require('../db/data/test-data/index')
const app = require('../app');
const db = require('../db/connection');

beforeEach(() => {
  return seed(testData)
})

afterAll(() => {
  return db.end();
});

describe('0 - wrong endpoints', () => {
  test('status:404, responds with a route not found error', () => {
    return request(app)
      .get('/api/randomStuff')
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe('Route not found');
      });
  });
});

describe('3 - GET /api/categories', () => {
  test('status:200, responds with an array of category objects', () => {
    return request(app)
      .get('/api/categories')
      .expect(200)
      .then(({ body }) => {
        const { categories } = body;
        expect(categories).toBeInstanceOf(Array);
        expect(categories).toHaveLength(4);
        categories.forEach((category) => {
          expect(category).toEqual(
            expect.objectContaining({
              slug: expect.any(String),
              description: expect.any(String)
            })
          );
        });
      });
  });
});

