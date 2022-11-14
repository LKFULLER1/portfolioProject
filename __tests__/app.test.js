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

describe('4 - GET /api/reviews', () => {
  test('status:200, responds with an array of review objects', () => {
    return request(app)
      .get('/api/reviews')
      .expect(200)
      .then(({ body }) => {
        const { reviews } = body;
        expect(reviews).toBeInstanceOf(Array);
        expect(reviews).toHaveLength(4);
        reviews.forEach((review) => {
          expect(review).toEqual(
            expect.objectContaining({
              slug: expect.any(String),
              description: expect.any(String)


              
            })
          );
        });
      });
  });
});
