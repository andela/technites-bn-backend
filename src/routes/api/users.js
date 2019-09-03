const router = require('express').Router();
const passport = require('passport');

router.get('/user', (req, res, next) => {});

router.put('/user', (req, res, next) => {});

router.post('/users/login', (req, res, next) => {
  if (!req.body.user.email) {
    return res.status(422).json({ errors: { email: "can't be blank" } });
  }

  if (!req.body.user.password) {
    return res.status(422).json({ errors: { password: "can't be blank" } });
  }
  passport.authenticate('local', { session: false }, (
    err,
    user,
    info
  ) => {
    if (err) {
      return next(err);
    }

    if (user) {
      // TODO: retrieve user and return it
      return res.json({ user: {} });
    }
    return res.status(422).json(info);
  })(req, res, next);
});

router.post('/users', (req, res, next) => {});

module.exports = router;
