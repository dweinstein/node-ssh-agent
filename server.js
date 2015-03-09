var net = require('net');
var parse = require('through-parse');
var split = require('split');

var BANNER = {type: 'bannerResponse', version: 1.0, name: 'SSHAgent'};

module.exports = function createServer(opt, events) {

  function routeEvent(stream) {
    //console.log('client connected');

    stream.on('end', function () {
      //console.log('client disconnected');
    });

    stream.on('error', function (err) {
      console.log(err);
      stream.write({error: err.toString()});
    });

    var write = stream.write;

    stream.write = function() {
      var args = arguments;
      if (typeof args[0] == 'object') {
        args[0] = JSON.stringify(args[0]) + '\n';
      }
      write.apply(stream, args);
    };

    stream.write(BANNER);

    stream
    .pipe(split())
    .pipe(parse())
    .on('data', function(data) {
      for(var i in events) {
        if (events[i].test(stream, data)) {
          events[i].handler(stream, data);
        }
      }
    });

  }

  var server = net.createServer(routeEvent);

  return server;

};

