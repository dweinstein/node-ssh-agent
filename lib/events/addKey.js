var cache = require('../cache');

var fingerprint = require('../util').fingerprint;

//
// add a key
//
module.exports.test = function test(stream, data) {
  return data.type === 'addKey';
};

module.exports.handler = function (stream, data) {

  var pub = data.publicKey;
  var priv = data.privateKey;
  var key = data.key;
  if (priv) {
    cache.add(key, {fingerprint: fingerprint(pub), publicKey: pub, privateKey: priv}, function (err, res) {
      if (err) { throw err; }
      stream.write({type: 'addKeyResponse', key: key, fingerprint: key, message: 'key added'});
    });
  } else {
    stream.emit('error', 'no private key supplied');
  }

};

