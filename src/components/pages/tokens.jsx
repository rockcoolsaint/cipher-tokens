import Sidebar from "../common/staking/sidebar";
import Dashboard from "../common/staking/dashboard";
import { WagmiProvider, createConfig } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";
// import { publicProvider } from "wagmi/providers/public";
import { http } from "viem";
import TokenList from "../tokens/tokenList";

// const { provider, webSocketProvider } = configureChains(
//   [mainnet, sepolia],
//   [publicProvider()]
// );

const client = createConfig({
  autoConnect: true,
  chains: [mainnet, sepolia],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
});

// const client = createClient({
//   autoConnect: true,
//   provider,
//   webSocketProvider,
// });

function Tokens() {
  return (
    <div id="tokens" className="h-screen md:flex">
      <Sidebar />
      <TokenList />
    </div>
  );
}

export default Tokens;
