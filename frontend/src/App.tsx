import { FC } from "react";
import WalletContext from "./WalletContext";
import AppBar from "./AppBar";

export const App: FC = () => {
  return (
    <WalletContext>
      <AppBar />
    </WalletContext>
  );
};

export default AppBar;
