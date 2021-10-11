import {
  Box,
  Button,
  Card,
  CardActions,
  CardActionArea,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";
import { Component, FC } from "react";
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
        <Grid item xs={12} md={4}>
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
  return <Box border={1} minHeight={50}></Box>;
};

export const Craft: FC = () => {
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
