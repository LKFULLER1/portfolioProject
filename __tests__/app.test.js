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

describe('5. GET /api/reviews/:review_id', () => {
  test('status:200, responds with a single matching review', () => {
    const REVIEW_ID = 2;
    return request(app)
      .get(`/api/reviews/${REVIEW_ID}`)
      .expect(200)
      .then(({ body }) => {
        expect(body.review).toEqual({
          review_id: REVIEW_ID,
          title: 'Jenga',
          designer: 'Leslie Scott',
          owner: 'philippaclaire9',
          review_img_url:
            'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
          review_body: 'Fiddly fun for all the family',
          category: 'dexterity',
          created_at: "2021-01-18T10:01:41.251Z",
          votes: 5
        });
      });
  });

  test('status:404, responds with a 404 error when the review does not exist', () => {
    const REVIEW_ID = 200;
    return request(app)
      .get(`/api/reviews/${REVIEW_ID}`)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('review not found!');
      });
  });

  test('status:400, responds with a 400 error when the review_id is not valid (not an integer)', () => {
    const REVIEW_ID = 'hello';
    return request(app)
      .get(`/api/reviews/${REVIEW_ID}`)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('invalid query!');
      });
  });
});

describe('6. GET /api/reviews/:review_id/comments', () => {
  test('status:200, responds with an array of comments with the review_id', () => {
    return request(app)
      .get('/api/reviews/2/comments')
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toBeInstanceOf(Array);
        expect(comments).toHaveLength(3);
        expect(comments).toBeSortedBy('created_at', {
          descending: true
        });
        comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            review_id: 2
          });
        });
      });
  });

  test('status:200, responds with an empty array when review_id does not link to any comments', () => {
    return request(app)
      .get('/api/reviews/1/comments')
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toEqual([]);
      });
  });
});

test('status:404, responds with a 404 error when the review_id does not exist', () => {
  const REVIEW_ID = 200;
  return request(app)
    .get(`/api/reviews/${REVIEW_ID}/comments`)
    .expect(404)
    .then(({ body }) => {
      expect(body.msg).toBe('review not found!');
    });
});

test('status:400, responds with a 400 error when the review_id is not valid (not an integer)', () => {
  const REVIEW_ID = 'hello';
  return request(app)
    .get(`/api/reviews/${REVIEW_ID}/comments`)
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe('invalid query!');
    });
});


