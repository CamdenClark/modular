import { FC, useMemo, useState } from "react";

import { Button } from "@mui/material";
import { useWallet } from "@solana/wallet-adapter-react";
import { initModular } from "./Modular";

const InitializeModular: FC = () => {
  const wallet: any = useWallet();

  const init = () => initModular(wallet);

  return <Button onClick={init}>Init</Button>;
};

export default InitializeModular;
