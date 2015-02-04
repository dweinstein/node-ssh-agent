var fs = require('fs');

var client = require('../client');
var readSSHKey = require('../lib/util').readSSHKey;
var fingerprint = require('../lib/util').fingerprint;

var path = '/tmp/echo.sock';
var privKey = '/Users/user/.ssh/id_rsa';


readSSHKey(privKey, function (err, res) {
  if (err) { throw new Error(err); }

  var pub = res[0];
  var priv = res[1];
  var fp = fingerprint(pub);

  client({path: path}, function (err, stream) {

    stream.write({type: 'addKey', key: fp, publicKey: pub, privateKey: priv});
    stream.write({type: 'sign', algorithm: 'rsa-sha256', key: fp, stringToSign: 'this is fun'});

    stream.on('json', function (data) {
      if (!data.type) { return; }

      if (data.type === 'addKeyResponse') {
        //stream.write({type: 'listKeys'});
        console.log(data);
      }
      if (data.type === 'signResponse') {
        console.log(data);
      }
      if (data.type === 'listKeysResponse') {
        console.log(data);
      }
    });
  });
});

