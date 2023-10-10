import createTransactions from "./create-transactions";
import createMaster from "./create-master";
import createWallets from "./create-wallets";

export default async function getData(
  nb_wallets: number,
  nb_transactions: number
) {
  const wallets = await createWallets(nb_wallets);
  const transactions = await createTransactions(nb_transactions, wallets);
  const main = await createMaster(wallets, transactions);
  return main;
}
