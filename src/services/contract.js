import { erc20Abi } from "viem";
import { readContract, writeContract } from "wagmi/actions";

const CONTRACT_ADDRESS = "0x20d84EEF255ebD60811A67914dc935F0f6F1a64D";

export const getBalance = async (walletAddress) => {
  try {
    const balance = await readContract({
      address: CONTRACT_ADDRESS,
      abi: erc20Abi,
      functionName: "balanceOf",
      args: [walletAddress],
    });
    return balance / 10 ** 18; // Convert from Wei
  } catch (error) {
    console.error("Error fetching balance:", error);
    throw error;
  }
};

export const transferTokens = async (toAddress, amount) => {
  try {
    await writeContract({
      address: CONTRACT_ADDRESS,
      abi: erc20Abi,
      functionName: "transfer",
      args: [toAddress, BigInt(amount * 10 ** 18)],
    });
    return true;
  } catch (error) {
    console.error("Error transferring tokens:", error);
    return false;
  }
};
