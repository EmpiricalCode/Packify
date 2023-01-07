//Constants
const FS = require('fs');
const db = "../../db/";

//Main
module.exports.read = (dir) => {
  var rawdata = FS.readFileSync(dir);
  var data = JSON.parse(rawdata);

  return data;
}

module.exports.set = (dir, key, value) => {

  const json = module.exports.createObject(key, value);

  var rawdata = FS.readFileSync(dir);
  var data = JSON.parse(rawdata);

  if (json.key) {
    if(data[json.key]) {

      data[json.key] = json[json.key];

      data = JSON.stringify(data);

      FS.writeFileSync(dir, data);
    } else {
      var newData = {};

      newData[json.key] = json[json.key];

      newData = Object.assign(newData, data);
      newData = JSON.stringify(newData);

      FS.writeFileSync(dir, newData);
    }
  }
};

module.exports.create = (dir, name) => {
  if (!FS.existsSync(`${dir}/${name}.json`)) {
    FS.appendFile(`${dir}/${name}.json`, "", function() {});
    FS.writeFileSync(`${dir}/${name}.json`, "{}", function() {});
  }

  return `${dir}/${name}.json`;
}

module.exports.remove = (dir, key) => {
  var rawdata = FS.readFileSync(dir);
  var data = JSON.parse(rawdata);

  delete data[key];

  data = JSON.stringify(data);

  FS.writeFileSync(dir, data);
}
 
module.exports.createObject = (key, value) => {
  const r = {};

  r.key = key;
  r[key] = value;

  return r;
}