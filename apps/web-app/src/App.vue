<template>
  <div class="flex flex-col max-w-[750px] mx-auto py-10">
    <button class="btn btn-neutral" @click="connectWallet" v-if="!address">Connect</button>
    <div class="flex flex-col gap-5" v-else>
      <span class="flex flex-col">
        <span>Connected Wallet Address:</span>
        <span class="font-bold">{{ address }}</span>
      </span>

      <labe class="input input-bordered w-full flex items-center gap-2">
        <span class="w-24 text-gray">Transfer to:</span>
        <input v-model="reciept" type="text" placeholder="Type here" class="w-full" />
      </labe>
      <button class="btn btn-primary" @click="transfer">Transfer 0.01 APT</button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue';

  const address = ref('');

  const connectWallet = async () => {
    const result: any = await window.petra.connect();
    address.value = result.address;
    window.localStorage.setItem('petra-wallet', 'yes');
  };

  const init = async () => {
    if (window.localStorage.getItem('petra-wallet')) {
      connectWallet();
    }
  };

  const reciept = ref('0xe51c64d1f2595557676053e03ce637f9fe26af706c156cae7fff3ad4893ccc53');
  const transfer = async () => {
    const networkInfo: any = await window.petra.getNetwork();
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

    const result: any = await window.petra.signAndSubmitTransaction({
      arguments: [reciept.value, '101'],
      function: '0x1::coin::transfer',
      type: 'entry_function_payload',
      type_arguments: ['0x1::aptos_coin::AptosCoin'],
    });
    console.log(result);
    alert(`Transaction submitted: ${result.hash}, ${result.vm_status}`);
  };

  onMounted(() => {
    init();
  });
</script>

<style scoped></style>
