const { selectCategories, selectReviews, selectReviewById,
  selectCommentsByReviewId, insertCommentByReviewId, updateReview,
  selectUsers } = require('../models/games.js');

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
      next(err)
    })
};

exports.getCommentsByReviewId = (req, res, next) => {
  selectCommentsByReviewId(req.params.review_id).then((comments) => {
    res.status(200).send({ "comments": comments });
  })
    .catch((err) => {
      next(err)
    })
}

exports.postCommentByReviewId = (req, res, next) => {
  insertCommentByReviewId(req.body, req.params.review_id).then((comment) => {
    res.status(201).send({ "comment": comment });
  })
  .catch((err) => {
    next(err)
  })
}

exports.patchReview = (req, res, next) => {
  updateReview(req.body, req.params.review_id).then((review) => {
    res.status(202).send({ "review": review });
  })
  .catch((err) => {
    next(err)
  })
}

exports.getUsers = (req, res) => {
  selectUsers().then((users) => {
    res.status(200).send({ "users": users });
  });
};