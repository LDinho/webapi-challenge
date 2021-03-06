const express = require('express');

const router = express.Router();

const db_actions = require('../../data/helpers/actionModel');

const {
  get,
  insert,
  update,
  remove,
  getProjectActions,
} = require('../../data/helpers/projectModel');

// POST- Create new project
router.post('/', (req, res) => {
  const newProject = req.body;

  const { name, description} = newProject;

  if (!name || !description) {
    return res.status(400)
      .json({
        errorMessage: "name/description missing."
      });
  }

  insert(newProject)
    .then((newProject) => {
      res.status(201).json(newProject);
    })
    .catch(() => {
      res.status(500)
         .json({ error: "Server error" });
    })
});

// POST- Create new action for a project
router.post('/:id/actions', async (req, res) => {
  const { id } = req.params;

  let action = {...req.body, project_id: id};

  console.log('CREATE ACTION IN POST b4 insert:::', action);

  try {

    const project = await get(id);

    if (!project) {
      return res.status(404)
                .json({message: 'No project found'})
    }

    if (action.description && action.notes) {
      console.log("AFTER INSERT::", action)

      action = await db_actions.insert(action);

      return res.status(201).json(action);

    } else {

      return res.status(404)
        .json({message: 'Description/Notes missing'})
    }

  }
  catch (err) {
    res.status(500)
      .json({error: 'Server error-Unable to add action'})
  }
});

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

// GET one project by id
router.get('/:id', (req, res) => {
  const { id } = req.params;

  get(id)
    .then(project => {
      if (!project) {
        res.status(400)
          .json(`message: project id ${id} is invalid`)
      } else {
        res.status(200).json(project)
      }
    })
    .catch(err => {
      res.status(500).json({ message: "Server Error", err })
    })
})

// GET all actions for a project by project id
router.get('/:id/actions', async (req, res) => {
  const { id } = req.params;

  /*
    Had to return each `res.status` below
     to prevent this error:

   UnhandledPromiseRejectionWarning: Error [ERR_HTTP_HEADERS_SENT]:
   Cannot set headers after they are sent to the client
   */

  try {

    const project = await get(id);

    if (!project) {
      return res.status(404)
        .json({message: "Project doesn't exist"})
    }

    const actions = await getProjectActions(id);

    if (actions.length) {
      return res.status(200).json(actions);

    } else {
      return res.status(404)
        .json({
          message: "Project has no actions."
        })
    }
  }
  catch (err) {
    return res.status(500)
      .json({
        error: "Server Error-Unable to retrieve actions."
      })
  }

});

// Update
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const updatedProject = req.body;

  const { name, description } = updatedProject;

  if (!name || !description) {
    return res.status(400)
      .json({ errorMessage: "name/description missing."   });
  }

  update(id, updatedProject )
    .then((project) => {
      console.log("Project in UPDATE:", project);

      if (project) {
        res.status(200).json(project);
      } else {
        res.status(404)
          .json({
            message: "Project with the specified ID does not exist."
          });
      }
    })
    .catch(() => {
      res.status(500).json({
        error: "Project info could not be modified."
      });
    })
});

// Delete
router.delete('/:id', (req, res) => {
  const { id } = req.params

  get(id)
    .then((project) => {
      if (project) {
        remove(id).then(()=> {
          res.status(200).json(project);
        }).catch(() => {
          res.status(500).json({ error: "Bad Server-Unable to remove" });
        })
      } else {
        res.status(404)
          .json({ message: "Project with the specified ID does not exist." });
      }
    })
    .catch(() => {
      res.status(500).json({ error: "Bad Server" });
    })
})

module.exports = router
