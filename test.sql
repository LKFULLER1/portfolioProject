\c nc_games_test
SELECT reviews.*, 
    CAST(COUNT(*)AS int) AS comment_count 
    FROM reviews 
    FULL OUTER JOIN comments
    ON reviews.review_id = comments.review_id
    WHERE reviews.review_id = 3
    GROUP BY reviews.review_id;