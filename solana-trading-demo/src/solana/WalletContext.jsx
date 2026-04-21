import { createContext, useState, useContext, useEffect } from 'react';
import { connection } from './config';
import { PublicKey } from '@solana/web3.js';

const WalletContext = createContext();

export function WalletProvider({ children }) {
  const [walletAddress, setWalletAddress] = useState(null);
  const [balance, setBalance] = useState(0);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);

  // 连接 Phantom 钱包
  const connectWallet = async () => {
    setIsConnecting(true);
    setError(null);

    try {
      // 检查是否安装了 Phantom
      if ('solana' in window) {
        const provider = window.solana;
        
        if (provider.isPhantom) {
          // 连接钱包
          const response = await provider.connect();
          const address = response.publicKey.toString();
          
          setWalletAddress(address);
          
          // 获取余额
          await fetchBalance(address);
        } else {
          throw new Error('请安装 Phantom 钱包');
        }
      } else {
        // 引导用户安装 Phantom
        window.open('https://phantom.app/', '_blank');
        throw new Error('未检测到 Phantom 钱包，已打开下载页面');
      }
    } catch (err) {
      setError(err.message);
      console.error('连接钱包失败:', err);
    } finally {
      setIsConnecting(false);
    }
  };

  // 断开钱包连接
  const disconnectWallet = async () => {
    try {
      if ('solana' in window) {
        await window.solana.disconnect();
      }
      setWalletAddress(null);
      setBalance(0);
    } catch (err) {
      console.error('断开钱包失败:', err);
    }
  };

  // 获取 SOL 余额
  const fetchBalance = async (address) => {
    try {
      const publicKey = new PublicKey(address);
      const balanceInLamports = await connection.getBalance(publicKey);
      setBalance(balanceInLamports / 1000000000);
    } catch (err) {
      console.error('获取余额失败:', err);
    }
  };

  // 监听钱包地址变化
  useEffect(() => {
    if ('solana' in window) {
      window.solana.on('accountChanged', (publicKey) => {
        if (publicKey) {
          setWalletAddress(publicKey.toString());
          fetchBalance(publicKey.toString());
        } else {
          setWalletAddress(null);
          setBalance(0);
        }
      });

      window.solana.on('connect', () => {
        console.log('钱包已连接');
      });

      window.solana.on('disconnect', () => {
        setWalletAddress(null);
        setBalance(0);
      });
    }

    return () => {
      if ('solana' in window) {
        window.solana.removeAllListeners('accountChanged');
        window.solana.removeAllListeners('connect');
        window.solana.removeAllListeners('disconnect');
      }
    };
  }, []);

  return (
    <WalletContext.Provider
      value={{
        walletAddress,
        balance,
        isConnecting,
        error,
        connectWallet,
        disconnectWallet,
        fetchBalance,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  return useContext(WalletContext);
}
