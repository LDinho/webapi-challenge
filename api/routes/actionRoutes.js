const express = require('express');

const router = express.Router();

const {
  get,
  update,
  remove,
} = require('../../data/helpers/actionModel');


// Read all actions
router.get('/', (req, res) => {
  get()
    .then(actions => {
      res.status(200).json(actions)
    })
    .catch(err => {
      res.status(500).json({ message: "Server error", err })
    })
})

module.exports = router
