const db = require('../db/connection.js');

exports.selectCategories = () => {
    return db.query('SELECT * FROM categories;')
        .then(data => {
            console.log(data.rows)
            return data.rows;
        })
};
