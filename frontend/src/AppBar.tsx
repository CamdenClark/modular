import { FC } from "react";
import {
  WalletDisconnectButton,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";

import { AppBar, Grid, Toolbar, Typography } from "@mui/material";
// default styling for solana wallets
import "@solana/wallet-adapter-react-ui/styles.css";

export const Header: FC = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item xs={3}>
            <Typography variant="h6" color="inherit" component="div">
              Modular
            </Typography>
          </Grid>
          <Grid container item xs={9} direction="row" justifyContent="flex-end">
            <WalletMultiButton />
            <WalletDisconnectButton />
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
