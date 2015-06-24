const tape = require('tape')
const spawn = require('child_process').spawn
const exec = require('child_process').exec
const path = require('path')
const match = require('match-through')

function test(name, cb) {
  tape(name, function (t) {
    var agent = spawn(getPath('ssh-agent'))
    var end = t.end.bind(t)
    t.end = function () {
      agent.kill()
      end()
    }
    agent.stdout.pipe(match(/listening on path/, function () {
      cb(t)
    }))
  })
}

function getPath(prog) {
  return path.join(__dirname, '../bin/', prog)
}

test('when node-ssh-agent starts it has no keys', function (t) {
  exec(getPath('ssh-list'), function (err, stdout, stderr) {
    t.notOk(err, 'no error')
    t.equal(stderr.toString(), '', 'no stderr output')
    var result = JSON.parse(stdout.toString())
    t.deepEqual(result, [], 'should be empty array')
    t.end()
  })
})

test('keys can be added and listed', function (t) {
  var key = path.join(__dirname, 'testkey')
  exec(getPath('ssh-add') + ' ' + key, function (err, stdout, stderr) {
    t.notOk(err, 'no error')
    t.equal(stderr.toString(), '', 'no stderr output')
    var res = JSON.parse(stdout.toString())
    t.equal(res.type, 'addKeyResponse', 'correct response')
    t.equal(res.key, res.fingerprint)
    t.equal(res.message, 'key added')
    exec(getPath('ssh-list'), function (err, stdout, stderr) {
      t.notOk(err, 'no error')
      t.equal(stderr.toString(), '', 'no stderr output')
      var res2 = JSON.parse(stdout.toString())
      t.equal(res2[0], res.key, 'valid key')
      t.end()
    })
  })
})

