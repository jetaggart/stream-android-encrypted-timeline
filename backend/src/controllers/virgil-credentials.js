const { JwtGenerator } = require('virgil-sdk');
const { initCrypto, VirgilCrypto, VirgilAccessTokenSigner } = require('virgil-crypto');

async function getJwtGenerator() {
	await initCrypto();

	const virgilCrypto = new VirgilCrypto();
	
	return new JwtGenerator({
		appId: process.env.VIRGIL_APP_ID,
		apiKeyId: process.env.VIRGIL_KEY_ID,
		apiKey: virgilCrypto.importPrivateKey(process.env.VIRGIL_PRIVATE_KEY),
		accessTokenSigner: new VirgilAccessTokenSigner(virgilCrypto)
	});
}

const generatorPromise = getJwtGenerator();

exports.virgilCredentials = async (req, res) => {
  const generator = await generatorPromise;
  console.log("HELLO", req.user)
  const virgilJwtToken = generator.generateToken(req.user);

  res.json({ token: virgilJwtToken.toString() });
}