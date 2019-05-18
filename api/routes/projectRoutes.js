const express = require('express');

const router = express.Router();

const {
  get,
  insert,
  update,
  remove,
  getProjectActions,
} = require('../../data/helpers/projectModel');


module.exports = router
