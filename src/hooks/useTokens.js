import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { getBalance } from "../services/contractService";

export const useTokens = () => {
  const { address, isConnected } = useAccount();
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isConnected || !address) return;

    const fetchBalance = async () => {
      try {
        const balance = await getBalance(address);
        setBalance(balance);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
  }, [address, isConnected]);

  return { balance, loading, error };
};
