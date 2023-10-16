import { Wallet, Transaction } from "types";
import { faker } from "@faker-js/faker";
import { v4 as uuidv4 } from "uuid";

// Function to get a random receiver wallet (excluding the sender)
function getRandomReceiver(
  wallets: Wallet[],
  sender: Wallet
): Wallet | undefined {
  const subwallets = wallets.filter(
    (wallet) =>
      wallet.id !== sender.id &&
      wallet.eth_balance > sender.eth_balance &&
      wallet.eth_balance < sender.eth_balance + 3
  );
  const receiver = subwallets[Math.floor(Math.random() * subwallets.length)];
  return receiver;
}

// Function to generate a random date within the last year
function generateRandomDate(): string {
  // Generate creation dates for each wallet (within the last year)
  const currentDate: Date = new Date();
  const oneYearAgo: Date = new Date(currentDate);
  oneYearAgo.setFullYear(currentDate.getFullYear() - 1);

  const randomDate: Date = faker.date.between({
    from: oneYearAgo,
    to: currentDate
  });
  return randomDate.toISOString().split("T")[0]; // Format as YYYY-MM-DD
}

export default async function createTransactions(n = 10, wallets: Wallet[]) {
  // Generate random transactions between wallets
  const transactionHistory: Transaction[] = [];

  wallets.map((senderWallet) => {
    // Determine the number of transactions for this sender (between 1 and n)
    const numTransactions = Math.floor(Math.random() * n);

    for (let i = 0; i < numTransactions; i++) {
      // Randomly select a receiver wallet (excluding the sender itself)
      const receiverWallet = getRandomReceiver(wallets, senderWallet);

      if (!receiverWallet) continue;

      // Generate a random transaction amount (between 0.001 and 10 ETH)
      const amount = parseFloat((Math.random() * 10).toFixed(3)) + 0.001;

      // Create the transaction object
      const transaction: Transaction = {
        id: uuidv4(),
        sender: senderWallet.id,
        receiver: receiverWallet.id,
        amount: amount,
        date: generateRandomDate()
      };

      // Add the transaction to the history
      transactionHistory.push(transaction);
    }
  });

  return transactionHistory;
}
