import UTXO from './UTXO.js'

class UTXOPool {
constructor(utxos = {}) {
this.utxos = utxos;
}

addUTXO(publicKey, amount) {
const utxo = new UTXO(publicKey, amount);
this.utxos[utxo.id] = utxo;
}

clone() {
return new UTXOPool(JSON.parse(JSON.stringify(this.utxos)));
}

// 处理交易函数
handleTransaction(transaction) {
const inputs = transaction.inputs;
const outputs = transaction.outputs;

for (let input of inputs) {
  delete this.utxos[input.id];
}

for (let i = 0; i < outputs.length; i++) {
  const output = outputs[i];
  const utxo = new UTXO(transaction.id, i, output.publicKey, output.amount);
  this.utxos[utxo.id] = utxo;
}
复制
}

// 验证交易合法性
/**

验证余额
返回 bool
*/
isValidTransaction(transaction) {
let inputSum = 0;
let outputSum = 0;
for (let input of transaction.inputs) {
  const utxo = this.utxos[input.id];
  if (!utxo || utxo.publicKey !== input.publicKey) {
    return false;
  }
  inputSum += utxo.amount;
}

for (let output of transaction.outputs) {
  outputSum += output.amount;
}

return inputSum >= outputSum;
复制
}
}

export default UTXOPool
