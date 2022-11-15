const { selectCategories, selectReviews, selectReviewById } = require('../models/games.js');
    
  exports.getCategories = (req, res) => {
    selectCategories().then((categories) => {
      res.status(200).send({ "categories": categories });
    });
  };

  exports.getReviews = (req, res) => {
    selectReviews().then((reviews) => {
      res.status(200).send({ "reviews": reviews });
    });
  };
  
  exports.getReviewById = (req, res, next) => {
    selectReviewById(req.params.review_id).then((review) => {
      res.status(200).send({ "review": review });
    })
    .catch((err) => {
      console.log('werta')
      next(err)
    })
  };