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

  try {

    const project = await get(id);

    if (!project) {
      return res.status(404)
                .json({message: 'No project found'})
    }

    if (action.description !== '') {
      action = await db_actions.insert(action);

      return res.status(201).json(action);

    } else {

      return res.status(404)
        .json({message: 'Description missing'})
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


module.exports = router
