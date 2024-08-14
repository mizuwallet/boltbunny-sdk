import { Network } from '@aptos-labs/ts-sdk';
import { GraphQLClient, gql } from 'graphql-request';

interface BoltBunnyClientConstructorParams {
  APISecretKey: string;
  network: Network.TESTNET | Network.MAINNET;
}

const GRAPHQL_URL: Record<Network.TESTNET | Network.MAINNET, string> = {
  [Network.TESTNET]: 'https://hasura-wallet.groupwar.xyz/v1/graphql',
  [Network.MAINNET]: 'https://api.mz.xyz/v1/graphql/',
};

export class BoltBunnyClient {
  private APISecretKey: string;
  private network: Network.TESTNET | Network.MAINNET;

  constructor(options: BoltBunnyClientConstructorParams) {
    this.APISecretKey = options.APISecretKey;
    this.network = options.network;
  }

  /**
   * @param {object} params - Include the signature and the transaction
   * @param {string} params.signature - The signature of signed by user
   * @param {string} params.transaction - The transaction to be sent
   * @returns
   *
   * @example
   * const txn: SimpleTransaction = await aptos.transaction.build.simple({
   *    ...
   * });
   * const signature = await walletCore.signTransaction(txn);
   *
   * const result: any = await bbClient.sendTransaction({
   *    signature: signature.bcsToHex().toString(),
   *    transaction: txn.rawTransaction.bcsToHex().toString(),
   * });
   *
   */
  async sendTransaction(params: { signature: string; transaction: string }): Promise<any> {
    if (!this.APISecretKey) throw new Error('APISecretKey is required');
    if (!GRAPHQL_URL[this.network]) throw new Error('Invalid network');

    const GQL_Client = new GraphQLClient(GRAPHQL_URL[this.network], {
      headers: () => ({
        'x-mizu-app-secret': this.APISecretKey,
      }),
    });

    return await GQL_Client.request(
      gql`
        mutation submitTransaction($signature: String!, $transaction: String!) {
          submitTransaction(txnParams: { signature: $signature, transaction: $transaction }) {
            transactionHash
          }
        }
      `,
      {
        ...params,
      },
    );
  }
}
