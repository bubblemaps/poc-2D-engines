import {
  GraphLink,
  GraphNode,
  MasterJSON,
  Transaction,
  Wallet
} from "../types";

export default async function createMaster(
  wallets: Wallet[],
  transactions: Transaction[]
) {
  // Create nodes (wallets)
  const nodes: GraphNode[] = wallets.map((wallet) => ({
    id: wallet.id,
    name: `Wallet ${wallet.id}`,
    val: wallet.eth_balance
  }));

  // Create links (transactions)
  const links: GraphLink[] = transactions.map((transaction) => ({
    source: transaction.sender,
    target: transaction.receiver
  }));

  // Create the master JSON
  const masterJSON: MasterJSON = {
    nodes: nodes,
    links: links
  };

  console.log(
    "Master JSON generated",
    masterJSON.nodes[0],
    masterJSON.links[0],
    "nodes: ",
    masterJSON.nodes.length,
    "links: ",
    masterJSON.links.length
  );
  return masterJSON;
}
