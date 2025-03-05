import React, { useEffect, useState } from "react";
import { useTokens } from "../../hooks/useTokens";
import { useAccount, useConnect } from "wagmi";
import { sepolia } from "wagmi/chains";
import ConnectWallet from "../common/buttons/connect_wallet";

import tokenABI from "../assets/abi/nyxcipher.json";
import stakingPoolABI from "../assets/abi/stakingpool.json";
import { createPublicClient, http } from "viem";

const tokenAddress = "0x72A009348c3f92E08e9e037069dBf00A6c2dd97c";
const stakingPoolContracts = [
  "0x3783589849b30B7528331ed4C3aB446972a839c9",
  "0xA576c7F4b56b83e564e8Ad358Dd88770D7ac027F",
  "0x0E8d6b47191498aFf39Fd633de66d43B740716e2"
];

const TokenList = () => {
  const { address, isConnected } = useAccount();
  const [balances, setBalances] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isConnected && address) {
      fetchBalances();
    }
  }, [isConnected, address]);

  const fetchBalances = async () => {
    setLoading(true);
    const client = createPublicClient({
      chain: sepolia,
      transport: http(),
    });

    try {
      const tokenBalance = await client.readContract({
        address: tokenAddress,
        abi: tokenABI,
        functionName: "balanceOf",
        args: [address],
      });

      const stakingBalances = await Promise.all(
        stakingPoolContracts.map(async (pool) => {
          try {
            const stakedBalance = await client.readContract({
              address: pool,
              abi: stakingPoolABI,
              functionName: "balanceOf",
              args: [address],
            });
            return { pool, stakedBalance: stakedBalance.toString() };
          } catch (error) {
            console.error(`Error fetching balance from staking pool ${pool}:`, error);
            return { pool, stakedBalance: "Error" };
          }
        })
      );

      setBalances([{ symbol: "NYX", balance: tokenBalance.toString(), owner: address }, ...stakingBalances]);
    } catch (error) {
      console.error("Error fetching balances:", error);
      setBalances([]);
    }
    setLoading(false);
  };

  return (
    <div className="font-[RobotoMono] w-full lg:p-8 p-4 flex flex-col gap-10">
      <div className="md:flex hidden items-center justify-between">
        <h1 className="text-[23px] font-extrabold bg-gradient-to-r from-[#5AB0FF] to-[#01FFC2] text-transparent bg-clip-text mt-2">
          Staking
        </h1>
        <div className="flex items-center">
          <ConnectWallet />
        </div>
      </div>

      <div className="text-white">
        <h2>My Tokens</h2>
        {loading ? (
          <p>Loading balances...</p>
        ) : (
          <ul>
            {balances.map((token, index) => (
              <li key={index}>
                <strong>{token.symbol || "Staked"}</strong>: {token.balance || token.stakedBalance}  
                <br />
                <span>Owner: {token.owner || address}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default TokenList;
