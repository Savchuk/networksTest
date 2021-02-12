/**
 * Testing the 1-inch contract on different networks
 *
 * npm i web3
 *
 * The command for testing the work of the contract on the Infure:
 * $ node index infura
 *
 * The command for testing the work of the contract on the QuickNode ():
 * $ node index quicknode
 */

const Web3 = require('web3');

class BlockStreamCommand {

  constructor() {

    Object.assign(this,{
      contract : {},
      nameWss: ''
    });

    const web3 = new Web3(Web3.givenProvider || new Web3.providers.WebsocketProvider( this.wss ));

    this.contract = new web3.eth.Contract(this.abi, this.address);

    let subscription = web3.eth.subscribe('newBlockHeaders', (error, result) => {
      if (error) {
        console.log('Error subscribing to event', error);
        process.exit();
      }
    }).on('data', blockHeader => {
      if (!blockHeader || !blockHeader.number)
        return;

      const block = { number: blockHeader.number, time: blockHeader.timestamp };

      this.init(block);

    });

  }

  async init(block) {

    let addressIn = '';
    let addressOut = '';
    let srcAmount = '';

    for (let [key1, value1] of this.pairs.entries()) {

      for (let [key2, value2] of value1.entries()) {
        if (key2 == 'addressIn') { addressIn = value2 }
        if (key2 == 'addressOut') { addressOut = value2 }
        if (key2 == 'srcAmount') { srcAmount = value2 }
      }

      const timeInMs1 = Date.now();

      this.contract.methods.getExpectedReturn(addressIn, addressOut, srcAmount, 100, 0x4).call().then(data => {

        const timeInMs2 = Date.now();
        const timeDelay = timeInMs2 - timeInMs1;

        console.log(`Block: ${block.number}. Time delay of 1inch contract by ${this.nameWss}: ${timeDelay} ms`);

      });
    }
  }

  get wss () {

    // Infura Free
    const wss1 = 'wss://mainnet.infura.io/ws/v3/6cc87fbac03649bd88023d25e8ec5eb3';

    // QuickNode SILENT-POLISHED-VOICE
    const wss2 = 'wss://silent-polished-voice.quiknode.pro/b318971263cb4e125eb9865536eeb41c6339f060/';

    const args = process.argv.slice(2);
    const arg = args[0];

    let wss = '';

    switch(arg) {
      case 'infura':
        wss = wss1;
        this.nameWss = arg;
        break;
      case 'quicknode':
        wss = wss2;
        this.nameWss = arg;
        break;
      default:
        wss = wss1;
        this.nameWss = 'infura';
        break;
    }

    return wss;
  }


  get address(){
    return '0xC586BeF4a0992C495Cf22e1aeEE4E446CECDee0E';
  }

  get abi () {
    return [{"inputs":[{"internalType":"contract IOneSplitMulti","name":"impl","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"newImpl","type":"address"}],"name":"ImplementationUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"contract IERC20","name":"fromToken","type":"address"},{"indexed":true,"internalType":"contract IERC20","name":"destToken","type":"address"},{"indexed":false,"internalType":"uint256","name":"fromTokenAmount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"destTokenAmount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"minReturn","type":"uint256"},{"indexed":false,"internalType":"uint256[]","name":"distribution","type":"uint256[]"},{"indexed":false,"internalType":"uint256[]","name":"flags","type":"uint256[]"},{"indexed":false,"internalType":"address","name":"referral","type":"address"},{"indexed":false,"internalType":"uint256","name":"feePercent","type":"uint256"}],"name":"Swapped","type":"event"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"constant":true,"inputs":[],"name":"chi","outputs":[{"internalType":"contract IFreeFromUpTo","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"contract IERC20","name":"asset","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"claimAsset","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"contract IERC20","name":"fromToken","type":"address"},{"internalType":"contract IERC20","name":"destToken","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"parts","type":"uint256"},{"internalType":"uint256","name":"flags","type":"uint256"}],"name":"getExpectedReturn","outputs":[{"internalType":"uint256","name":"returnAmount","type":"uint256"},{"internalType":"uint256[]","name":"distribution","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"contract IERC20","name":"fromToken","type":"address"},{"internalType":"contract IERC20","name":"destToken","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"parts","type":"uint256"},{"internalType":"uint256","name":"flags","type":"uint256"},{"internalType":"uint256","name":"destTokenEthPriceTimesGasPrice","type":"uint256"}],"name":"getExpectedReturnWithGas","outputs":[{"internalType":"uint256","name":"returnAmount","type":"uint256"},{"internalType":"uint256","name":"estimateGasAmount","type":"uint256"},{"internalType":"uint256[]","name":"distribution","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"contract IERC20[]","name":"tokens","type":"address[]"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256[]","name":"parts","type":"uint256[]"},{"internalType":"uint256[]","name":"flags","type":"uint256[]"},{"internalType":"uint256[]","name":"destTokenEthPriceTimesGasPrices","type":"uint256[]"}],"name":"getExpectedReturnWithGasMulti","outputs":[{"internalType":"uint256[]","name":"returnAmounts","type":"uint256[]"},{"internalType":"uint256","name":"estimateGasAmount","type":"uint256"},{"internalType":"uint256[]","name":"distribution","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"isOwner","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"oneSplitImpl","outputs":[{"internalType":"contract IOneSplitMulti","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"renounceOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"contract IOneSplitMulti","name":"impl","type":"address"}],"name":"setNewImpl","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"contract IERC20","name":"fromToken","type":"address"},{"internalType":"contract IERC20","name":"destToken","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"minReturn","type":"uint256"},{"internalType":"uint256[]","name":"distribution","type":"uint256[]"},{"internalType":"uint256","name":"flags","type":"uint256"}],"name":"swap","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"internalType":"contract IERC20[]","name":"tokens","type":"address[]"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"minReturn","type":"uint256"},{"internalType":"uint256[]","name":"distribution","type":"uint256[]"},{"internalType":"uint256[]","name":"flags","type":"uint256[]"}],"name":"swapMulti","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"internalType":"contract IERC20","name":"fromToken","type":"address"},{"internalType":"contract IERC20","name":"destToken","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"minReturn","type":"uint256"},{"internalType":"uint256[]","name":"distribution","type":"uint256[]"},{"internalType":"uint256","name":"flags","type":"uint256"},{"internalType":"address","name":"referral","type":"address"},{"internalType":"uint256","name":"feePercent","type":"uint256"}],"name":"swapWithReferral","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"internalType":"contract IERC20[]","name":"tokens","type":"address[]"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"minReturn","type":"uint256"},{"internalType":"uint256[]","name":"distribution","type":"uint256[]"},{"internalType":"uint256[]","name":"flags","type":"uint256[]"},{"internalType":"address","name":"referral","type":"address"},{"internalType":"uint256","name":"feePercent","type":"uint256"}],"name":"swapWithReferralMulti","outputs":[{"internalType":"uint256","name":"returnAmount","type":"uint256"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}];
  }

  get pairs() {

    let pair = '';
    let pairs = new Map();
    let arr2 = new Map();

    let symbolIn = 'DAI';
    let addressIn = '0x6b175474e89094c44da98b954eedeac495271d0f';
    let decimalsIn = 18;

    let symbolOut = 'USDC';
    let addressOut = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48';
    let decimalsOut = 6;

    let srcAmount = '10000000000000000000000';

    pair = symbolIn + symbolOut;
    arr2.set('pair',pair);

    arr2.set('symbolIn', symbolIn);
    arr2.set('addressIn',addressIn);
    arr2.set('decimalsIn', decimalsIn);

    arr2.set('symbolOut', symbolOut);
    arr2.set('addressOut', addressOut);
    arr2.set('decimalsOut', decimalsOut);

    arr2.set('srcAmount', srcAmount);

    pairs.set(pair,arr2);

    return pairs;
  }
}

const test = new BlockStreamCommand();










