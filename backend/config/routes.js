const authRoutes = require('../routes/auth');
const feedRoutes = require('../routes/feed');

module.exports = (app) => {
  app.use('/auth', authRoutes)
  app.use('/feed', feedRoutes)
}