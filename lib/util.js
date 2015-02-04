var crypto = require('crypto');
var async = require('async');
var spawn = require('child_process').spawn;
var fs = require('fs');

function fingerprint(key) {
  if (typeof key !== 'string') {
    throw new Error('key must be a string');
  }

  var pieces = key.split(' ');
  if (!pieces || !pieces.length || pieces.length < 2)
    throw new Error('invalid ssh key');

  var data = new Buffer(pieces[1], 'base64');

  var hash = crypto.createHash('md5');
  hash.update(data);
  var digest = hash.digest('hex');

  var fp = '';
  for (var i = 0; i < digest.length; i++) {
    if (i && i % 2 === 0)
      fp += ':';

    fp += digest[i];
  }

  return fp;
}

module.exports.fingerprint = fingerprint;

function readPrivPromptPass(privPath, password, cb) {
  if (typeof password === 'function') {
    cb = password;
    password = null;
  }
  var key = [];
  var openssl = spawn('openssl', ['rsa', '-in', privPath], { stdio: password ? 'ignore':['pipe']});

  if (password) {
    openssl.stdin.write(password);
    openssl.stdin.write('\n');
  }

  openssl.stdout.on('data', function (data) {
    key.push(data);
  });

  openssl.on('close', function() {
    priv = key.join('');
    return cb(null, priv);
  });
}

module.exports.readSSHPrivKey = readPrivPromptPass;

function readPub(path, cb) {
  path = path.split('.pub')[0]+'.pub';
  fs.readFile(path, 'ascii', cb);
}

module.exports.readSSHPubKey = readPub;

function readKeys(path, cb) {
  async.parallel([
    readPub.bind(readPub, path),
    readPrivPromptPass.bind(readPrivPromptPass, path)
  ], cb);
}

module.exports.readSSHKey = readKeys;

