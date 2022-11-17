const db = require("../db/connection.js");
const reviews = require("../db/data/test-data/reviews.js");

exports.selectCategories = () => {
  return db.query("SELECT * FROM categories;").then((data) => {
    return data.rows;
  });
};

exports.selectReviews = (category = "reviews.category", sort_by, order_by) => {
  console.log(category);
  console.log(sort_by);
  console.log(order_by);
  const validCategories = [
    "euro game",
    "social deduction",
    "dexterity",
    "children's game",
    "reviews.category"
  ];
  if ((!validCategories.includes(category))){
    console.log('rejecting');
    return Promise.reject({ status: 400, msg: "invalid query!" });
  }
  if (category !== "reviews.category"){
    category = "'" + category + "'"
  }

  return db
    .query(
      `SELECT owner,
        title, 
        reviews.review_id,
        category,
        review_img_url,
        reviews.created_at,
        reviews.votes,
        reviews.designer,
        CAST(COUNT(*)AS int) AS comment_count
        FROM reviews 
    FULL OUTER JOIN comments
        ON reviews.review_id = comments.review_id
        WHERE reviews.category = ${category} 
        GROUP BY reviews.review_id
        ORDER BY reviews.created_at DESC;`
    )
    .then((data) => {
      return data.rows;
    });
};

exports.selectReviewById = (Review_id) => {
  return db
    .query(
      `SELECT reviews.*, 
    CAST(COUNT(*)AS int) AS comment_count 
    FROM reviews 
    FULL OUTER JOIN comments
    ON reviews.review_id = comments.review_id
    WHERE reviews.review_id = $1
    GROUP BY reviews.review_id;`,
      [Review_id]
    )
    .then((data) => {
      if (data.rows.length === 0) {
        //util function to check if something exists - reject if not
        return Promise.reject({ status: 404, msg: "review not found!" });
      }
      return data.rows[0];
    });
};

exports.selectCommentsByReviewId = (review_id) => {
  return this.selectReviewById(review_id).then((result) => {
    return db
      .query(
        `SELECT * FROM comments WHERE review_id = $1 ORDER BY created_at DESC;`,
        [review_id]
      )
      .then((data) => {
        return data.rows;
      });
  });
};

exports.insertCommentByReviewId = (newComment, review_id) => {
  return this.selectReviewById(review_id).then(() => {
    return db
      .query(
        `INSERT INTO comments
        (author, body, review_id)
        VALUES ($1, $2, $3)
        RETURNING *;`,
        [newComment.author, newComment.body, review_id]
      )
      .then((resultOfInsert) => {
        return resultOfInsert.rows[0];
      });
  });
};

exports.updateReview = (updateVotes, review_id) => {
  return db
    .query(
      `UPDATE reviews SET votes = votes + ${updateVotes.inc_votes} 
        WHERE review_id = ${review_id}
        RETURNING *;`
    )
    .then((resultOfPatch) => {
      if (resultOfPatch.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "review not found!" });
      }
      return resultOfPatch.rows[0];
    });
};

exports.selectUsers = () => {
  return db.query(`SELECT * FROM users;`).then((data) => {
    return data.rows;
  });
};
