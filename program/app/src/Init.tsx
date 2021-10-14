import { FC, useMemo, useState } from "react";

import { Button } from "@mui/material";
import { Connection, PublicKey } from "@solana/web3.js";
import { Program, Provider, web3 } from "@project-serum/anchor";
import { useWallet } from "@solana/wallet-adapter-react";
import idl from "./idl.json";

const programID = new PublicKey(idl.metadata.address);

const InitializeModular: FC = () => {
  const wallet: any = useWallet();

  async function getProvider() {
    /* create the provider and return it to the caller */
    /* network set to local network for now */
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
    const modularInitialized = await program.account.modular.fetch(programID);
    return modularInitialized;
  }

  async function initModular() {
    const modular = web3.Keypair.generate();
    const provider = await getProvider();
    const program = new Program(idl as any, programID, provider);
    await program.rpc.initializeModular({
      accounts: {
        modular: modular.publicKey,
      },
      instructions: [await program.account.modular.createInstruction(modular)],
      signers: [modular],
    });
    console.log("Initialized!");
    console.log(modular.publicKey.toBase58());
  }

  return <Button onClick={initModular}>Init</Button>;
};

export default InitializeModular;
