import * as anchor from "@project-serum/anchor";
import * as spl from "@solana/spl-token";
import * as assert from "assert";
import * as serumCommon from "@project-serum/common";
import { PublicKey } from "@solana/web3.js";
import { encode } from "@project-serum/anchor/dist/utils/bytes/hex";
import { publicKey } from "@project-serum/anchor/dist/utils";

describe("test-craft", () => {
  anchor.setProvider(anchor.Provider.env());

  const provider = anchor.getProvider();
  const program = anchor.workspace.Modular;
  const modular = anchor.web3.Keypair.generate();

  let resourceMint: any = null;
  let itemMint: any = null;

  it("Setup modular", async () => {
    const test = await program.account.modular.createInstruction(modular);
    await program.rpc.initializeModular({
      accounts: {
        modular: modular.publicKey,
      },
      instructions: [await program.account.modular.createInstruction(modular)],
      signers: [modular],
    });

    const modularInitialized = await program.account.modular.fetch(
      modular.publicKey
    );
    assert.ok(modularInitialized.resources);
    assert.ok(modularInitialized.items);
  });
  it("Register a resource", async () => {
    resourceMint = await createMint(provider, provider.wallet.publicKey);
    await program.rpc.registerResource("Wood", 4, {
      accounts: {
        miner: provider.wallet.publicKey,
        mint: resourceMint,
        modular: modular.publicKey,
        tokenProgram: spl.TOKEN_PROGRAM_ID,
      },
    });

    const [pda, _nonce] = await PublicKey.findProgramAddress(
      [Buffer.from(anchor.utils.bytes.utf8.encode("modular"))],
      program.programId
    );

    const mintInfo = await serumCommon.getMintInfo(provider, resourceMint);

    assert.ok(mintInfo.mintAuthority.equals(pda));

    const modularInitialized = await program.account.modular.fetch(
      modular.publicKey
    );
    assert.equal(
      String.fromCharCode(
        ...modularInitialized.resources[0].name.filter((char) => char !== 0)
      ),
      "Wood"
    );
    assert.ok(modularInitialized.resources[0].rarity === 4);
  });
  it("Register an item", async () => {
    itemMint = await createMint(provider, provider.wallet.publicKey);

    await program.rpc.registerItem("Wood Sword", [2, 0, 0], {
      accounts: {
        miner: provider.wallet.publicKey,
        itemMint,
        itemOne: resourceMint,
        itemTwo: anchor.web3.Keypair.generate().publicKey,
        itemThree: anchor.web3.Keypair.generate().publicKey,
        modular: modular.publicKey,
        tokenProgram: spl.TOKEN_PROGRAM_ID,
      },
    });

    const [pda, _nonce] = await PublicKey.findProgramAddress(
      [Buffer.from(anchor.utils.bytes.utf8.encode("modular"))],
      program.programId
    );

    const mintInfo = await serumCommon.getMintInfo(provider, itemMint);

    assert.ok(mintInfo.mintAuthority.equals(pda));

    const modularInitialized = await program.account.modular.fetch(
      modular.publicKey
    );
    assert.equal(
      String.fromCharCode(
        ...modularInitialized.items[0].name.filter((char) => char !== 0)
      ),
      "Wood Sword"
    );
    assert.equal(2, modularInitialized.items[0].recipes[0].count);
    assert.ok(modularInitialized.items[0].recipes[0].item.equals(resourceMint));
  });

  it("Setup mint and program", async () => {
    const [pda, _nonce] = await PublicKey.findProgramAddress(
      [Buffer.from(anchor.utils.bytes.utf8.encode("modular"))],
      program.programId
    );

    const crafter = await createTokenAccount(
      provider,
      itemMint,
      provider.wallet.publicKey
    );

    const sourceOne = await createTokenAccount(
      provider,
      resourceMint,
      provider.wallet.publicKey
    );

    await program.rpc.mine({
      accounts: {
        miner: provider.wallet.publicKey,
        resourceAccount: sourceOne,
        mint: resourceMint,
        pda,
        tokenProgram: spl.TOKEN_PROGRAM_ID,
      },
    });

    const crafterBefore = await serumCommon.getTokenAccount(
      provider,
      sourceOne
    );

    assert.ok(crafterBefore.amount.eq(new anchor.BN(2)));

    await program.rpc.craftItem({
      accounts: {
        crafter: provider.wallet.publicKey,
        crafterAccount: crafter,
        craftTarget: itemMint,
        itemOne: resourceMint,
        itemTwo: anchor.web3.Keypair.generate().publicKey,
        itemThree: anchor.web3.Keypair.generate().publicKey,
        sourceOne,
        sourceTwo: anchor.web3.Keypair.generate().publicKey,
        sourceThree: anchor.web3.Keypair.generate().publicKey,
        tokenProgram: spl.TOKEN_PROGRAM_ID,
        modular: modular.publicKey,
        pda,
      },
    });

    const crafterAfter = await serumCommon.getTokenAccount(provider, crafter);

    assert.ok(crafterAfter.amount.eq(new anchor.BN(1)));
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
