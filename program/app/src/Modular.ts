import { Connection, PublicKey } from "@solana/web3.js";
import { Program, Provider, Wallet, utils, web3 } from "@project-serum/anchor";
import idl from "./idl.json";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  Token,
} from "@solana/spl-token";
import { getTokenAccount, createTokenAccount } from "@project-serum/common";

enum Environment {
  localhost,
  devnet,
}

export type Resource = {
  address: PublicKey;
  name: string;
  rarity: number;
};

export type Recipe = {
  item: PublicKey;
  count: number;
};

export type Item = {
  address: PublicKey;
  name: string;
  recipes: Recipe[];
};

async function findAssociatedTokenAddress(
  walletAddress: PublicKey,
  tokenMintAddress: PublicKey
): Promise<PublicKey> {
  return (
    await PublicKey.findProgramAddress(
      [
        walletAddress.toBuffer(),
        TOKEN_PROGRAM_ID.toBuffer(),
        tokenMintAddress.toBuffer(),
      ],
      ASSOCIATED_TOKEN_PROGRAM_ID
    )
  )[0];
}

const programID = new PublicKey(idl.metadata.address);
const getModularAddress = (environment: Environment) => {
  if (environment === Environment.localhost) {
    return new PublicKey("Gys3HBiLvkse2kXm78pyzPFykvNhywdsBjm41DWPDky8");
  }
  return null;
};

async function getProvider(wallet: Wallet) {
  /* create the provider and return it to the caller */
  /* network set to local network for now */
  const network = "http://127.0.0.1:8899";
  const connection = new Connection(network, "processed");
  const provider = new Provider(connection, wallet, {
    preflightCommitment: "processed",
  });
  return provider;
}

async function getModular(wallet: Wallet) {
  const provider = await getProvider(wallet);
  const program = new Program(idl as any, programID, provider);
  const modularInitialized = await program.account.modular.fetch(programID);
  return modularInitialized;
}

async function initModular(wallet: Wallet) {
  const modular = web3.Keypair.generate();
  const provider = await getProvider(wallet);
  const program = new Program(idl as any, programID, provider);
  await program.rpc.initializeModular({
    accounts: {
      modular: modular.publicKey,
    },
    instructions: [await program.account.modular.createInstruction(modular)],
    signers: [modular],
  });
}

async function registerResource(
  environment: Environment,
  wallet: Wallet,
  name: string,
  rarity: number,
  mintAddress: string
) {
  const mint = new PublicKey(mintAddress);

  const modular = getModularAddress(environment);
  if (!modular) {
    return;
  }
  const provider = await getProvider(wallet);
  const program = new Program(idl as any, programID, provider);
  await program.rpc.registerResource(name, rarity, {
    accounts: {
      modular,
      mint,
      tokenProgram: TOKEN_PROGRAM_ID,
      miner: provider.wallet.publicKey,
    },
  });
}

async function registerItem(
  environment: Environment,
  wallet: Wallet,
  name: string,
  counts: number[],
  components: string[],
  mintAddress: string
) {
  const itemMint = new PublicKey(mintAddress);

  const modular = getModularAddress(environment);
  if (!modular) {
    return;
  }

  const itemOne =
    components[0].length > 0
      ? new PublicKey(components[0])
      : web3.Keypair.generate().publicKey;
  const itemTwo =
    components[1].length > 0
      ? new PublicKey(components[1])
      : web3.Keypair.generate().publicKey;
  const itemThree =
    components[2].length > 0
      ? new PublicKey(components[2])
      : web3.Keypair.generate().publicKey;

  const provider = await getProvider(wallet);
  const program = new Program(idl as any, programID, provider);
  await program.rpc.registerItem(name, counts, {
    accounts: {
      miner: provider.wallet.publicKey,
      itemMint,
      itemOne,
      itemTwo,
      itemThree,
      modular,
      tokenProgram: TOKEN_PROGRAM_ID,
    },
  });
}

async function mine(
  environment: Environment,
  wallet: Wallet,
  resource: Resource
) {
  const modular = getModularAddress(environment);
  if (!modular) {
    return;
  }

  const provider = await getProvider(wallet);
  const program = new Program(idl as any, programID, provider);

  const [pda, _nonce] = await PublicKey.findProgramAddress(
    [Buffer.from(utils.bytes.utf8.encode("modular"))],
    program.programId
  );

  let resourceAccount = await findAssociatedTokenAddress(
    provider.wallet.publicKey,
    resource.address
  );
  try {
    await getTokenAccount(provider, provider.wallet.publicKey);
  } catch (e) {
    resourceAccount = await createTokenAccount(
      provider,
      resource.address,
      provider.wallet.publicKey
    );
  }
  const accounts = {
    miner: provider.wallet.publicKey,
    resourceAccount,
    mint: resource.address,
    pda,
    tokenProgram: TOKEN_PROGRAM_ID,
  };

  await program.rpc.mine({
    accounts,
  });
}

async function craftItem(environment: Environment, wallet: Wallet, item: Item) {
  const modular = getModularAddress(environment);
  if (!modular) {
    return;
  }

  const provider = await getProvider(wallet);
  const program = new Program(idl as any, programID, provider);

  const [pda, _nonce] = await PublicKey.findProgramAddress(
    [Buffer.from(utils.bytes.utf8.encode("modular"))],
    program.programId
  );

  const crafterAccount = await findAssociatedTokenAddress(
    provider.wallet.publicKey,
    item.address
  );
  try {
    await getTokenAccount(provider, crafterAccount);
  } catch {
    await createTokenAccount(provider, item.address, provider.wallet.publicKey);
  }

  let itemOne = new PublicKey("0");
  let sourceOne = new PublicKey("0");
  if (item.recipes[0].count > 0) {
    itemOne = item.recipes[0].item;
    sourceOne = await findAssociatedTokenAddress(
      provider.wallet.publicKey,
      item.recipes[0].item
    );
  }

  let itemTwo = new PublicKey("0");
  let sourceTwo = new PublicKey("0");
  if (item.recipes[1].count > 0) {
    itemOne = item.recipes[1].item;
    sourceOne = await findAssociatedTokenAddress(
      provider.wallet.publicKey,
      item.recipes[1].item
    );
  }

  let itemThree = new PublicKey("0");
  let sourceThree = new PublicKey("0");
  if (item.recipes[2].count > 0) {
    itemOne = item.recipes[2].item;
    sourceOne = await findAssociatedTokenAddress(
      provider.wallet.publicKey,
      item.recipes[2].item
    );
  }

  await program.rpc.craftItem({
    accounts: {
      crafter: provider.wallet.publicKey,
      crafterAccount,
      craftTarget: item.address,
      modular,
      pda,
      itemOne,
      itemTwo,
      itemThree,
      sourceOne,
      sourceTwo,
      sourceThree,
      tokenProgram: TOKEN_PROGRAM_ID,
    },
  });
}

export {
  Environment,
  getModular,
  craftItem,
  mine,
  registerItem,
  registerResource,
  initModular,
};
