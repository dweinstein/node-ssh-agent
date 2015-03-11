# SYNOPSIS

This agent is a **replacement** for the old ssh-agent. This package includes
both a "server" and "client" scripts for use on the command line.

# DETAILS

This ssh-agent is currently not compatible with the original
[ssh-agent](https://www.openssh.org) as it communicates over a unix socket but
does not use the same binary protocol and instead uses [line delimited
json](http://en.wikipedia.org/wiki/JSON_Streaming).

This code is still being developed can significantly. In particular the
protocol could change.

# TODO

- [ ] Need to make the path of the socket unpredictable and securely created with mktemp.
- [ ] Add some tests once things start to settle on the protocol bits.
- [ ] some more security testing on the creation of the socket file.

# USAGE
Use the supplied scripts, e.g., `node-ssh-add`, `node-ssh-list` `node-ssh-sign`.

```
  % node-ssh-agent  & # start the agent
listening on path /tmp/sshagent.sock

  % node-ssh-list
[]

  % node-ssh-add
Enter pass phrase for /Users/user/.ssh/id_rsa:
{ type: 'addKeyResponse',
  key: 'xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx',
  fingerprint: 'xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx',
  message: 'key added' }

  % node-ssh-list
[ 'xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx' ]

  % node-ssh-sign  # use -k to pass the key id to use
supply key id to use

  % echo -ne "this is a test" | node-ssh-sign -k xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx
SsZCyNzGSUU1opoDTIg+7Wg5X/nu3b8knn/coJSXRLzvrdo/RhPM/qVRNqBXV8nFvIyHGdP4cGjqcNU8sps/9wl7Ej+It1rILzxNPqo/rHI0ZfbsNArOIqGG3fE54yap48zgUZkwgg3GqCckyFp55dOiB4s+aEQ5rzDnowe2w/0Kd6eGGC+1duHDQLbNF0drPoxYYmq0cHNFSORaEmigczKZzUkjA2dQ3z4HRzDo4qdjBcHRVblI9CfRqv+V+K2Jma66C972DJdrMPqjrb8iOaJzxrHZPQv+L7NOWkNqJM6bMY5ChQxn39vNaQ26RgD0DLuA9ebIFF4Hc8fF7O2JrA==

```

## CONFIGURATION

This module uses [`rc`](https://www.npmjs.com/package/rc) for configuration. Therefore it will
read settings from a file called `~/.sshagentrc`.

Currently the only configuration options of interest would be the unix socket
`path` and maybe the default signing algorithm `algorithm`.

