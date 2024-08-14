# @boltbunny

## Packages

### @boltbunny/ts-sdk

Installation

```
pnpm install @boltbunny/ts-sdk
```

Usage

```
import { BoltBunny } from '@boltbunny/ts-sdk'

const bbClient = new BoltBunny({
	APISecretKey: <YOUR_API_SECRET_KEY>,
	network: 'mainnet' | 'testnet'
})

const txn: SimpleTransaction = await aptos.transaction.build.simple({
   ...
});

const signature = await walletCore.signTransaction(txn);
const result: any = await bbClient.sendTransaction({
   signature: signature.bcsToHex().toString(),
   transaction: txn.rawTransaction.bcsToHex().toString(),
});
```
