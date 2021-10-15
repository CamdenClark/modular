import { FC } from "react";
import {
  WalletDisconnectButton,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";

import { useWallet } from "@solana/wallet-adapter-react";

import { AppBar, Grid, Link, Toolbar, Typography } from "@mui/material";

import { Link as RouterLink } from "react-router-dom";
// default styling for solana wallets
import "@solana/wallet-adapter-react-ui/styles.css";

export const Header: FC = () => {
  const { wallet } = useWallet();

  return (
    <AppBar position="static">
      <Toolbar>
        <Grid container justifyContent="space-between" alignItems="center">
          <Link component={RouterLink} to="/" color="secondary">
            <Typography variant="h5" color="inherit" component="div">
              Modular
            </Typography>
          </Link>
          <Link component={RouterLink} to="/mine" color="secondary">
            <Typography variant="h6">Mine</Typography>
          </Link>
          <Link component={RouterLink} to="/craft" color="secondary">
            <Typography variant="h6">Craft</Typography>
          </Link>

          <Link component={RouterLink} to="/inventory" color="secondary">
            <Typography variant="h6">Inventory</Typography>
          </Link>

          <Link component={RouterLink} to="/register" color="secondary">
            <Typography variant="h6">Register</Typography>
          </Link>

          <Grid container item xs={6} direction="row" justifyContent="flex-end">
            <WalletMultiButton />
            {wallet && <WalletDisconnectButton />}
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
