const express = require('express');

const router = express.Router();

const {
  get,
  update,
  remove,
} = require('../../data/helpers/actionModel');


// GET all actions
router.get('/', (req, res) => {
  get()
    .then(actions => {
      res.status(200).json(actions)
    })
    .catch(err => {
      res.status(500).json({ message: "Server error", err })
    })
})

// GET one action by id
router.get('/:id', (req, res) => {
  const { id } = req.params;

  get(id)
    .then(action => {
      console.log('ACTION GET ID:', action)
      if (!action) {
        return res.status(400).json(`message: action id ${id} is invalid`)
      } else {
        return res.status(200).json(action)
      }
    })
    .catch(() => {
      return res.status(500).json({ message: "Server error" })
    })
});

module.exports = router
