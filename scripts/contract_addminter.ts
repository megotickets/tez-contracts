import { connect } from "./libs/connect";
import { runMethod } from '../packages/fa2-interfaces/dist';
import { Nft } from './libs/nft-interface';
const argv = require('minimist')(process.argv.slice(2));
const fs = require('fs');
const configs = JSON.parse(fs.readFileSync('./configs/' + argv._[0] + ".json").toString())

async function main() {
    let tzApi
    tzApi = await connect(configs.lambdaView, configs.provider, configs.privKey)
    if (tzApi !== undefined) {
        console.log('Adding ' + configs['minter_' + argv._[1]] + ' to minters..')
        const nft = (await tzApi.at(configs.contract_address)).with(Nft);
        await runMethod(nft.addMinter(configs['minter_' + argv._[1]]))
        console.log(configs['minter_' + argv._[1]] + ' added to minter!');
    } else {
        console.log('Can\'t access tzApi')
    }
}

if (configs['minter_' + argv._[1]] !== undefined) {
    main()
}else{
    console.log('Can\'t find minter: ' + argv._[1])
}