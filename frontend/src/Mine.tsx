import { Button, Grid, Typography } from "@mui/material";
import { FC } from "react";

const MineInventory = () => {
  console.log("Mining!");
};

export const Mine: FC = () => {
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
          onClick={MineInventory}
          style={{ marginTop: "3rem", padding: "2rem 5rem", fontSize: "2rem" }}
        >
          Mine
        </Button>
      </Grid>
    </Grid>
  );
};

export default Mine;
