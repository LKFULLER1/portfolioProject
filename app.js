const express = require('express');
const {
  getCategories,
  getReviews,
} = require('./controllers/games.js');

const app = express();
app.use(express.json());

app.get('/api/categories', getCategories);
app.get('/api/reviews', getReviews);



app.all('/*', (req, res) => {
  res.status(404).send({ msg: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.log(err);
  res.sendStatus(500);
});

module.exports = app;
