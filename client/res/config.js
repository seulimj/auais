var baseUrl = 'http://127.0.0.1:9000/';
cfg = {
  clientId: 'community',
  clientSecret: '123456',


  themes: [
    {name: 'Default', displayName: '默认效果', navbarInverse: true},
    {name: 'Cerulean', navbarInverse: true},
    {name: 'Cosmo', navbarInverse: true},
    {name: 'Cyborg', navbarInverse: true},
    //{name: 'Darkly'},
    //{name: 'Flatly', navbarInverse: true},
    //{name: 'Journal', navbarInverse: true},
    {name: 'Lumen', navbarInverse: true},
    //{name: 'Paper', navbarInverse: true},
    //{name: 'Readable', navbarInverse: true},
    //{name: 'Sandstone', navbarInverse: true},
    //{name: 'Simplex', navbarInverse: true},
    {name: 'Slate', displayName: '极致纯黑'},
    {name: 'Spacelab', navbarInverse: true},
    //{name: 'Superhero'},
    {name: 'United', navbarInverse: true},
    //{name: 'Yeti', navbarInverse: true}
  ],

  states: [
    {
      state: 's1',
      name: '第1项',
      subStates: [
        {
          state: 'templet',
          name: '第1项的第1项'
        },
        {
          state: 'templet2',
          name: '第1项的第2项'
        },
        {
          state: 's13',
          name: '第1项的第3项'
        },
        {
          state: 's14',
          name: '第1项的第4项'
        }
      ]
    },
    {
      state: 's2',
      name: '第2项',
      subStates: [
        {
          state: 's21',
          name: '第2项的第1项'
        },
        {
          state: 's22',
          name: '第2项的第2项'
        },
        {
          state: 's23',
          name: '第2项的第3项'
        },
        {
          state: 's24',
          name: '第2项的第4项'
        }
      ]
    },
    {
      state: 's3',
      name: '第3项'
    },
    {
      state: 'mixData',
      name: '通用数据'
    }
  ],


  api: {
    test: {
      path: 'http://127.0.0.1:9000',
      security: true
    },

    login: {
      path: 'http://127.0.0.1:9000/login',
      method: 'post',
      open: true,
      security: true
    }

  },

  pubKey: `-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCAzuLPBPLzE0owmaUufPOkQJXU
0+k9d2YSGYrm3v3DXWxeW/WlT0gorZlUE0TSRk8ohI75dj/DUYscxNdRfMld2xJl
ch/NdsS3Jn39m+PDz9IITaJb0MccRtltXqSXQX874uyep0qtV781pGlrf60LXsC8
qdqLcJuPzKRwsJ7oXQIDAQAB
-----END PUBLIC KEY-----`

};
