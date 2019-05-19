const express = require('express');

const router = express.Router();

const db_actions = require('../../data/helpers/actionModel');

const {
  get,
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

      res.status(200).json(action);
      // if (!action) { // TODO add proper error message for invalid id
      //   return res.status(400).json(`message: action id ${id} is invalid`)
      // } else {
      //   return res.status(200).json(action)
      // }
    })
    .catch(() => {
      return res.status(500).json({ message: "Server error" })
    })
});


// Update

/*

  Destructuring of the db actions update method
  causes the `this` inside the update method (in actionModel.js)
  to no longer refer to the actionModel module object.
  That causes the `this.get()` inside the `update()`
  in actionModel.js to be undefined.
  As a result, an error was always caught
  in the `catch()` causing a 'server error' response.

*/
router.put('/:id', (req, res) => {

  const { id } = req.params;
  const updatedAction = req.body;

  const { description, notes } = updatedAction;

  if (!description || !notes) {
    return res.status(400)
      .json({ errorMessage: "description/notes missing."});
  }

  db_actions.update(id, updatedAction)
    .then((action) => {
      console.log("Action UPDATE::", action);

      if (action) {
        return res.status(200).json(action);
      } else {
        return res.status(404)
          .json({
            message: "Action with the specified ID does not exist."
          });
      }
    })
    .catch(() => {
      res.status(500).json({
        error: "Server error."
      });
    })

});

// Delete
router.delete('/:id', (req, res) => {

  const { id } = req.params

  get(id)
    .then((action) => {
      if (action) {
        console.log("Action in DELETE", action);

        remove(id).then(()=> {
          res.status(200).json(action);
        }).catch(() => {
          res.status(500).json({ error: "Bad Server-Unable to remove" });
        })
      } else {
        res.status(404)
          .json({ message: "Project with the specified ID does not exist." });
      }
    })
    .catch(() => {
      res.status(500).json({ error: "Server error" });
    })

});

module.exports = router
