import { Button, Grid, Typography, TextField } from "@mui/material";

import { useWallet } from "@solana/wallet-adapter-react";
import { useState } from "react";
import { registerResource, registerItem, Resource } from "./Modular";

const RegisterResource = ({ environment }: any) => {
  const wallet: any = useWallet();

  const [name, setName] = useState("");
  const [rarity, setRarity] = useState(100);
  const [mint, setMint] = useState("");

  return (
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
      <Grid item xs={12}>
        <Typography variant="h6">Register a resource</Typography>
      </Grid>
      <Grid item xs={8}>
        <TextField
          id="name"
          onChange={(e) => setName(e.target.value)}
          label="Name"
          fullWidth
          value={name}
        />
      </Grid>
      <Grid item xs={8}>
        <TextField
          id="mint"
          onChange={(e) => setMint(e.target.value)}
          label="Mint"
          value={mint}
          fullWidth
        />
      </Grid>
      <TextField
        id="rarity"
        onChange={(e) => setRarity(parseInt(e.target.value))}
        label="Rarity"
        value={rarity.toString()}
      />
      <Button
        color="primary"
        variant="outlined"
        size="large"
        onClick={() =>
          registerResource(environment, wallet, name, rarity, mint)
        }
      >
        Register item
      </Button>
    </Grid>
  );
};

const RegisterItem = ({ environment }: any) => {
  const wallet: any = useWallet();

  const [name, setName] = useState("");
  const [mint, setMint] = useState("");
  const [components, setComponents] = useState([
    { address: "", count: 0 },
    { address: "", count: 0 },
    { address: "", count: 0 },
  ]);

  return (
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
      <Grid item xs={12}>
        <Typography variant="h6">Register an item</Typography>
      </Grid>
      <TextField
        id="name"
        onChange={(e) => setName(e.target.value)}
        label="Name"
        value={name}
      />
      <TextField
        id="mint"
        onChange={(e) => setMint(e.target.value)}
        label="Mint"
        value={mint}
      />
      {components.map((component, i) => (
        <>
          <TextField
            id={"component" + i}
            onChange={(e) =>
              setComponents((components) => {
                const newComponents = [...components];

                newComponents[i].address = e.target.value;
                return newComponents;
              })
            }
            label={"Component item mint " + i}
            value={component.address}
          />
          <TextField
            id={"Component count " + i}
            onChange={(e) =>
              setComponents((components) => {
                const newComponents = [...components];
                newComponents[i].count = parseInt(e.target.value);
                return newComponents;
              })
            }
            label="Count"
            value={component.count.toString()}
          />
        </>
      ))}
      <Button
        color="primary"
        variant="outlined"
        size="large"
        onClick={() =>
          registerItem(
            environment,
            wallet,
            name,
            components.map((comp) => comp.count),
            components.map((comp) => comp.address),
            mint
          )
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
  );
};

export const Register = ({ environment }: any) => {
  return (
    <Grid container direction="row" justifyContent="center">
      <RegisterResource environment={environment} />
      <RegisterItem environment={environment} />
    </Grid>
  );
};

export default Register;
