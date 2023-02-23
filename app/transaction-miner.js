const Transaction = require('../wallet/transaction');

class TransactionMiner {
  constructor({ blockchain, transactionPool, wallet, pubsub }) {
    this.blockchain = blockchain;
    this.transactionPool = transactionPool;
    this.wallet = wallet;
    this.pubsub = pubsub;
  }

  mineTransactions() {
    const validTransactions = this.transactionPool.validTransactions();

        //generate the miners reward
        validTransactions.push(
            Transaction.rewardTransaction({ minerWallet: this.wallet })
        );

        //add a block consisting of these transactions to a blockchain
        this.blockchain.addBlock({ data: validTransactions });

        // broadcast the updated blockchain
        this.pubsub.broadcastChain();

        //clear the transaction pool
        this.transactionPool.clear();
    }
}

module.exports = TransactionMiner;