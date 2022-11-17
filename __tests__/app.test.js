const request = require("supertest");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");
const app = require("../app");
const db = require("../db/connection");

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  return db.end();
});

describe("0 - wrong endpoints", () => {
  test("status:404, responds with a route not found error", () => {
    return request(app)
      .get("/api/randomStuff")
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Route not found");
      });
  });
});

describe("3 - GET /api/categories", () => {
  test("status:200, responds with an array of category objects", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then(({ body }) => {
        const { categories } = body;
        expect(categories).toBeInstanceOf(Array);
        expect(categories).toHaveLength(4);
        categories.forEach((category) => {
          expect(category).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
});

describe("4 - GET /api/reviews", () => {
  test("status:200, responds with an array of review objects", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then(({ body }) => {
        const { reviews } = body;
        expect(reviews).toBeInstanceOf(Array);
        expect(reviews).toHaveLength(13);
        expect(reviews).toBeSortedBy("created_at", {
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
            comment_count: expect.any(Number),
          });
        });
      });
  });

  describe("11-queries", () => {
    test("should return reviews of the provided category", () => {
      return request(app)
        .get("/api/reviews?category=dexterity")
        .expect(200)
        .then(({ body }) => {
          const { reviews } = body;
          reviews.forEach((review) => {
            expect(review).toMatchObject({
              category: 'dexterity'
            });
          });
        });
    });

    test("should return all reviews with no category provided", () => {
      return request(app)
        .get("/api/reviews")
        .expect(200)
        .then(({ body }) => {
          const { reviews } = body;
          expect(reviews).toHaveLength(13);
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
            comment_count: expect.any(Number),
            });
          });
        });
    });

    test("status:400, responds with a 400 error when the category is not valid", () => {
      return request(app)
        .get(`/api/reviews?category=rubbish`)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("invalid query!");
        });
    });

    test("should return reviews sorted by the sort_by query (desc, by default)", () => {
      return request(app)
        .get("/api/reviews?sort_by=votes")
        .expect(200)
        .then(({ body }) => {
          const { reviews } = body;
            expect(reviews).toBeSortedBy("votes", {
              descending: true,
              coerce: true,
            });
        });
    });

    test('should return reviews sorted by date (created_at) by default', () => {
      return request(app)
        .get("/api/reviews")
        .expect(200)
        .then(({ body }) => {
          const { reviews } = body;
            expect(reviews).toBeSortedBy("created_at", {
              descending: true
            });
        });
    });

    test("status:400, responds with a 400 error when the sort_by is not valid", () => {
      return request(app)
        .get(`/api/reviews?sort_by=rubbish`)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("invalid query!");
        });
    });

    test("should return reviews ordered by the order_by query", () => {
      return request(app)
        .get("/api/reviews?order_by=asc")
        .expect(200)
        .then(({ body }) => {
          const { reviews } = body;
            expect(reviews).toBeSortedBy("created_at", {
              descending: false
            });
        });
    });

    test("should return reviews ordered by DESC by default", () => {
      return request(app)
        .get("/api/reviews")
        .expect(200)
        .then(({ body }) => {
          const { reviews } = body;
            expect(reviews).toBeSortedBy("created_at", {
              descending: true
            });
        });
    });

    test("status:400, responds with a 400 error when the order_by is not valid", () => {
      return request(app)
        .get(`/api/reviews?order_by=rubbish`)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("invalid query!");
        });
    });
  });
});

describe("5. GET /api/reviews/:review_id", () => {
  test("status:200, responds with a single matching review (with comment count)", () => {
    const REVIEW_ID = 2;
    return request(app)
      .get(`/api/reviews/${REVIEW_ID}`)
      .expect(200)
      .then(({ body }) => {
        expect(body.review).toEqual({
          review_id: REVIEW_ID,
          title: "Jenga",
          designer: "Leslie Scott",
          owner: "philippaclaire9",
          review_img_url:
            "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
          review_body: "Fiddly fun for all the family",
          category: "dexterity",
          created_at: "2021-01-18T10:01:41.251Z",
          votes: 5,
          comment_count: 3,
        });
      });
  });

  test("status:404, responds with a 404 error when the review does not exist", () => {
    const REVIEW_ID = 200;
    return request(app)
      .get(`/api/reviews/${REVIEW_ID}`)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("review not found!");
      });
  });

  test("status:400, responds with a 400 error when the review_id is not valid (not an integer)", () => {
    const REVIEW_ID = "hello";
    return request(app)
      .get(`/api/reviews/${REVIEW_ID}`)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("invalid query!");
      });
  });
});

describe("6. GET /api/reviews/:review_id/comments", () => {
  test("status:200, responds with an array of comments with the review_id", () => {
    return request(app)
      .get("/api/reviews/2/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toBeInstanceOf(Array);
        expect(comments).toHaveLength(3);
        expect(comments).toBeSortedBy("created_at", {
          descending: true,
        });
        comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            review_id: 2,
          });
        });
      });
  });

  test("status:200, responds with an empty array when review_id does not link to any comments", () => {
    return request(app)
      .get("/api/reviews/1/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toEqual([]);
      });
  });
  test("status:404, responds with a 404 error when the review_id does not exist", () => {
    const REVIEW_ID = 200;
    return request(app)
      .get(`/api/reviews/${REVIEW_ID}/comments`)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("review not found!");
      });
  });

  test("status:400, responds with a 400 error when the review_id is not valid (not an integer)", () => {
    const REVIEW_ID = "hello";
    return request(app)
      .get(`/api/reviews/${REVIEW_ID}/comments`)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("invalid query!");
      });
  });
});

describe("7. POST /api/reviews/:review_id/comments", () => {
  test("status:201, responds with comment newly added to the database", () => {
    const newComment = {
      author: "mallionaire",
      body: "rubbish mate, grumble!",
    };
    return request(app)
      .post(`/api/reviews/2/comments`)
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        expect(body.comment).toMatchObject({
          comment_id: 7,
          ...newComment,
        });
      });
  });

  test("status:404, responds with a 404 error when the review_id does not exist", () => {
    const newComment = {
      author: "mallionaire",
      body: "rubbish mate, grumble!",
    };
    return request(app)
      .post(`/api/reviews/200/comments`)
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("review not found!");
      });
  });

  test("status:400, responds with a 400 error when a (NOT NULL) property is not present - wrong format", () => {
    const newComment = {
      body: "rubbish mate, grumble!",
    };
    return request(app)
      .post(`/api/reviews/2/comments`)
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("invalid query!");
      });
  });

  test("should respond with a 400 error when the review_id is not valid (not an integer)", () => {
    const newComment = {
      author: "mallionaire",
      body: "rubbish mate, grumble!",
    };
    return request(app)
      .post(`/api/reviews/hello/comments`)
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("invalid query!");
      });
  });
});

describe("8. PATCH /api/reviews/:review_id", () => {
  test("status:202, responds with correctly updated review", () => {
    const REVIEW_ID = 3;
    const updateVotes = {
      inc_votes: 5,
    };
    return request(app)
      .patch(`/api/reviews/${REVIEW_ID}`)
      .send(updateVotes)
      .expect(202)
      .then(({ body }) => {
        expect(body.review).toMatchObject({
          review_id: REVIEW_ID,
          title: "Ultimate Werewolf",
          category: "social deduction",
          designer: "Akihisa Okui",
          owner: "bainesface",
          review_body: "We couldn't find the werewolf!",
          review_img_url:
            "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
          created_at: "2021-01-18T10:01:41.251Z",
          votes: 10,
        });
      });
  });

  test("status:404, responds with a 404 error when the review_id does not exist", () => {
    const REVIEW_ID = 200;
    const updateVotes = {
      inc_votes: 5,
    };
    return request(app)
      .patch(`/api/reviews/${REVIEW_ID}`)
      .send(updateVotes)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("review not found!");
      });
  });

  test("status:400, responds with a 400 error when a (NOT NULL) property is not present - wrong format", () => {
    const REVIEW_ID = 2;
    const updateVotes = {};
    return request(app)
      .patch(`/api/reviews/${REVIEW_ID}`)
      .send(updateVotes)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("invalid query!");
      });
  });

  test("should respond with a 400 error when the review_id is not valid (not an integer)", () => {
    const REVIEW_ID = "hello";
    const updateVotes = {
      inc_votes: 5,
    };
    return request(app)
      .patch(`/api/reviews/${REVIEW_ID}`)
      .send(updateVotes)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("invalid query!");
      });
  });
});

describe("9 - GET /api/users", () => {
  test("status:200, responds with an array of user objects", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const { users } = body;
        expect(users).toBeInstanceOf(Array);
        expect(users).toHaveLength(4);
        users.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });
});

describe('12 - DELETE /ap/comments/comment_id', () => {
  test('should delete the comment with the comment_id', () => {
    return request(app)
        .delete(`/api/comments/3`)
        .expect(204)
  });
  test('should return 404 when an invalid comment_id is passed', () => {
    return request(app)
        .delete(`/api/comments/100`)
        .expect(404)
  });
});

describe.only('13 - GET /api json', () => {
  test('should get the json that describes the endpoints available', () => {
    return request(app)
    .get('/api')
    .expect(200)
    .then(( {body} ) => {
      expect(Object.keys(body).length).toBe(3)
    });
  });
});
