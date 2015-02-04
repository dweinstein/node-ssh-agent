var net = require('net');
var fs = require('fs');

// TODO: secure mktmp?
var cfg = require('rc')('sshagent');

if (!cfg.path) {
  throw new Error("must supply agent path in config; see documentation");
}

var events = [
  require('./lib/events/addKey'),
  require('./lib/events/sign'),
  require('./lib/events/listKeys')
];

fs.unlink(cfg.path, function () {
  // TODO: permissions on socket?
  server = require('./server')({}, events);
  server.listen(cfg.path, function() {
    console.log('listening on path ' + cfg.path);
  });
});

