var net = require('net');

var linestream = require('./lib/linestream');
var cfg = require('./lib/rc');

module.exports = function client(opt, cb) {

  var events = [ {
    test: function (data) { return data.type === 'bannerResponse'; },
    handler: function (stream, data) { stream.write({got: 'banner'}); }
  } ];

  function connection(listener) {
    var stream = linestream(listener);

    stream.on('json', function(data) {
      for (var key in events) {
        if (events[key].test(data)) {
          events[key].handler(stream, data);
        }
      }
    });

    return cb(null, stream);

  }

  var listener = net.connect(opt.path || cfg.path);

  listener
  .on('connect', connection.bind(connection, listener));

};

