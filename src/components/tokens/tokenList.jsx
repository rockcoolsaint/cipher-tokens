import React, { useState } from "react";
import { useTokens } from "../../hooks/useTokens";
import { useAccount, useConnect } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import { transferTokens } from "../../services/contractService";

const TokenList = () => {
  const { balance, loading, error } = useTokens();
  const { address, isConnected } = useAccount();
  const { connect } = useConnect({ connector: new InjectedConnector() });

  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");

  const handleTransfer = async () => {
    if (!recipient || !amount) return;
    const success = await transferTokens(recipient, amount);
    if (success) alert("Transfer successful!");
  };

  if (!isConnected) return <button onClick={() => connect()}>Connect MetaMask</button>;
  if (loading) return <p>Loading balance...</p>;
  if (error) return <p>Error fetching balance.</p>;

  return (
    <div>
      <h2>MyToken Balance</h2>
      <p>Wallet: {address}</p>
      <p>Balance: {balance} MTK</p>

      <h3>Transfer Tokens</h3>
      <input
        type="text"
        placeholder="Recipient Address"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
      />
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button onClick={handleTransfer}>Send</button>
    </div>
  );
};

export default TokenList;
