import { Network } from '@aptos-labs/ts-sdk';

interface BoltBunnyClientConstructorParams {
  APISecretKey: string;
  network: Network;
}

class BoltBunnyClient {
  private APISecretKey: string;

  constructor(options: BoltBunnyClientConstructorParams) {
    this.APISecretKey = options.APISecretKey;
  }

  async isActived() {
    console.log('Checking if the client is actived with the key');
  }

  async sendTransaction() {
    // key in header
    console.log(this.APISecretKey);
    console.log('Sending transaction');
  }
}

console.log(BoltBunnyClient);
