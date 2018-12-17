'use strict';

const path = require('path');
const fs = require('fs');

module.exports = async function(copyList, pathFrom, pathTo) {  
  var pathFrom = pathFrom || 'node_modules';
  var filesCount = 0;

  var deleteFolderRecursive = function (pathFind) {
    try {
      if(fs.existsSync(pathFind)) {
        if (!pathFind) pathFind = path.resolve(pathTo);
    
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

    } catch(e) {
      console.error('No such file or directory: ', pathFind)

    }          
  };
  
  var copyFolderRecursive = function (filePath) {
    try {
      fs.readdirSync(filePath).forEach(function(file) {
        var pathFind = filePath + '/' + file;
    
        if(fs.lstatSync(pathFind).isDirectory()) {
          copyFolderRecursive(pathFind);
    
        } else {
          fs.copyFileSync(pathFind, path.resolve(pathFind.replace(pathFrom, pathTo)), {
            process: function(contents) {
              fs.writeFile(path.resolve(pathFind.replace(pathFrom, pathTo)), contents)

              filesCount += 1;
            }
          })
        }
      });

    } catch(e) {
      console.error('No such file or directory: ', filePath)

    } 

    
  }

  if (!fs.existsSync(path.resolve(pathTo))) {
    fs.mkdir(path.resolve(pathTo));

  } else {
    deleteFolderRecursive();

  }  

  for (var i = 0; i < copyList.length; i++) {
    var paths = copyList[i].split('/');
    var filePath = path.resolve(pathFrom + '/' + copyList[i]);

    if (paths[paths.length - 1] === '*') {
      copyFolderRecursive(filePath.replace('/*', ''));

    } else {      
      var pathFind = copyList[i];

      try {
        fs.copyFileSync(filePath, path.resolve(pathTo + '/' + pathFind), {
          process: function(contents) {
            fs.writeFile(path.resolve(pathTo + '/' + pathFind), contents)

            filesCount += 1;
          }
        })
  
      } catch(e) {
        console.error('No such file or directory: ', filePath)
  
      }      
    }
  }  

  console.info('Copied ' + filesCount + ' files.');  
};