const db = require('../db/connection.js');

exports.selectCategories = () => {
    return db.query('SELECT * FROM categories;')
        .then(data => {
            return data.rows;
        })
};

exports.selectReviews = () => {
    return db.query('SELECT * FROM reviews;')
        .then(data => {
            return data.rows;
        })
};
