import { clusterApiUrl, Connection } from '@solana/web3.js';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';

// 使用 Devnet 进行测试
export const network = clusterApiUrl('devnet');

// 创建连接
export const connection = new Connection(network, 'confirmed');

// 配置支持的钱包
export const wallets = [
  new PhantomWalletAdapter(),
  new SolflareWalletAdapter(),
];

// 辅助函数：格式化公钥显示
export function formatAddress(address) {
  if (!address) return '';
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
}

// 辅助函数：SOL 到 lamports 转换
export function solToLamports(sol) {
  return Math.floor(sol * 1000000000);
}

// 辅助函数：lamports 到 SOL 转换
export function lamportsToSol(lamports) {
  return lamports / 1000000000;
}
