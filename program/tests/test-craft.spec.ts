import * as anchor from "@project-serum/anchor";
import * as spl from "@solana/spl-token";
import * as assert from "assert";
import * as serumCommon from "@project-serum/common";
import { PublicKey } from "@solana/web3.js";

describe("test-craft", () => {
  anchor.setProvider(anchor.Provider.env());

  const provider = anchor.getProvider();
  const program = anchor.workspace.Mysolanaapp;

  it("Setup mint and program", async () => {
    const mint = await createMint(provider, provider.wallet.publicKey);

    await program.rpc.registerMint({
      accounts: {
        miner: provider.wallet.publicKey,
        mint,
        tokenProgram: spl.TOKEN_PROGRAM_ID,
      },
    });

    const [_pda, _nonce] = await PublicKey.findProgramAddress(
      [Buffer.from(anchor.utils.bytes.utf8.encode("modular"))],
      program.programId
    );

    const mintInfo = await serumCommon.getMintInfo(provider, mint);

    assert.ok(mintInfo.mintAuthority.equals(_pda));
  });
});

async function createMint(provider, authority) {
  if (authority === undefined) {
    authority = provider.wallet.publicKey;
  }
  const mint = anchor.web3.Keypair.generate();
  const instructions = await createMintInstructions(
    provider,
    authority,
    mint.publicKey
  );

  const tx = new anchor.web3.Transaction();
  tx.add(...instructions);

  await provider.send(tx, [mint]);

  return mint.publicKey;
}

async function createMintInstructions(provider, authority, mint) {
  let instructions = [
    anchor.web3.SystemProgram.createAccount({
      fromPubkey: provider.wallet.publicKey,
      newAccountPubkey: mint,
      space: 82,
      lamports: await provider.connection.getMinimumBalanceForRentExemption(82),
      programId: spl.TOKEN_PROGRAM_ID,
    }),
    spl.Token.createInitMintInstruction(
      spl.TOKEN_PROGRAM_ID,
      mint,
      0,
      authority,
      null
    ),
  ];
  return instructions;
}

async function createTokenAccount(provider, mint, owner) {
  const vault = anchor.web3.Keypair.generate();
  const tx = new anchor.web3.Transaction();
  tx.add(
    ...(await createTokenAccountInstrs(
      provider,
      vault.publicKey,
      mint,
      owner,
      undefined
    ))
  );
  await provider.send(tx, [vault]);
  return vault.publicKey;
}

async function createTokenAccountInstrs(
  provider,
  newAccountPubkey,
  mint,
  owner,
  lamports
) {
  if (lamports === undefined) {
    lamports = await provider.connection.getMinimumBalanceForRentExemption(165);
  }
  return [
    anchor.web3.SystemProgram.createAccount({
      fromPubkey: provider.wallet.publicKey,
      newAccountPubkey,
      space: 165,
      lamports,
      programId: spl.TOKEN_PROGRAM_ID,
    }),
    spl.Token.createInitAccountInstruction(
      spl.TOKEN_PROGRAM_ID,
      mint,
      newAccountPubkey,
      owner
    ),
  ];
}
