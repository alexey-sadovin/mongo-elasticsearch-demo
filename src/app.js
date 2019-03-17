const express = require('express');
const ServiceFacade = require('./../core/ServiceFacade');
const {server: {port}} = require('./../core/config');
const app = express();

app.locals.services = new ServiceFacade();
app.locals.services
  .getElasticDriver()
  .connect()
  .catch(err => {
    console.error('Something went terribly wrong', err);
  });

app.disable('x-powered-by');
app.use('/api', require('./search'));

app.listen(port, () => {
  console.log(`Server listening on ${port}`);
});

module.exports = app;
