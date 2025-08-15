import { NhostClient } from '@nhost/nhost-js';

// Nhost configuration
const nhostConfig = {
  subdomain: 'tsbwjtsnekcocprbjdtr',
  region: 'ap-south-1'
};

console.log('Initializing Nhost client with:', nhostConfig);

export const nhost = new NhostClient(nhostConfig);