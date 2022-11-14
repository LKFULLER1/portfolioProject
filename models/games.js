const db = require('../db/connection.js');

exports.selectCategories = () => {
    return db.query('SELECT * FROM categories;')
        .then(data => {
            return data.rows;
        })
};

exports.selectReviews = () => {
    return db.query(`SELECT owner,
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
        GROUP BY reviews.review_id
        ORDER BY reviews.created_at DESC;`)
        .then(data => {
            return data.rows;
        })
};
