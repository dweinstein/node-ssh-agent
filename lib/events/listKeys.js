var cache = require('../cache');

//
// List keys in agent.
//
module.exports.test = function test(stream, data) {
  return data.type === 'listKeys';
};

module.exports.handler  = function (stream, data) {
  cache.listKeys(function (err, keys) {
    if (err) { console.log(err); return; }
    stream.write({type: 'listKeysResponse', keys: keys});
  });
};

