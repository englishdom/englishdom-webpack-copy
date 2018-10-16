'use strict';

module.exports = async function(copyList, pathFrom, pathTo) {
  var path = require('path');
  var fs = require('file-system');
  var pathFrom = pathFrom || 'node_modules';
  var filesCount = 0;

  if (!fs.existsSync(path.resolve(__dirname, pathTo))) {
    fs.mkdir(path.resolve(__dirname, pathTo));

  } else {
    var deleteFolderRecursive = function(pathFind) {
      if( fs.existsSync(pathFind)) {
        if (!pathFind) pathFind = path.resolve(__dirname, pathTo);

        fs.readdirSync(pathFind).forEach(function(file){
          pathFind = pathFind + '/' + file;

          if(fs.lstatSync(pathFind).isDirectory()) {
            deleteFolderRecursive(pathFind);

          } else {
            fs.unlinkSync(pathFind);

          }
        });

        fs.rmdirSync(pathFind);
      }      
    };

    deleteFolderRecursive();
  }

  for (var i = 0; i < copyList.length; i++) {
    var filePath = path.resolve(__dirname, pathFrom + '/' + copyList[i] + '.js');
    var file = copyList[i];

    fs.copyFileSync(filePath, path.resolve(__dirname, pathTo + file + '.js'), {
      process: function(contents) {
        filesCount += 1;
      }
    });
  }

  console.info('Copied ' + filesCount + ' files.');  
};