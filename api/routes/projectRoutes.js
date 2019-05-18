const express = require('express');

const router = express.Router();

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
  console.log('req body', req.body);

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
