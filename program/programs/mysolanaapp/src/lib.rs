use anchor_lang::prelude::*;
use anchor_spl::token::{self, Burn, InitializeMint, MintTo, SetAuthority, Transfer};

declare_id!("Amnw44Y1sGRsjYG6ZSvT7uEzX3yc1vBEeb7tC8RrGhZR");

#[program]
mod mysolanaapp {
    use super::*;

    const MODULAR_PDA_SEED: &[u8] = b"modular";

    pub fn register_mint(ctx: Context<RegisterMint>) -> ProgramResult {
        let (pda, _bump_seed) = Pubkey::find_program_address(&[MODULAR_PDA_SEED], ctx.program_id);
        token::set_authority(
            ctx.accounts.into(),
            spl_token::instruction::AuthorityType::MintTokens,
            Some(pda),
        )
    }

    pub fn mine(ctx: Context<Mine>) -> ProgramResult {
        let (pda, _bump_seed) = Pubkey::find_program_address(&[MODULAR_PDA_SEED], ctx.program_id);
        token::mint_to(ctx.accounts.into(), 1)
    }

    pub fn increment(ctx: Context<Increment>) -> ProgramResult {
        let base_account = &mut ctx.accounts.base_account;
        base_account.count += 1;
        Ok(())
    }
}

// Transaction instructions
#[derive(Accounts)]
pub struct RegisterMint<'info> {
    #[account(signer)]
    pub miner: AccountInfo<'info>,
    pub token_program: AccountInfo<'info>,
    #[account(mut)]
    pub mint: AccountInfo<'info>,
}

#[derive(Accounts)]
pub struct Mine<'info> {
    #[account(signer)]
    pub miner: AccountInfo<'info>,
    pub modular_program: AccountInfo<'info>,
    pub token_program: AccountInfo<'info>,
    pub mint: AccountInfo<'info>,
}

// Transaction instructions
#[derive(Accounts)]
pub struct Increment<'info> {
    #[account(mut)]
    pub base_account: Account<'info, BaseAccount>,
}

// An account that goes inside a transaction instruction
#[account]
pub struct BaseAccount {
    pub count: u64,
}

impl<'a, 'b, 'c, 'info> From<&mut Mine<'info>> for CpiContext<'a, 'b, 'c, 'info, MintTo<'info>> {
    fn from(accounts: &mut Mine<'info>) -> CpiContext<'a, 'b, 'c, 'info, MintTo<'info>> {
        let cpi_accounts = MintTo {
            to: accounts.miner.clone(),
            authority: accounts.modular_program.clone(),
            mint: accounts.mint.clone(),
        };
        let cpi_program = accounts.token_program.clone();

        CpiContext::new(cpi_program, cpi_accounts)
    }
}

impl<'a, 'b, 'c, 'info> From<&mut RegisterMint<'info>>
    for CpiContext<'a, 'b, 'c, 'info, SetAuthority<'info>>
{
    fn from(
        accounts: &mut RegisterMint<'info>,
    ) -> CpiContext<'a, 'b, 'c, 'info, SetAuthority<'info>> {
        let cpi_accounts = SetAuthority {
            account_or_mint: accounts.mint.clone(),
            current_authority: accounts.miner.clone(),
        };
        let cpi_program = accounts.token_program.clone();

        CpiContext::new(cpi_program, cpi_accounts)
    }
}
