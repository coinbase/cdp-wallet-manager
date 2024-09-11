export function formatNetworkId(networkId: string): string {
  return networkId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}