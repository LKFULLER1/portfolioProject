\c nc_games_test
<<<<<<< HEAD
SELECT reviews.*, 
    CAST(COUNT(*)AS int) AS comment_count 
    FROM reviews 
    FULL OUTER JOIN comments
    ON reviews.review_id = comments.review_id
    WHERE reviews.review_id = 3
    GROUP BY reviews.review_id;
=======
UPDATE reviews SET votes = votes + 5
        WHERE review_id = 200
        RETURNING *;
>>>>>>> 728273f81ff44e03e7064bb2ca35b5b2702503d7
