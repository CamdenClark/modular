import { Button, Grid, Typography, TextField } from "@mui/material";

import { useWallet } from "@solana/wallet-adapter-react";
import { useState } from "react";
import { registerResource, registerItem, Resource } from "./Modular";

export const Register = ({ environment }: any) => {
  const wallet: any = useWallet();

  const [name, setName] = useState("");
  const [rarity, setRarity] = useState(100);
  const [mint, setMint] = useState("");

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
        <TextField
          id="name"
          onChange={(e) => setName(e.target.value)}
          label="Name"
          value={name}
        />
        <TextField
          id="mint"
          onChange={(e) => setMint(e.target.value)}
          label="Name"
          value={mint}
        />
        <TextField
          id="rarity"
          onChange={(e) => setRarity(parseInt(e.target.value))}
          label="rarity"
          value={rarity.toString()}
        />
        <Button
          color="primary"
          variant="outlined"
          size="large"
          onClick={() =>
            registerResource(environment, wallet, name, rarity, mint)
          }
          style={{
            marginTop: "3rem",
            padding: "2rem 5rem",
            fontSize: "2rem",
          }}
        >
          Mine
        </Button>
      </Grid>
    </Grid>
  );
};

export default Register;
