import { KeyManager } from '../src/key-manager'

const PRIVATE_KEY =
  '1f8cbde30ef5a9db0a5a9d5eb40536fc9defc318b8581d543808b7504e0902bcb243b27bc9fbe5580457a46370ae5f03a6f6753633e51efdaf2cf534fdc26cc3'
const PUBLIC_KEY =
  'b243b27bc9fbe5580457a46370ae5f03a6f6753633e51efdaf2cf534fdc26cc3'
const ADDRESS = 'b50a6e20d3733fb89631ae32385b3c85c533c560'
const SIGNED_MESSAGE =
  '5d04dfc0d0e579d815f761b452c7d01e5f20a71b9fb66dbbeb1959cffed9da0a621ee06dfd11171757f9c9541768eaf59cce75ac4acc1ad122556ec26e166108'

describe('Signer: Key Manager tests', () => {
  it('Creates a new Key Manager from a private key', async () => {
    const keyManager = await KeyManager.fromPrivateKey(PRIVATE_KEY)

    expect(keyManager.getPrivateKey()).toBe(PRIVATE_KEY)
    expect(keyManager.getPublicKey()).toBe(PUBLIC_KEY)
    expect(keyManager.getAddress()).toBe(ADDRESS)
  })
  it('Signs a payload with a known private key correctly', async () => {
    const keyManager = await KeyManager.fromPrivateKey(PRIVATE_KEY)
    const signedMessage = await keyManager.sign('deadbeef')

    expect(signedMessage).toBe(SIGNED_MESSAGE)
  })
  it('Exports a PPK without failure and re-imports it', async () => {
    const ppk = await KeyManager.exportPPK({
      privateKey: PRIVATE_KEY,
      password: 'vapenayshal',
      hint: 'nayshal',
    })
    const importedKeyManager = await KeyManager.fromPPK({
      ppk,
      password: 'vapenayshal',
    })
    expect(importedKeyManager.getPrivateKey()).toBe(PRIVATE_KEY)
    expect(importedKeyManager.getPublicKey()).toBe(PUBLIC_KEY)
    expect(importedKeyManager.getAddress()).toBe(ADDRESS)
  })
  it('Creates a random private key, exports it as PPK and imports it correctly', async () => {
    const km = await KeyManager.createRandom()
    const ppk = await km.exportPPK({ password: 'vapenayshal' })
    const km2 = await KeyManager.fromPPK({ password: 'vapenayshal', ppk })
    expect(km2.getPrivateKey()).toBe(km.getPrivateKey())
    expect(km2.getPublicKey()).toBe(km.getPublicKey())
    expect(km2.getAddress()).toBe(km.getAddress())
  })
})

export {}
