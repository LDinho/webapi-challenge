const express = require('express');

const router = express.Router();

const {
  get,
  insert,
  update,
  remove,
  getProjectActions,
} = require('../../data/helpers/projectModel');

// GET all projects
router.get('/', (req, res) => {
  get()
    .then(projects => {
      res.status(200).json(projects)
    })
    .catch(err => {
      res.status(500)
         .json({ message: "Server error", err })
    })
})


module.exports = router
