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
      if (!action) {
        return res.status(404)
                  .json(`message: action id ${id} is invalid`)
      }
      res.status(200).json(action)
    })
    .catch(() => {
       res.status(500).json({ message: "Server error" })
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
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {

    const action = await get(id);

    if (!action) {
      // need to return the `res` to prevent this error:
      // UnhandledPromiseRejectionWarning:
      // Error [ERR_HTTP_HEADERS_SENT]:
      // Cannot set headers after they are sent to the client
      return res.status(404)
                .json({
                  message: 'Action with the specified ID does not exist.'
                });
    }

    await remove(id);
    res.status(200).json(action);

  } catch (err) {
    res.status(500).json({error: 'Server error'});
  }

  /*
  // Promise version:
  get(id)
    .then((action) => {
      if (action) {

        remove(id)
          .then(()=> {
          res.status(200).json(action);
        }).catch(() => {
          res.status(500).json({ error: "Bad Server-Unable to remove" });
        })
      } else {
        res.status(404)
          .json({ message: "Action with the specified ID does not exist." });
      }
    })
    .catch(() => {
      res.status(500).json({ error: "Server error" });
    })

   */

});

module.exports = router
