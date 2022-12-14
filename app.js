const express = require('express');
const {
  getCategories,
  getReviews,
  getReviewById,
  getCommentsByReviewId,
  postCommentByReviewId,
  patchReview,
  getUsers,
  deleteComment
} = require('./controllers/games.js');

const app = express();
app.use(express.json());

app.get('/api/categories', getCategories);
app.get('/api/reviews', getReviews);
app.get('/api/reviews/:review_id', getReviewById);
app.get('/api/reviews/:review_id/comments', getCommentsByReviewId);
app.get('/api/users', getUsers);

app.post('/api/reviews/:review_id/comments', postCommentByReviewId);

app.patch('/api/reviews/:review_id', patchReview);

app.delete('/api/comments/:comment_id', deleteComment)



app.all('/*', (req, res) => {
  res.status(404).send({ msg: 'Route not found' });
});


app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.code = '42601') {
    res.status(400).send({ msg: 'invalid query!' })
  } else {
    next(err)
  }
})

app.use((err, req, res, next) => {
  if (err.code = '22P02') {
    res.status(400).send({ msg: 'invalid query!' })
  } else {
    next(err)
  }
})
app.use((err, req, res, next) => {
  res.sendStatus(500);
});


module.exports = app;
