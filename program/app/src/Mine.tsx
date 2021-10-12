import { Button, Grid, Typography } from "@mui/material";
import { FC } from "react";

import { Connection, PublicKey } from "@solana/web3.js";
import { Program, Provider, web3 } from "@project-serum/anchor";
import { useWallet } from "@solana/wallet-adapter-react";

import idl from "./idl.json";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";

const MineInventory = () => {
  console.log("Mining!");
};

const { SystemProgram, Keypair } = web3;
/* create an account  */
const baseAccount = Keypair.generate();
const programID = new PublicKey(idl.metadata.address);

export const Mine: FC = () => {
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

  async function createCounter() {
    const provider = await getProvider();
    /* create the program interface combining the idl, program ID, and provider */
    const program = new Program(idl as any, programID, provider);
    try {
      console.log(baseAccount.publicKey.toString());
      console.log(SystemProgram.programId.toString());
      /* interact with the program via rpc */
      await program.rpc.mine({
        accounts: {
          mint: new PublicKey("EARCSdhgXyqeLiWFpEzJWqMckJFfsw7koYwXXhMmPgj3"),
          modularProgram: programID,
          miner: provider.wallet.publicKey,
          tokenProgram: TOKEN_PROGRAM_ID,
        },
      });
    } catch (err) {
      console.log("Transaction error: ", err);
    }
  }

  async function increment() {
    const provider = await getProvider();
    const program = new Program(idl as any, programID, provider);
    await program.rpc.increment({
      accounts: {
        baseAccount: baseAccount.publicKey,
      },
    });

    const account = await program.account.baseAccount.fetch(
      baseAccount.publicKey
    );
    console.log("account: ", account);
    console.log(account.value.toString());
  }
  return (
    <Grid container direction="row" justifyContent="center">
      <Grid
        container
        item
        xs={10}
        md={8}
        direction="row"
        justifyContent="flexStart"
        alignItems="center"
        style={{ marginTop: "5rem" }}
      >
        <Typography variant="h1">Mine an inventory to get started!</Typography>

        <Button
          color="primary"
          variant="outlined"
          size="large"
          onClick={createCounter}
          style={{ marginTop: "3rem", padding: "2rem 5rem", fontSize: "2rem" }}
        >
          Mine
        </Button>
      </Grid>
    </Grid>
  );
};

export default Mine;
