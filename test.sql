\c nc_games_test
UPDATE reviews SET votes = votes + 5
        WHERE review_id = 200
        RETURNING *;