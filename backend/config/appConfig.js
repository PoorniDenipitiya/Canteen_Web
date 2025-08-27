const fs = require('fs');
const yaml = require('js-yaml');
const path = require('path');

const configPath = path.join(__dirname, 'application.yaml');
let config = {};
try {
  config = yaml.load(fs.readFileSync(configPath, 'utf8'));
} catch (e) {
  console.error('Failed to load config:', e);
}

module.exports = config;
