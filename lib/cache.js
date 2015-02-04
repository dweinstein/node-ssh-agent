
// cache data only in memory...
var cache = {
};

module.exports.add = function put(key, value, cb) {
  if (typeof key !== 'string') {
    return cb(new Error('invalid key type'));
  }

  cache[key] = value;
  return cb(null, {key: key, value: value});
};

module.exports.get = function get(key, cb) {
  if (typeof key !== 'string') {
    return cb(new Error('invalid key type'));
  }
  if (!cache[key]) { return cb({notFound: true}); }
  return cb(null, {key: key, value: cache[key]});
};

module.exports.dump = function dump(cb) {
  return cb(null, cache);
};

module.exports.listKeys = function listKeys(cb) {
  return cb(null, Object.keys(cache));
};

