import { connect } from "./libs/connect";
import { runMethod, Fa2 } from '../packages/fa2-interfaces/dist';
import { Nft, createTokenMetadata } from './libs/nft-interface';

const argv = require('minimist')(process.argv.slice(2));
const fs = require('fs');
const configs = JSON.parse(fs.readFileSync('./configs/' + argv._[0] + ".json").toString())
const metadata = argv._[2]

const tokenMeta = (tokenId: number) => {
    if (metadata !== undefined) {
        console.log('Passed token metadata:', metadata)
        return [createTokenMetadata(
            tokenId,
            'ipfs://' + metadata
        )];
    } else {
        return false
    }
}

async function main() {
    let tzApi
    tzApi = await connect(configs.lambdaView, configs.provider, configs.privKey)
    if (tzApi !== undefined) {
        console.log('Minting tokens..')
        const nft = (await tzApi.at(configs.contract_address)).with(Nft);
        const tokens = tokenMeta(argv._[1])
        if (tokens !== undefined && tokens !== false) {
            const owner = configs.minter_address
            try {
                const transaction = await runMethod(nft.mintTokens([{ owner, tokens }]))
                console.log('Nft minted!');
                console.log('--')
                console.log('Transaction Hash:', transaction.hash)
                console.log('Transaction Raw:', transaction.raw)
                console.log('Transaction Results:', transaction.results)
                console.log('--')
            } catch (e) {
                console.log(e)
            }
        }
    } else {
        console.log('Can\'t access tzApi')
    }
}

if (argv._[1] !== undefined) {
    main()
} else {
    console.log('Define token id first like `npm run collection:mint sandbox 1`')
}