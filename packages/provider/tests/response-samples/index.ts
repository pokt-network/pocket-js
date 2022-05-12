import accountTxs from './accounttxs.json'
import queryBlockResponse from './queryblockres.json'
import txResponse from './tx.json'

export const responseSamples = {
  balance() {
    return {
      request: JSON.stringify({
        address: 'ce16bb2714f93cfb3c00b5bd4b16dc5d8ca1687a',
      }),
      response: {
        balance: 577231840000,
      },
    }
  },
  accountTxs() {
    return {
      request: JSON.stringify({
        address: 'ce16bb2714f93cfb3c00b5bd4b16dc5d8ca1687a',
      }),
      response: accountTxs,
    }
  },
  queryAppFail() {
    return {
      request: JSON.stringify({
        address: 'ce16bb2714f93cfb3c00b5bd4b16dc5d8ca1687a',
      }),
      response: {
        code: 400,
        message:
          'ERROR:\nCodespace: application\nCode: 101\nMessage: "application does not exist for that address"\n',
      },
    }
  },
  queryNodeFail() {
    return {
      request: JSON.stringify({
        address: 'ce16bb2714f93cfb3c00b5bd4b16dc5d8ca1687a',
      }),
      response: {
        code: 400,
        message:
          'validator not found for ce16bb2714f93cfb3c00b5bd4b16dc5d8ca1687a',
      },
    }
  },
  queryApp() {
    return {
      request: /3808c2de7d2e8eeaa2e13768feb78b10b13c8699/,
      response: {
        address: '3808c2de7d2e8eeaa2e13768feb78b10b13c8699',
        chains: ['0021'],
        jailed: false,
        max_relays: '83500',
        public_key:
          'a3edc0d94701ce5e0692754b519ab125c921c704f11439638834894a5ec5fa53',
        staked_tokens: '50000000000',
        status: 2,
        unstaking_time: '0001-01-01T00:00:00Z',
      },
    }
  },
  queryNode() {
    return {
      request: /3808c2de7d2e8eeaa2e13768feb78b10b13c8699/,
      response: {
        address: '3808c2de7d2e8eeaa2e13768feb78b10b13c8699',
        chains: [
          '03DF',
          '0003',
          '0005',
          '0009',
          '0021',
          '0022',
          '0023',
          '0024',
          '0025',
          '0026',
          '0027',
          '0028',
          '0040',
          '0047',
          '0049',
        ],
        jailed: false,
        public_key:
          'b3ec0904fbaa3b61e41502641af78dfa72f93437a760bf5c529cd97444bd101f',
        service_url: 'https://node830.thunderstake.io:443',
        status: 2,
        tokens: '15050000000',
        unstaking_time: '0001-01-01T00:00:00Z',
      },
    }
  },
  sendTransaction() {
    return {
      request: JSON.stringify({
        address: '3808c2de7d2e8eeaa2e13768feb78b10b13c8699',
        raw_hex_bytes:
          'd9010a490a102f782e6e6f6465732e4d736753656e6412350a14073b1fbbf246d17bb75d270580c53fd356876d7012145f8027e4aa0b971842199998cb585a1d65b200651a0731303030303030120e0a0575706f6b74120531303030301a640a207e3acf8a3b238e193836adbb20ebd95071fabc39f5c483e0dcc508d5c770c28112404d5baec2b57ae446ce7b47704aae0d7332eded723ee95caed6d59bf34aaf873be63e5612ec34c8c0830101705858413f10cf2209237825647565e378a3462f09220d4d736753656e644a7354657374288dcf86fb89b4c303',
      }),
      response: {
        logs: null,
        txhash:
          'E18E06C9FE249394449EB508EFB696D10A48CFABD982B13407FFC6ED34243E73',
      },
    }
  },
  queryBlock() {
    return {
      request: JSON.stringify({
        height: 59133,
      }),
      response: queryBlockResponse,
    }
  },
  queryTransaction() {
    return {
      request: JSON.stringify({
        hash: '2145F7E1C9017DEC6008E9C957B7448AEAB28A1719BF35DF1ADB5D08E4742586',
      }),
      response: txResponse,
    }
  },
  queryHeight() {
    return {
      request: JSON.stringify({}),
      response: { height: 59133 },
    }
  },
}
