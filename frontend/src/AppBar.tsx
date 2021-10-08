import { FC } from "react";
import {
  WalletDisconnectButton,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";

// default styling for solana wallets
import "@solana/wallet-adapter-react-ui/styles.css";

export const AppBar: FC = () => {
  return (
    <>
      <WalletMultiButton />
      <WalletDisconnectButton />
    </>
  );
};

export default AppBar;
