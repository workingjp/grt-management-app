const path = require('path');

require('dotenv').config({
  path: path.resolve(__dirname, '.env'),
});

const API_URL = process.env.API_URL || 'http://localhost:3000';
const API_BASE_PATH = process.env.API_BASE_PATH || '/api';

module.exports = {
  [API_BASE_PATH]: {
    target: API_URL,
    secure: false,
  },
};
