# SBX-TOKEN

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js
- pnpm (recommended) or npm
- Hardhat
- Foundry (for additional testing capabilities)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/soulboundgg/sbx-token.git
   cd sbx-token
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Setup environment variables:
   ```bash
   cp .env.example .env
   ```
   
   Configure your `.env` file with the following:
   - `PRIVATE_KEY`: Your deployment wallet private key
   - `MNEMONIC`: Alternative to private key (if preferred)
   - Other network-specific API keys as needed

## Deployment

1. Compile the contracts:
   ```bash
   pnpm compile
   ```
   This will compile both Hardhat and Forge contracts.

2. Run the test suite:
   ```bash
   pnpm test
   ```
   This executes both Hardhat and Forge tests.

3. Deploy the contracts:
   ```bash
   npx hardhat lz:deploy
   ```

4. Wire up the cross-chain connections:
   ```bash
   npx hardhat lz:oapp:wire --oapp-config layerzero.config.ts
   ```

## Testing

The project supports both Hardhat and Forge testing frameworks:

- Run Hardhat tests:
  ```bash
  pnpm test:hardhat
  ```

- Run Forge tests:
  ```bash
  pnpm test:forge
  ```

- Run all tests:
  ```bash
  pnpm test
  ```

## Contract Architecture

- `Soulbucks.sol`: Cross-chain compatible token contract based on LayerZero's OFT standard

## LayerZero Integration

This project uses LayerZero's OmniChain technology for cross-chain functionality:

1. Configure endpoints in `layerzero.config.ts`
2. Set up connections between chains
3. Configure message libraries and executors
4. Set up DVN (Data Verification Node) requirements

Refer to the LayerZero documentation for detailed configuration options.

## Contract Verification

Verify deployed contracts on block explorers:

```bash
npx hardhat verify --network <network-name> <contract-address> <constructor-args>
```

Replace `<network-name>`, `<contract-address>`, and `<constructor-args>` with your specific deployment details.

## Security Considerations

- All contracts have been developed with security best practices
- Use secure environments for private keys and sensitive data
- Implement appropriate access controls and time delays
- Consider running security audits before mainnet deployment