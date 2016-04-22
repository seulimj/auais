'use strict';
module.exports = process.env.NODE_ENV !== 'production' ? {
  //disableAuth: true,


  app: {
    port: 6000
  },

  routers: {
    directory: 'routers',
    open: true,
    security: false
  },
  mongo: {
    url: 'mongodb://localhost:27017/yibit',
    options: {}
  },
  redis: {
    options: {host: '192.168.100.242'}
  },



  priKey: `-----BEGIN RSA PRIVATE KEY-----
MIICXAIBAAKBgQCAzuLPBPLzE0owmaUufPOkQJXU0+k9d2YSGYrm3v3DXWxeW/Wl
T0gorZlUE0TSRk8ohI75dj/DUYscxNdRfMld2xJlch/NdsS3Jn39m+PDz9IITaJb
0MccRtltXqSXQX874uyep0qtV781pGlrf60LXsC8qdqLcJuPzKRwsJ7oXQIDAQAB
AoGAevB7i+mGVLipi99pyAgcpz25hAvKRw9pzYaxi490Fv5ZC2qr917HWYPvn05Q
1n2i2eJDcBgL3ck7hHbfp/f5XIC1nFOohBp+jniqjA+ca8NxuOLNcHVxRWpUgPb2
qjjQ8dAq6TZbYsqHFdXTO+upWmelJvtETWYIOmYq68TT9WECQQCHds65W2X6WRX3
cHJR8Ul+vZqdynEFjX7k/0O7CH6xtvJ49UxL5BxfDc0gaVfNmOcEikpUQe4OYJwe
EyjAzWO1AkEA82vt+NnJB8sUK5cnGZHo8itErBS4gwxKBT1eFraXUD9KYzTGidNJ
hreNz/nl5zy0PwoK87kdr+9gA1RL6WsrCQJAY4zaCrmyTbJeREMsoC9z1WI9WCxH
ts7vLBazjaWGhc9ujZmnAjaW6vvXfTQtRHhTfbCrQxRYf9RbpnZqApZt6QJBALms
GK+ZRzrXj0IUoHFjl2Co2k+72mWzSP6oKY1/pvlB3XbAebQFYu8MMXJy9gckiYQQ
H/x5tghNuVmwwdqAsSkCQBVgl+Iij4J4zOoH87oU5/km6ZuuU0LrxERXXM/cTjJ7
usSyk4dguRjYKglFa9xD7eqtnNsEDDnGT3TKeuI25T0=
-----END RSA PRIVATE KEY-----`


} :

{}
