import { FC, useMemo, useState } from "react";
import WalletContext from "./WalletContext";
import Header from "./Header";
import Craft from "./Craft";
import Mine from "./Mine";

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import { Connection, PublicKey } from "@solana/web3.js";
import { Program, Provider, web3 } from "@project-serum/anchor";
import { useWallet } from "@solana/wallet-adapter-react";
import idl from "./idl.json";
import InitializeModular from "./Init";

const programID = new PublicKey(idl.metadata.address);

const addresses = {
  localhost: "Gys3HBiLvkse2kXm78pyzPFykvNhywdsBjm41DWPDky8",
};

export const App = ({ resources, items }: any) => {
  return (
    <WalletContext>
      <Router>
        <Header />
        <Switch>
          <Route exact path="/">
            <InitializeModular />
          </Route>
          <Route path="/craft">
            <Craft />
          </Route>
          <Route path="/mine">
            <Mine items={items} resources={resources} />
          </Route>
          <Route path="/register"></Route>
        </Switch>
      </Router>
    </WalletContext>
  );
};

const AppWithData: FC = () => {
  const wallet: any = useWallet();

  const [resources, setResources] = useState([]);
  const [items, setItems] = useState([]);

  async function getProvider() {
    const network = "http://127.0.0.1:8899";
    const connection = new Connection(network, "processed");
    const provider = new Provider(connection, wallet, {
      preflightCommitment: "processed",
    });
    return provider;
  }
  async function getModular() {
    const provider = await getProvider();
    const program = new Program(idl as any, programID, provider);
    const modularInitialized = await program.account.modular.fetch(
      new web3.PublicKey(addresses.localhost)
    );
    console.log(modularInitialized);
    return modularInitialized;
  }

  useMemo(() => {
    getModular().then((modular) => {
      if (modular) {
        setResources(modular.resources);
        setItems(modular.items);
      }
    });
  }, [wallet]);

  return <App resources={resources} items={items} />;
};

export default AppWithData;
