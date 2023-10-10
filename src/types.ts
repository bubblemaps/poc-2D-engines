export interface Wallet {
  id: string;
  eth_balance: number;
  creation_date: string;
}

export interface Transaction {
  sender: string;
  receiver: string;
  amount: number;
  date: string;
}

export interface GraphNode {
  id: string;
  name: string;
  val: number;
  neighbours: string[];
  links: GraphLink[];
}

export interface GraphLink {
  source: string | GraphNode;
  target: string | GraphNode;
  value: number;
  date: string;
  transaction: Transaction;
}

export interface MasterJSON {
  nodes: GraphNode[];
  links: GraphLink[];
}
