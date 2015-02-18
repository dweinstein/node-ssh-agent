var split = require('split');

module.exports = function Linestream(stream) {
  stream
    .pipe(split(JSON.parse))
    .on('data', function(d) {
      stream.emit('json', d);
    })
    .on('error', function(err) {
      if (!(/end of input/).test(err)) {
        throw err;
      }
    });

  var write = stream.write;

  stream.write = function() {
    var args = arguments;
    if (typeof args[0] == 'object') {
      args[0] = JSON.stringify(arguments[0]) + '\n';
    }
    write.apply(stream, args);
  };

  return stream;
};

