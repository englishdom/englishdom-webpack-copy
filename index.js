'use strict';

const path = require('path');
const fs = require('file-system');

module.exports = async function(pathFrom, pathTo) {
  if (!pathFrom || !pathTo) {
    console.warn('One of paths not find');

    return;
  }

  var htmlFilesBuilded = 0;

  var deleteExistingBindles = function () {
    let findPath = path.resolve(pathTo);

    if (fs.existsSync(findPath)) {
      fs.readdirSync(findPath).forEach(function(file){
        var filePath = findPath + '/' + file;
  
        fs.unlinkSync(filePath);        
      });

      fs.rmdirSync(findPath);      
    }
  };  

  var findHtmlTemplatesRecursive = function (pathFrom) {
    try {
      fs.readdirSync(pathFrom).forEach(function(file) {
        var pathFind = pathFrom + '/' + file;
    
        if(fs.lstatSync(pathFind).isDirectory()) {
          findHtmlTemplatesRecursive(pathFind);
    
        } else {
          htmlFilesBuilded += 1;
          
          fs.readFile(pathFind, 'utf8', function(err, content) {
            var root = 'export default `' + content + '`';
            var replacer = 'html';

            if (file.indexOf('hbs') > 0) replacer = 'hbs';              
            
            fs.writeFile(path.resolve(pathTo, file.replace(replacer, 'js')), root, function(err) {});
          })          
        }
      });

    } catch(e) {
      console.error('No such file or directory: ', pathFind)

    }
  }

  deleteExistingBindles();

  if (!fs.existsSync(path.resolve(pathTo))) {
    fs.mkdir(path.resolve(pathTo));
  }

  findHtmlTemplatesRecursive(path.resolve(pathFrom));
  
  console.info('Builded ' + htmlFilesBuilded + ' templates.');
};