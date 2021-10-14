import { Button, Grid, Typography } from "@mui/material";
import { FC } from "react";

import { Connection, PublicKey } from "@solana/web3.js";
import { Program, Provider, web3 } from "@project-serum/anchor";
import { useWallet } from "@solana/wallet-adapter-react";

import idl from "./idl.json";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";

const { SystemProgram, Keypair } = web3;

const programID = new PublicKey(idl.metadata.address);

type Resource = {
  address: PublicKey;
  name: string;
  rarity: number;
};

export const Mine = ({ resources, items }: any) => {
  const wallet: any = useWallet();

  console.log("Mine");
  console.log(resources);
  console.log(
    resources.map((resource: any) =>
      String.fromCharCode(resource.name.filter((char: any) => char !== 0))
    )
  );
  console.log(items);
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

  const mine = (resource: Resource) => async () => {
    const provider = await getProvider();
    /* create the program interface combining the idl, program ID, and provider */
    const program = new Program(idl as any, programID, provider);
    try {
      console.log(SystemProgram.programId.toString());
      /* interact with the program via rpc */
      await program.rpc.mine({
        accounts: {
          mint: resource.address,
          modularProgram: programID,
          miner: provider.wallet.publicKey,
          tokenProgram: TOKEN_PROGRAM_ID,
        },
      });
    } catch (err) {
      console.log("Transaction error: ", err);
    }
  };

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

        {resources.map((resource: Resource) => (
          <Button
            color="primary"
            variant="outlined"
            size="large"
            onClick={mine(resource)}
            style={{
              marginTop: "3rem",
              padding: "2rem 5rem",
              fontSize: "2rem",
            }}
          >
            Mine
          </Button>
        ))}
      </Grid>
    </Grid>
  );
};

export default Mine;
