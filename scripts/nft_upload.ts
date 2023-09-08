import * as fs from "fs"
const argv = require('minimist')(process.argv.slice(2));
const configs = JSON.parse(fs.readFileSync('./configs/' + argv._[0] + ".json").toString())
const keys = JSON.parse(fs.readFileSync('./configs/keys.json').toString())
const pinataSDK = require('@pinata/sdk')

async function main() {
    const pinata = pinataSDK(keys.pinata_apiKey, keys.pinata_apiSecret);
    let data = {
        "decimals": 0,
        "isBooleanAmount": true,
        "name": "MEGOFEST",
        "description": "This NFT will grant access to MEGOFEST event.",
        "tags": [
            "MEGO", "TICKETS"
        ],
        "minter": "tz1NJw77RUGuZyWpaTRpVpFAJLrfMqQ75aU6",
        "artifactUri": "ipfs://QmYbzfej8u6A2W5NoNK76m7UKZXyDatV5cwe2vY2LD6TLp"
    }
    try {
        console.log('Uploading NFT..')
        const metadataCID = await pinata.pinJSONToIPFS(data, { pinataMetadata: { name: '[' + configs.contract.name + '] NFT #' + data.name.split('#')[1] } })
        console.log('Ipfs Hash is:', metadataCID.IpfsHash)
        console.log('--')
    } catch (e) {
        console.log(e)
        console.log('--')
    }
}

main()