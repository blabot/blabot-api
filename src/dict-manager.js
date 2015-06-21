var fs = require('fs');
var rsvp = require('rsvp');
var readDir = rsvp.denodeify(fs.readdir);

function loadFile(path) {
  return new rsvp.Promise(function (resolve, reject) {
    fs.readFile(path, 'utf-8', function (error, data) {
      (error) ? reject(error) : resolve(data);
    });
  });
}

function loadJSON(path) {
  return loadFile(path).then(JSON.parse);
}

function removeIndex(files) {
  return files.filter(function (file) {
    return file != 'index.json'
  });
}

function arrayToHashOfPromises(files, path) {
  var hash = {};
  files.map(function (file) {
    var key = file.replace('.json', '');
    hash[key] = loadJSON(path + '/' + file);
  });
  return hash;
}

function readDictionariesInHashmap(path) {
  return readDir(path)
    .then(removeIndex)
    .then(function(files){
      return arrayToHashOfPromises(files, path)
    })
    .then(rsvp.hash)
}

exports.readDictionariesInHashmap = readDictionariesInHashmap;