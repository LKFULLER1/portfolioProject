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
  // test('status:200, responds with an array of category objects', () => {
  //   return request(app)
  //     .get('/api/categories')
  //     .expect(200)
  //     .then(({ body }) => {
  //       const { categories } = body;
  //       expect(categories).toBeInstanceOf(Array);
  //       expect(categories).toHaveLength(26);
  //       categories.forEach((treasure) => {
  //         expect(treasure).toEqual(
  //           expect.objectContaining({
  //             treasure_id: expect.any(Number),
  //             treasure_name: expect.any(String),
  //             colour: expect.any(String),
  //             age: expect.any(Number),
  //             cost_at_auction: expect.any(Number),
  //             shop_name: expect.any(String)
  //           })
  //         );
  //       });
  //     });
  // });
  test('should ', () => {
    //expect(1).toBe(1);
    return request(app)
      .get('/api/categories')
      .expect(200)
      .then(({ body }) => {
        console.log(body)
      })
  });
});

