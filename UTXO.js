export default class UTXO {
  constructor(transactionId, outputIndex, publicKey, amount) {
  this.id = ${transactionId}:${outputIndex};
  this.publicKey = publicKey;
  this.amount = amount;
  }
  }