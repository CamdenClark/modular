import { Button, Grid, Typography } from "@mui/material";

import { useWallet } from "@solana/wallet-adapter-react";
import { mine, Resource } from "./Modular";

export const Mine = ({ environment, resources, items }: any) => {
  const wallet: any = useWallet();

  console.log("Mine");
  console.log(resources);
  console.log(
    resources.map((resource: any) =>
      String.fromCharCode(resource.name.filter((char: any) => char !== 0))
    )
  );
  console.log(items);

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
            onClick={() => mine(environment, wallet, resource)}
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
