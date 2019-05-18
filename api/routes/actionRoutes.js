const express = require('express');

const router = express.Router();

const {
  get,
  update,
  remove,
} = require('../../data/helpers/actionModel');



module.exports = router
