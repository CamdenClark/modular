import {
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";
import { useWallet } from "@solana/wallet-adapter-react";
import { Connection, PublicKey } from "@solana/web3.js";
import { Program, Provider, web3 } from "@project-serum/anchor";
import { FC } from "react";
import { items } from "./Items";

/*
const Recipe: FC = () => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        gridTemplateRows: "1fr 1fr 1fr",
	
      }}
    >
      {[0, 1, 2]
        .flatMap((x) => [
          [x, 0],
          [x, 1],
          [x, 2],
        ])
        .map(([m, n]) => (
          <div
            style={{
              gridColumnStart: m + 1,
              gridColumnEnd: m + 1,
              gridRowStart: n + 1,
              gridRowEnd: n + 1,
            }}
          >
            Test {m + n}
          </div>
        ))}
    </div>
  );
};
*/

const Craftable: FC<any> = ({ title, description, recipe }: any) => {
  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h4">{title}</Typography>
        {recipe.wood && <Typography>Wood: {recipe.wood}</Typography>}
        {recipe.ruby && <Typography>Ruby: {recipe.ruby}</Typography>}
        {recipe.stone && <Typography>Stone: {recipe.stone}</Typography>}
        {recipe.gold && <Typography>Gold: {recipe.gold}</Typography>}
        {recipe.silver && <Typography>Silver: {recipe.silver}</Typography>}
      </CardContent>
      <CardActions>
        <Button>Craft</Button>
      </CardActions>
    </Card>
  );
};

const Craftables: FC = () => {
  return (
    <Grid container direction="row" spacing={2}>
      {items.map((item) => (
        <Grid item xs={12} md={4} key={item.title}>
          <Craftable
            title={item.title}
            description={"test"}
            recipe={item.recipe}
          />
        </Grid>
      ))}
    </Grid>
  );
};

const RawMaterials: FC = () => {
  return <></>;
};

export const Craft: FC = () => {
  const wallet: any = useWallet();

  async function getProvider() {
    /* create the provider and return it to the caller */
    /* network set to local network for now */
    const network = "http://127.0.0.1:8899";
    const connection = new Connection(network);

    const provider = new Provider(connection, wallet, {});
    return provider;
  }

  return (
    <Grid container direction="row">
      <Grid item xs={12} style={{ marginTop: "2rem" }}>
        <Craftables />
      </Grid>
      <Grid item xs={12}>
        <RawMaterials />
      </Grid>
    </Grid>
  );
};

export default Craft;
