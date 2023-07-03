const fs = require('fs');

const buildDate = new Date().getTime();

const buildInfo = {
  buildDate: buildDate,
};

// Save build info to a file
fs.writeFileSync('build-info.json', JSON.stringify(buildInfo));

// Export build info as a module
// fs.writeFileSync('build-info.js', `export default ${JSON.stringify(buildInfo)};`);