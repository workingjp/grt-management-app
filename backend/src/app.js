const express = require('express');
console.log('APP.JS LOADED');
const cors = require('cors');
const healthRoutes = require('./routes/health.routes');
const templateRoutes = require('./routes/template.routes');
const templateAccountRoutes = require('./routes/templateAccount.routes');
const companyAccountRoutes = require('./routes/companyAccount.routes');
const mappingRoutes = require('./routes/mapping.routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());
app.get('/', (req, res) => {
    res.send('ROOT WORKING');
  });
app.get('/api/debug', (req, res) => {
    res.json({
      message: 'debug route works'
    });
  });
app.use('/api/templates', templateRoutes);
app.get('/api/test', (req, res) => {
    res.json({ success: true });
  });
app.use('/api', healthRoutes);
// app.use('/api/templates', templateRoutes);
app.use('/api/template-accounts', templateAccountRoutes);
app.use('/api/company-accounts', companyAccountRoutes);
app.use('/api/mappings', mappingRoutes);

app.use(errorHandler);

module.exports = app;
