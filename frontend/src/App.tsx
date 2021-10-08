import { FC } from "react";
import WalletContext from "./WalletContext";
import Header from "./Header";

export const App: FC = () => {
  return (
    <WalletContext>
      <Header />
    </WalletContext>
  );
};

export default App;
