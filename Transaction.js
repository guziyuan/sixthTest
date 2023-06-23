import sha256 from 'crypto-js/sha256.js';

class Transaction {
  constructor() {
    this.hash = null;
  }

  // 更新交易 hash
  _setHash() {
    this.hash = this._calculateHash();
  }

  // 计算交易 hash 的摘要函数
  _calculateHash() {
    return sha256(JSON.stringify(this)).toString();
  }
}

export default Transaction;