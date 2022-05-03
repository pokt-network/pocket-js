import accountTxs from './accounttxs.json'

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
}
