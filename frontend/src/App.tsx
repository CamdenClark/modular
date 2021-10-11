import { FC } from "react";
import WalletContext from "./WalletContext";
import Header from "./Header";
import Craft from "./Craft";
import Mine from "./Mine";

export const App: FC = () => {
  return (
    <WalletContext>
      <Header />
      <Craft />
      <Mine />
    </WalletContext>
  );
};

export default App;
