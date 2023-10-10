import { v4 as uuidv4 } from "uuid";
import { faker } from "@faker-js/faker";

interface Wallet {
  id: string;
  eth_balance: number;
  creation_date: string;
}

export default async function createWallets(n: number) {
  // Generate n unique wallet IDs
  const walletIds: string[] = Array.from({ length: n }, () => uuidv4());

  // Generate random ETH balances for each wallet
  const ethBalances: number[] = Array.from({ length: n }, () =>
    parseFloat((Math.random() * 100).toFixed(6))
  );

  // Generate creation dates for each wallet (within the last year)
  const currentDate: Date = new Date();
  const oneYearAgo: Date = new Date(currentDate);
  oneYearAgo.setFullYear(currentDate.getFullYear() - 1);

  const creationDates: string[] = Array.from({ length: n }, () => {
    const randomDate: Date = faker.date.between({
      from: oneYearAgo,
      to: currentDate
    });
    return randomDate.toISOString().split("T")[0]; // Format as YYYY-MM-DD
  });

  // Create a list of wallet objects
  const wallets: Wallet[] = Array.from({ length: n }, (_, i) => ({
    id: walletIds[i],
    eth_balance: ethBalances[i],
    creation_date: creationDates[i]
  }));

  console.log("Wallets generated", wallets[0], "size: ", wallets.length);
  return wallets;
}
