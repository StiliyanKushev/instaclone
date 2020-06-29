const authRoutes = require('../routes/auth');
const feedRoutes = require('../routes/feed');
const mailRoutes = require('../routes/email');

module.exports = (app) => {
  app.use('/auth', authRoutes)
  app.use('/feed', feedRoutes)
  app.use('/email',mailRoutes)
}