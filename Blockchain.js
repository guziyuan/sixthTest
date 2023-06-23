import UTXOPool from './UTXOPool.js';

class Blockchain {
  // 1. 完成构造函数及其参数
  /* 构造函数需要包含
      - 名字
      - 创世区块
      - 存储区块的映射
  */
  constructor(name, genesisBlock) {
    this.name = name;
    this.blockchain = new Map();
    this.blockchain.set(genesisBlock.hash, genesisBlock);
  }

  // 2. 定义 longestChain 函数
  /*
    返回当前链中最长的区块信息列表
  */
  longestChain() {
    let maxLength = 0;
    let longestChain = [];
    for (let [hash, block] of this.blockchain) {
      let length = 1;
      let currentBlock = block;
      while (currentBlock.previousHash !== null && this.blockchain.has(currentBlock.previousHash)) {
        length++;
        currentBlock = this.blockchain.get(currentBlock.previousHash);
      }
      if (length > maxLength) {
        maxLength = length;
        longestChain = [];
        let temp = block;
        while (temp !== null) {
          longestChain.unshift(temp);
          temp = this.blockchain.get(temp.previousHash);
        }
      }
    }
    return longestChain;
  }

  // 判断当前区块链是否包含
  containsBlock(block) {
    return this.blockchain.has(block.hash);
  }

  // 获得区块高度最高的区块
  maxHeightBlock() {
    let maxHeight = -1;
    let maxHeightBlock;
    for (let [hash, block] of this.blockchain) {
      if (block.height > maxHeight) {
        maxHeight = block.height;
        maxHeightBlock = block;
      }
    }
    return maxHeightBlock;
  }

  // 添加区块
  /*

  */
  _addBlock(block) {
    if (!block.isValid()) return;
    if (this.containsBlock(block)) return;
    let prevBlock = this.blockchain.get(block.previousHash);
    if (prevBlock === undefined) return;
    if (prevBlock.height + 1 !== block.height) return;
    let utxoPool = new UTXOPool(prevBlock.utxoPool);
    let txs = block.transactions;
    let```
javascript
复制
// 维护一个交易ID的集合，用于判断交易是否重复
let txIds = new Set();
for (let tx of txs) {
if (txIds.has(tx.id)) return;
txIds.add(tx.id);
if (!tx.isValid()) return;
for (let i = 0; i < tx.inputs.length; i++) {
let input = tx.inputs[i];
let utxo = new UTXO(input.prevTxHash, input.outputIndex);
if (!utxoPool.contains(utxo)) return;
let output = utxoPool.getTxOutput(utxo);
if (!output.address.equals(input.address)) return;
utxoPool.removeUTXO(utxo);
}
for (let output of tx.outputs) {
let utxo = new UTXO(tx.id, tx.outputs.indexOf(output));
utxoPool.addUTXO(utxo, output);
}
}
block.utxoPool = utxoPool;
this.blockchain.set(block.hash, block);
}

// 添加区块链分支
_addChain(branch) {
if (branch.length === 0) return;
let lastBlock = branch[0];
if (!this.containsBlock(lastBlock)) return;
for (let i = 1; i < branch.length; i++) {
let block = branch[i];
if (!block.isValid()) return;
if (this.containsBlock(block)) continue;
if (block.previousHash !== lastBlock.hash) return;
this._addBlock(block);
lastBlock = block;
}
}

// 替换当前区块链
replaceChain(chain) {
let branch = [];
for (let block of chain) {
if (branch.length === 0) {
if (block.hash !== this.maxHeightBlock().hash) {
branch.push(block);
}
} else {
if (block.previousHash !== branch[branch.length - 1].hash) {
return;
}
branch.push(block);
}
}
this._addChain(branch);
}
}

export default Blockchain;