
var cache = require('../cache');
var crypto = require('crypto');
var Algorithms = {
  'rsa-sha1': true,
  'rsa-sha256': true,
  'rsa-sha512': true,
  'dsa-sha1': true,
  'hmac-sha1': true,
  'hmac-sha256': true,
  'hmac-sha512': true
};

// sign some data
//
module.exports.test = function test(stream, data) {
  return data.type === 'sign';
};

module.exports.handler = function (stream, data) {
  var stringToSign = data.stringToSign;
  var algo = data.algorithm || 'rsa-sha256';
  if (!Algorithms[algo]) {
    // send error...
    return;
  }
  cache.get(data.key, function (err, data) {
    if (err) { console.log(err); return; }
    if (!stringToSign) { return; }

    var alg = algo.match(/(hmac|rsa)-(\w+)/);
    var signature;
    if (alg[1] === 'hmac') {
      var hmac = crypto.createHmac(alg[2].toUpperCase(), data.value.privateKey);
      hmac.update(stringToSign);
      signature = hmac.digest('base64');
    } else {
      var signer = crypto.createSign(algo.toUpperCase());
      signer.update(stringToSign);
      signature = signer.sign(data.value.privateKey, 'base64');
    }

    stream.write({
      type: 'signResponse',
      algorithm: algo.toUpperCase(),
      data: stringToSign,
      signature: signature,
      key: data.key
    });
  });
};

