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
          expect(category).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String)
          });
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
        expect(reviews).toHaveLength(13);
        expect(reviews).toBeSortedBy('created_at', {
          descending: true,
          coerce: true,
        });
        reviews.forEach((review) => {
          expect(review).toMatchObject({
            title: expect.any(String),
            category: expect.any(String),
            category: expect.any(String),
            designer: expect.any(String),
            owner: expect.any(String),
            review_id: expect.any(Number),
            review_img_url: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            comment_count: expect.any(Number)
          });
        });
      });
  });
});

