const router = require('express').Router();
const { Project, Employee } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', withAuth, async (req, res) => {
  try {
    const projectData = await Project.findAll();
    const projects = await projectData.map((project) => project.get({ plain: true }));
  
    const managerData = await Employee.findAll({
      where: {
        is_manager: true
      }
    });
    const managers = await managerData.map((manager) => manager.get({ plain: true }));
  
    const employeeData = await Employee.findAll({
      where: {
        is_manager: false
      }
    });
    const employees = await employeeData.map((employee) => employee.get({ plain: true }));
  
    res.render('home', {
      projects,
      managers,
      employees,
      isMgr: req.session.mgr,
      loggedIn: req.session.loggedIn
    });
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
}
});

router.get('/login', (req, res) => {
  try {
    if (req.session.loggedIn) {
      res.redirect('/dashboard');
      return;
    }
  
    res.render('login');
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

router.get('/signup', (req, res) => {
  try {
    if (req.session.loggedIn) {
      res.redirect('/dashboard');
      return;
    }
  
    res.render('signup', {
      signup: true
    });
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
})

module.exports = router;