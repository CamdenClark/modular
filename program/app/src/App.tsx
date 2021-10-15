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
import Register from "./Register";
import Inventory from "./Inventory";
import { Environment, getInventory, Item, Resource } from "./Modular";
import { GetInventory } from "./Program";

const programID = new PublicKey(idl.metadata.address);

const addresses = {
  localhost: "Gys3HBiLvkse2kXm78pyzPFykvNhywdsBjm41DWPDky8",
};

export const App = ({ resources, items, inventory }: any) => {
  return (
    <WalletContext>
      <Router>
        <Header />
        <Switch>
          <Route exact path="/">
            <InitializeModular />
          </Route>
          <Route path="/craft">
            <Craft
              environment={Environment.localhost}
              items={items}
              resources={resources}
            />
          </Route>
          <Route path="/inventory">
            <Inventory
              environment={Environment.localhost}
              items={items}
              resources={resources}
              inventory={inventory}
            />
          </Route>

          <Route path="/mine">
            <Mine
              environment={Environment.localhost}
              items={items}
              resources={resources}
            />
          </Route>
          <Route path="/register">
            <Register environment={Environment.localhost} />
          </Route>
        </Switch>
      </Router>
    </WalletContext>
  );
};

const AppWithData: FC = () => {
  const wallet: any = useWallet();

  const [resources, setResources] = useState([]);
  const [items, setItems] = useState([]);
  const [inventory, setInventory] = useState({});

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
    return modularInitialized;
  }

  useMemo(() => {
    getModular().then((modular) => {
      if (modular) {
        const items = modular.items
          .map((item: any) => ({
            ...item,
            name: String.fromCharCode(
              ...item.name.filter((char: number) => char !== 0)
            ),
          }))
          .filter((item: Resource) => item.name.length !== 0);
        setResources(
          modular.resources
            .map((resource: any) => {
              const name = String.fromCharCode(
                ...resource.name.filter((char: number) => char !== 0)
              );
              return {
                ...resource,
                name,
              };
            })
            .filter((resource: Resource) => resource.name.length !== 0)
        );
        setItems(items);
        getInventory(wallet, items).then(setInventory);
      }
    });
  }, [wallet]);

  return <App resources={resources} items={items} inventory={inventory} />;
};

export default AppWithData;
