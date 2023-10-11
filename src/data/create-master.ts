import {
  GraphLink,
  GraphNode,
  MasterJSON,
  Transaction,
  Wallet
} from "../types";

function getNeighbours(walletId: string, transactions: Transaction[]) {
  const neighbors: string[] = [];
  transactions.forEach((transaction) => {
    if (transaction.sender === walletId) {
      neighbors.push(transaction.receiver);
    } else if (transaction.receiver === walletId) {
      neighbors.push(transaction.sender);
    }
  });
  return neighbors;
}

function getWalletLinks(walledId: string, transactions: Transaction[]) {
  const links: GraphLink[] = [];
  transactions.forEach((transaction) => {
    if (transaction.sender === walledId || transaction.receiver === walledId) {
      links.push({
        id: transaction.id,
        source: transaction.sender,
        target: transaction.receiver,
        value: transaction.amount,
        date: transaction.date,
        transaction: transaction
      });
    }
  });
  return links;
}

export default async function createMaster(
  wallets: Wallet[],
  transactions: Transaction[]
) {
  // Create nodes (wallets)
  const nodes: GraphNode[] = wallets.map((wallet) => ({
    id: wallet.id,
    name: `Wallet ${wallet.id}`,
    val: wallet.eth_balance,
    neighbours: getNeighbours(wallet.id, transactions),
    links: getWalletLinks(wallet.id, transactions)
  }));

  // Create links (transactions)
  const links: GraphLink[] = transactions.map((transaction) => ({
    id: transaction.id,
    source: transaction.sender,
    target: transaction.receiver,
    value: transaction.amount,
    date: transaction.date,
    transaction: transaction
  }));

  // Create the master JSON
  const masterJSON: MasterJSON = {
    nodes: nodes,
    links: links
  };

  return masterJSON;
}
