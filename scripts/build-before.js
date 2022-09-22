const shell = require('shelljs');
const fs = require('fs');
const subtreeConfig = require('../config/sub-tree-config.json');
const config = require('../ionic.config.json');

module.exports = function() {
  deeplinkHostUpdate();
  removeCodeFromLearner();
};

// Function used to remove code from learner
function removeCodeFromLearner() {
  subtreeConfig.lineRemoveFiles.forEach((fileItem) => {
    const regexpToDeleteLine = new RegExp("^.*" + fileItem.keyword + ".*$");
    shell.sed('-i', regexpToDeleteLine, '', fileItem.filePath);
  });
}

// Function used to update the deeplink host
function deeplinkHostUpdate() {
  let packageJSON = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
  packageJSON.cordova.plugins['ionic-plugin-deeplinks'].DEEPLINK_HOST = config.deeplinkHost;
  fs.writeFileSync('package.json', JSON.stringify(packageJSON, null, 2), 'utf-8');
}
