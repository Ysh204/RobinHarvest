# Robin Harvest — Frontend Architecture Document

Phase 1 deliverable. No application code is written until this document is approved.

- Protocol: Robin Harvest — institutional-grade ERC-4626 yield optimizer
- Chain: Robinhood Chain testnet, Chain ID `46630`
- Stack: Next.js 16 (App Router) · React 19 · TypeScript strict · Tailwind CSS v4 · Framer Motion · Wagmi v2 · Viem · RainbowKit · TanStack Query · Recharts · React Hook Form + Zod · Lucide React

---

## 1. Protocol & Contract Analysis

### 1.1 Deployed contracts (Chain ID 46630)

| Contract | Address | Kind |
| --- | --- | --- |
| Core Vault (rhINDEX) | `0x4d7acCF62C18f8c925E481208F7b3E1100bfEda3` | RobinVault (ERC-4626) |
| Growth Vault (rhINDEX-Growth) | `0x135790F9B78Cf4C637A520FBd2373403AAA0262F` | RobinVault (ERC-4626) |
| LP Vault (rhINDEX-LP) | `0x6dA96f5D5996f45C5fb5b21aA49F3ba379994937` | RobinVault (ERC-4626) |
| INDEX Token | `0x082b19F2443cc903Cabd638f65256dDee3590840` | ERC-20 |
| WETH Token | `0x16837f1777DDF8AbEf9539bC6291976c2ca4ba8c` | ERC-20 |
| INDEX/WETH LP Token | `0x30d21De90C862d46a6C5042282350D908f790B31` | ERC-20 |

### 1.2 RobinVault ABI analysis (71 functions)

The supplied ABI is a full ERC-4626 vault (deposit/mint/withdraw/redeem + all four previews + convertToShares/convertToAssets + maxDeposit/maxMint/maxWithdraw/maxRedeem + asset/totalAssets/totalSupply) layered with ERC-20 share-token functions (balanceOf, transfer, approve, allowance, permit, nonces, DOMAIN_SEPARATOR, eip712Domain) and Robin Harvest protocol extensions. Functions the frontend will consume, grouped by purpose:

**Vault economics (read, per-block refresh)**
- `totalAssets()`, `totalSupply()` → TVL and Price Per Share (`convertToAssets(10^decimals)`)
- `totalIdle()`, `strategyDebt()`, `idleBufferBps()` → capital deployment breakdown (idle vs. deployed)
- `unlockedProfit()`, `profitUnlockingRate()`, `profitMaxUnlockTime()` → live yield-streaming display and APY derivation
- `depositCap()` → capacity gauge and max-deposit enforcement
- `lastReportedLossBps()`, `defaultMaxLossBps()` → risk indicators on Vault Detail

**Vault state / safety (read)**
- `paused()` → disable deposit/withdraw forms with an explanatory banner
- `strategy()`, `proposedStrategy()`, `strategyMigrationExecutableAt()`, `strategyMigrationDelay()` → strategy address + "migration pending" notice
- `accountant()`, `authority()` → informational (addresses linked to explorer)
- `isEligible(address)`, `eligibilityThreshold()` → gate deposit UX for the connected wallet; show eligibility notice when `isEligible` is false
- `minPostWithdrawAssets()` → validate withdrawals that would leave a dust position

**User position (read, per-wallet)**
- `balanceOf(user)` → share balance
- `convertToAssets(shares)` → position value in underlying
- `maxWithdraw(user)`, `maxRedeem(user)`, `maxDeposit(user)`, `maxMint(user)` → form max buttons and input validation
- `convertSharesToAssetsInKind(shares)` → preview for in-kind redemption

**Writes (user-initiated)**
- `deposit(assets, receiver)` / `mint(shares, receiver)`
- `withdraw(assets, receiver, owner)` / `redeem(shares, receiver, owner)`
- `redeemInKind(shares, receiver, owner)` → advanced withdrawal option (labeled, with explanation)
- ERC-20 `approve(vault, amount)` on the underlying asset (allowance flow)

**Explicitly NOT surfaced** (admin/keeper functions — present in ABI but permissioned via `authority()`): `report`, `deploy`, `deployIdle`, `pause`, `unpause`, `shutdown`, all `set*` functions, strategy migration proposals. The UI never renders admin controls.

**ABI caveat (flagged, not fabricated):** the pasted RobinVault ABI contains no `event` or `error` entries. The frontend will:
1. Use standard ERC-4626/ERC-20 event fragments (`Deposit`, `Withdraw`, `Transfer`, `Approval` — mandated by the standards the contract implements) only for log-decoding in transaction history.
2. Decode reverts generically via Viem's `BaseError.shortMessage` since custom error selectors are unavailable. If you can supply the full ABI with events/errors, drop-in replacement improves revert messages — nothing else changes.

**ERC-20 ABI:** standard interface (`balanceOf`, `allowance`, `approve`, `decimals`, `symbol`, `name`, `totalSupply`, `transfer`, `transferFrom`) — used for INDEX, WETH, and the LP token.

### 1.3 Deployment architecture

Three independent RobinVault instances share one implementation ABI. Two vaults share INDEX as underlying; the LP vault uses the INDEX/WETH LP token. Each vault delegates capital to a single external `strategy()` and keeps an idle buffer. An `accountant` contract handles fees; an `authority` (access manager) gates admin ops. Profit is streamed (linear unlock) rather than stepwise — the UI can display continuously accruing PPS.

Frontend consequences:
- One typed ABI + a `VaultConfig[]` registry drive all three vaults — zero duplicated per-vault code.
- All vault reads are batched via multicall each block for efficiency.
- APY is not exposed on-chain. It is derived client-side from `profitUnlockingRate` and `totalAssets` (annualized), with historical APY/TVL charts using clearly-labeled mock series (permitted by spec).

### 1.4 Contract interaction inventory

| Interaction | Contract(s) | Wagmi primitive | Trigger |
| --- | --- | --- | --- |
| Vault stats (TVL, PPS, cap, idle, profit, paused, strategy) | 3 vaults | `useReadContracts` (multicall) | every new block |
| Token metadata (symbol, name, decimals) | 3 assets + 3 vaults | `useReadContracts` | once, cached forever |
| User balances (shares, underlying, allowances) | all 6 | `useReadContracts` | new block + after tx |
| Eligibility (`isEligible`, `eligibilityThreshold`) | vault | `useReadContract` | wallet connect |
| Previews (`previewDeposit/Mint/Withdraw/Redeem`) | vault | `useReadContract` | debounced form input |
| Max limits (`maxDeposit/Mint/Withdraw/Redeem`) | vault | `useReadContracts` | new block per wallet |
| Approve underlying | ERC-20 | simulate → `useWriteContract` → receipt | user action |
| Deposit / Mint | vault | simulate → write → receipt | user action |
| Withdraw / Redeem / RedeemInKind | vault | simulate → write → receipt | user action |
| Block watching | chain | `useBlockNumber({ watch: true })` | continuous |

---

## 2. Folder Structure

Matches the mandated structure, expressed with App Router conventions and kebab-case files (PascalCase exports):

```text
app/
  layout.tsx                 # Root: fonts, Providers, Navbar/Footer shell, metadata
  page.tsx                   # Dashboard
  template.tsx               # Framer Motion page transitions
  error.tsx                  # Root error boundary (retry UI)
  not-found.tsx
  vaults/[address]/page.tsx  # Vault Detail (address-validated, else notFound())
  portfolio/page.tsx
  transactions/page.tsx
  settings/page.tsx
  globals.css                # Tailwind v4 @theme tokens

components/
  ui/                        # button, card, badge, input, select, checkbox, radio,
                             # modal, drawer, tabs, table, pagination, spinner,
                             # skeleton, tooltip, toast, dropdown, avatar, popover
  layout/                    # navbar, sidebar (mobile drawer nav), footer,
                             # page-header, animated-background
  vaults/                    # vault-card, vault-stats, vault-list, animated-number,
                             # balance-badge, deposit-form, withdraw-form,
                             # vault-action-panel, vault-charts, capacity-gauge
  portfolio/                 # portfolio-card, portfolio-charts, allocation-donut,
                             # yield-summary, holdings-table
  transactions/              # transaction-list, transaction-row, transaction-status-badge
  wallet/                    # connect-wallet, wallet-status, wrong-network
  providers.tsx              # Wagmi + RainbowKit + QueryClient + Settings + Toast

hooks/
  use-vault.ts               # single-vault multicall stats
  use-vaults.ts              # all-vaults aggregate (protocol TVL, list)
  use-vault-balances.ts      # per-user shares/underlying/allowance/max*
  use-portfolio.ts           # cross-vault aggregation + yield calc
  use-allowance.ts
  use-approve.ts
  use-deposit.ts             # deposit + mint
  use-withdraw.ts            # withdraw + redeem + redeemInKind
  use-vault-preview.ts       # debounced preview* reads
  use-vault-stats.ts         # derived APY, PPS, capacity
  use-transactions.ts        # persisted tx history + pending watcher
  use-chain-status.ts        # connection, chain match, block number
  use-transaction-flow.ts    # shared simulate→sign→broadcast→confirm state machine
  use-settings.ts            # settings context accessor

config/
  chain.ts                   # Robinhood Chain via defineChain (env-driven RPC/explorer)
  contracts.ts               # typed addresses (`as const`), VaultConfig registry
  wagmi.ts                   # wagmi/RainbowKit config
  site.ts                    # metadata, nav items

lib/
  abis/robin-vault.ts        # supplied ABI `as const` (Viem type inference)
  abis/erc20.ts
  constants/                 # query keys, cache times, slippage presets, storage keys
  query-client.ts
  mock/history.ts            # deterministic mock series for TVL/APY/yield charts

types/                       # vault.ts, portfolio.ts, transaction.ts, settings.ts

utils/                       # format.ts (bigint→display), parse.ts (input→bigint),
                             # cn.ts, address.ts, errors.ts (revert→human message)

styles/                      # (tokens live in globals.css per Tailwind v4)
```

Rule enforced throughout: **components never import Wagmi/Viem directly** — all blockchain access flows through `hooks/`, all addresses/ABIs through `config/` and `lib/abis/`.

---

## 3. Routing

| Route | Page | Rendering |
| --- | --- | --- |
| `/` | Dashboard — protocol TVL, vault list, APYs, user balances, quick actions, market overview | Static shell (RSC) + client data islands |
| `/vaults/[address]` | Vault Detail — stats, charts, deposit/withdraw panel | Dynamic; address validated against registry, unknown → 404 |
| `/portfolio` | Portfolio — value, allocation, yield, projections, holdings | Client (wallet-dependent) |
| `/transactions` | Transaction History | Client (wallet-dependent) |
| `/settings` | Settings | Client |

Vault URLs use the contract address (canonical, shareable); the registry maps address → metadata. `template.tsx` provides route-level Framer Motion enter transitions. Layout (Navbar/Footer/animated background) renders once in the root layout as server components with client leaf nodes (wallet button, network status).

---

## 4. Component Hierarchy

```text
RootLayout (RSC)
└─ Providers (client: Wagmi → QueryClient → RainbowKit → Settings → Toast)
   ├─ AnimatedBackground
   ├─ Navbar ── nav links · ChainStatusBadge · ConnectWallet
   ├─ {page}
   │   Dashboard:      ProtocolStats(AnimatedNumber×3) · VaultList(VaultCard×3, staggered) · MarketOverview
   │   VaultDetail:    VaultHeader · VaultStats · CapacityGauge · VaultCharts(lazy Recharts)
   │                   · VaultActionPanel(Tabs: DepositForm | WithdrawForm) · StrategyInfo
   │   Portfolio:      PortfolioCard · AllocationDonut · YieldSummary · PortfolioCharts(lazy) · HoldingsTable
   │   Transactions:   TransactionList(filter tabs → TransactionRow + explorer link, Pagination)
   │   Settings:       theme · currency · slippage · deadline · RPC selection forms (RHF+Zod)
   ├─ Footer
   ├─ ToastViewport
   └─ WrongNetwork (global modal when connected && chainId !== 46630)
```

Composition rules: pages compose feature components; feature components compose `ui/` primitives; `ui/` primitives are dependency-free (no hooks from `hooks/`). Every data-driven component has a skeleton state and an inline error/retry state. Max ~250 lines per component, ~200 per hook.

---

## 5. Design System

**Tokens** — defined once in `globals.css` under Tailwind v4 `@theme`, consumed as utilities. No raw hex values in components.

- **Colors (5 total):** `--background` deep charcoal `#0A0E0D`; `--card` glass surface (charcoal raised + backdrop-blur); `--foreground` off-white `#F2F4F3` (+ muted step); `--primary` neon green `#00E676` (interactive, data-positive, focus rings); `--accent` emerald `#10B981` (highlights, charts secondary). Plus semantic `--destructive` for errors/negative deltas. Contrast: all text pairs meet WCAG AA (primary-on-charcoal used only for large text/graphics; buttons use dark text on neon green).
- **Typography (2 families):** Outfit (headings, `font-sans` display scale) + Inter (body/data, tabular-nums for numeric columns) via `next/font`.
- **Radius:** cards 24px (`--radius-xl`), controls 12px, pills full.
- **Effects:** `--blur-glass` (16px backdrop), soft ambient shadows (2 elevations), 1px `--border` at low-alpha white.
- **Motion:** shared spring config + duration/easing tokens in a `lib/constants/motion.ts`; variants for page-enter, card-stagger, hover-lift, modal, counter. All animation respects `prefers-reduced-motion`.
- **Z-index scale:** tokens for dropdown < sticky nav < drawer < modal < toast.

`ui/` primitives implement accessible patterns (focus trap in Modal/Drawer, roving tabindex in Tabs, `aria-live` toasts, labeled inputs) and are the only place style tokens are composed.

---

## 6. State Management

Four state domains, deliberately separated:

1. **Server/chain state → TanStack Query (via Wagmi).** All reads. No chain data ever mirrored into React state.
2. **Transaction lifecycle → `useTransactionFlow` state machine** (`idle → simulating → awaiting-signature → broadcasting → pending → confirmed | failed`). One implementation shared by approve/deposit/withdraw hooks; drives button labels, toasts, and optimistic updates.
3. **Settings → React Context + `localStorage`** (theme, display currency, slippage, deadline, RPC selection). Context is justified here: cross-cutting, low-frequency updates. *(Note: localStorage is used only for UI preferences and local tx history — chain state always comes from the RPC.)*
4. **Ephemeral UI state → local `useState`/RHF.** Form inputs, tab selection, modal open state.

No Redux/Zustand — nothing requires it. No prop drilling: context for settings/toast, everything else colocated.

---

## 7. Blockchain Interaction Layer

- **Chain:** `defineChain({ id: 46630, ... })` with RPC + explorer from `NEXT_PUBLIC_RPC_URL` / `NEXT_PUBLIC_EXPLORER_URL`. RainbowKit `getDefaultConfig` with `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`; SSR mode enabled; transport is `fallback([http(primary), http(userSelectedRpc?)])` honoring the Settings RPC override with retry.
- **Typed contracts:** ABIs stored `as const` → Viem infers full argument/return types; `VaultConfig` registry typed with `Address` from Viem. No function signatures beyond the supplied ABI + standard ERC-20.
- **Reads:** `useReadContracts` (multicall batching) for all grouped reads; Wagmi's built-in batching aggregates same-block calls. If the chain lacks a Multicall3 deployment, Viem falls back to parallel `eth_call`s transparently (verified at implementation time).
- **Writes:** every write follows *simulate → write → wait*: `simulateContract` (catches reverts pre-signature + provides gas estimate), `useWriteContract`, `useWaitForTransactionReceipt`. Deposit flow chains allowance check → approve (if needed) → deposit as explicit stepped UX.
- **Optimistic UI:** on broadcast, the relevant balance queries receive an optimistic cache update (shares/underlying delta from the simulation result); on receipt, exact invalidation; on failure, rollback to snapshot + destructive toast with decoded reason.
- **Wallet UX:** RainbowKit modal for connect/disconnect/detection; `WrongNetwork` gate with one-click `useSwitchChain` (and add-chain fallback); wallet-less visitors see full protocol data with connect prompts in place of user data.

---

## 8. Data Flow

```text
Block produced
  → useBlockNumber({ watch: true })
    → invalidates [vault-stats] + [user-balances] query keys
      → multicall refetch (placeholderData: keepPreviousData → no UI flicker)
        → hooks derive display values (PPS, APY, capacity %)
          → components render via AnimatedNumber (tween old→new)

User submits deposit
  → RHF + Zod validate (balance, cap via maxDeposit, eligibility, > 0, decimals)
    → previewDeposit shown live (debounced 300ms)
      → [needs allowance?] approve: simulate → sign → confirm
        → deposit: simulate → sign → broadcast
          → optimistic cache update + pending toast + tx appended to local history
            → receipt: invalidate balances/stats, success toast + explorer link
            → failure: rollback, decoded error toast, tx marked failed
```

Transaction history: client-persisted per `(chainId, address)` in `localStorage` (hashes + metadata), rechecked against receipts on load; each row links to the explorer. (No indexer exists for this chain; this is the honest source of user-local history and will be stated as such in the UI.)

---

## 9. Query Strategy

| Data | Query key | Staleness / refetch |
| --- | --- | --- |
| Token/vault metadata | `['meta', address]` | `staleTime: Infinity` |
| Vault stats | `['vault', address, 'stats']` | invalidated per block, `keepPreviousData` |
| User balances/allowances/max | `['balances', chainId, user]` | per block + post-tx invalidation |
| Previews | `['preview', vault, fn, amount]` | debounced input, `keepPreviousData` |
| Eligibility | `['eligibility', vault, user]` | on connect + post-tx |

Defaults: `retry: 2` with exponential backoff for transient RPC failures; structural sharing dedupes identical multicalls; global `QueryCache.onError` routes to toast only for user-initiated fetches. SSR-safe: queries run client-side only (wallet-dependent), pages stream static shells instantly.

---

## 10. Responsive Strategy

Mobile-first (360px+), enhancement breakpoints at `md` 768 / `lg` 1024 / `xl` 1440.

- **Dashboard:** vault cards stack → 2-col grid (md) → 3-col (lg); protocol stats row wraps.
- **Vault Detail:** single column with action panel below stats → two-column (lg): content 2/3, sticky action panel 1/3.
- **Portfolio:** stacked cards → asymmetric grid (lg); holdings table becomes card list under md.
- **Navigation:** bottom-sheet Drawer + hamburger under md; horizontal navbar above.
- **Tables:** Transaction table collapses to stacked rows with labeled values under md (no horizontal scroll traps).
- Touch targets ≥ 44px; layouts use flexbox first, grid only for 2-D arrangements; fluid type via responsive utilities.

---

## 11. Error Handling Strategy

- **Route level:** `app/error.tsx` (+ per-route where useful) with branded retry UI; `not-found.tsx` for bad vault addresses.
- **Component level:** a reusable `QueryBoundary` pattern — every data component renders skeleton → data → inline error card with a Retry button wired to `refetch`. A failed contract read never blanks a page; sibling data keeps rendering.
- **RPC resilience:** Viem `fallback` transport with retries; a global degraded-connection banner appears if block-watching stalls (no new block within a timeout) while cached data stays visible.
- **Write errors:** user rejection (silent toast, no error styling) distinguished from revert (decoded message via `errors.ts`) and timeout (guidance + explorer link).
- **Guards:** wrong network, paused vault, ineligible wallet, deposit cap reached, zero balances — each has a designed empty/blocked state, never a crash or dead button.

---

## 12. Performance

- Recharts loaded via `next/dynamic` only on routes with charts (largest dep, code-split away from Dashboard first paint).
- RainbowKit modal styles tree-shaken; wallet connectors lazy where supported.
- `next/font` for Inter/Outfit (zero CLS), no image-heavy assets (SVG + CSS effects for the animated background — GPU-friendly transforms only, paused under reduced motion).
- Memoized derived selectors for portfolio math; `AnimatedNumber` isolates re-renders from per-block updates.
- Static shells stream from RSC; client islands hydrate only interactive regions. Target Lighthouse > 95.

---

## Open items confirmed before Phase 2

1. **ABI events/errors missing from paste** — handled as described in §1.2; supply the full ABI anytime for better revert decoding.
2. **APY derivation** — computed from `profitUnlockingRate`/`totalAssets` (annualized), labeled as "current rate"; historical charts use labeled mock data per spec.
3. **`redeemInKind`** — exposed as an advanced option in the Withdraw form. Confirm you want it user-facing.

## Proposed Phase 2 implementation order (one step per approval)

1. Foundation: config (chain, contracts, wagmi), typed ABIs, providers, design tokens, fonts, root layout + animated background
2. `ui/` primitive library
3. Wallet experience: ConnectWallet, WalletStatus, WrongNetwork, useChainStatus
4. Read layer: useVault(s), useVaultBalances, useVaultStats + Dashboard page
5. Vault Detail page: stats, charts, capacity gauge
6. Transaction engine: useTransactionFlow, useApprove, useDeposit + Deposit form
7. Withdraw/Redeem (+ redeemInKind) flow
8. Portfolio page
9. Transaction History (useTransactions + page)
10. Settings page
11. Accessibility & performance pass, production build verification
