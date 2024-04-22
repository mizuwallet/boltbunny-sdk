<template>
  <div class="flex flex-col max-w-[750px] mx-auto py-10">
    <button class="btn btn-neutral" @click="connectWallet" v-if="!address">Connect</button>
    <div class="flex flex-col gap-5" v-else>
      <span class="flex flex-col">
        <span>Connected Wallet Address:</span>
        <span class="font-bold">{{ address }}</span>
      </span>

      <label class="input input-bordered w-full flex items-center gap-2">
        <span class="w-24 text-gray">Transfer to:</span>
        <input v-model="reciept" type="text" placeholder="Type here" class="w-full" />
      </label>

      <div class="grid grid-cols-2 gap-2">
        <button class="btn btn-primary" @click="bbClientTransfer">
          Transfer 0.01 APT By boltbunny SDK
        </button>
        <button class="btn btn-primary" @click="transfer">Transfer 0.01 APT</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import {
    AccountAddress,
    Aptos,
    AptosConfig,
    Network,
    SimpleTransaction,
  } from '@aptos-labs/ts-sdk';
  import { WalletCore } from '@aptos-labs/wallet-adapter-core';
  import { BoltBunnyClient } from '@boltbunny/ts-sdk';
  import { PetraWallet } from 'petra-plugin-wallet-adapter';
  import { onMounted, ref } from 'vue';
  const wallets = [new PetraWallet()];
  const walletCore: WalletCore = new WalletCore(wallets);

  walletCore.on('connect', () => {
    console.log(walletCore.account);
    address.value = walletCore.account!.address;
  });

  const address = ref('');
  const bbClient = new BoltBunnyClient({
    APISecretKey: 'bb_TESTNET_0_5cGVyv7ZHwXDSnT655ojZXLjJdDfG11B',
    network: Network.TESTNET,
  });

  const AptosClient = new Aptos(
    new AptosConfig({
      network: Network.TESTNET,
    }),
  );

  const connectWallet = async () => {
    await walletCore.connect('Petra');
    window.localStorage.setItem('petra-wallet', 'true');
  };

  const init = async () => {
    if (window.localStorage.getItem('petra-wallet')) {
      connectWallet();
    }
  };

  console.log(AccountAddress.from('0x1').toStringLong());

  const bbClientTransfer = async () => {
    const txn: SimpleTransaction = await AptosClient.transaction.build.simple({
      sender: address.value,
      data: {
        typeArguments: [
          '0x0000000000000000000000000000000000000000000000000000000000000001::aptos_coin::AptosCoin',
        ],
        functionArguments: [reciept.value, '101'],
        function:
          '0x0000000000000000000000000000000000000000000000000000000000000001::coin::transfer',
      },
      withFeePayer: true,
    });

    const signature = await walletCore.signTransaction(txn);

    try {
      const result: any = await bbClient.sendTransaction({
        signature: signature.bcsToHex().toString(),
        transaction: txn.rawTransaction.bcsToHex().toString(),
      });
      console.log(result);
      alert(`Transaction submitted: ${result.submitTransaction.transactionHash}`);
    } catch (e: any) {
      alert('Error: ' + e.message);
    }
  };

  const reciept = ref('0xe51c64d1f2595557676053e03ce637f9fe26af706c156cae7fff3ad4893ccc53');
  const transfer = async () => {
    const networkInfo: any = walletCore?.network;
    console.log(networkInfo);

    if (networkInfo.chainId != 2) {
      alert('Please switch to testnet');
      return;
    }

    if (!address.value) {
      alert('Please connect wallet');
      return;
    }

    if (!reciept.value) {
      alert('Please enter reciept');
      return;
    }

    const txn: any = await walletCore.signAndSubmitTransaction({
      data: {
        functionArguments: [reciept.value, '101'],
        function: '0x1::coin::transfer',
        typeArguments: ['0x1::aptos_coin::AptosCoin'],
      },
    });
    const result: any = await AptosClient.waitForTransaction({
      transactionHash: txn.hash,
    });
    alert(`Transaction submitted: ${result.hash}, ${result.vm_status}`);
  };

  onMounted(() => {
    init();
  });
</script>

<style scoped></style>
