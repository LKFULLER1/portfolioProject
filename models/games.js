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

exports.selectReviewById = (Review_id) => {
    return db.query('SELECT * FROM Reviews WHERE Review_id = $1;', [Review_id])
        .then(data => {
            if (data.rows.length === 0){
                //util function to check if something exists - reject if not
                return Promise.reject({ status: 404, msg: 'review not found!' });
            }
            return data.rows[0];
        })
};

