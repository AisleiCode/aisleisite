import { Transaction, SystemProgram, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { connection } from './config';

/**
 * 发送 SOL 交易
 * @param {string} fromPublicKey - 发送方公钥
 * @param {string} toPublicKey - 接收方公钥
 * @param {number} amount - 发送的 SOL 数量
 * @returns {Promise<object>} 交易结果
 */
export async function sendSOL(fromPublicKey, toPublicKey, amount) {
  try {
    // 验证接收方地址
    let recipientPublicKey;
    try {
      recipientPublicKey = new PublicKey(toPublicKey);
    } catch {
      throw new Error('无效的接收方地址');
    }

    // 创建交易
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: new PublicKey(fromPublicKey),
        toPubkey: recipientPublicKey,
        lamports: amount * LAMPORTS_PER_SOL,
      })
    );

    // 获取最新的区块哈希
    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = new PublicKey(fromPublicKey);

    // 请求用户签名并发送
    if ('solana' in window) {
      const { signature } = await window.solana.signAndSendTransaction(transaction);
      
      // 确认交易
      const confirmation = await connection.confirmTransaction(signature);
      
      return {
        success: true,
        signature,
        confirmation,
      };
    } else {
      throw new Error('未检测到钱包');
    }
  } catch (error) {
    console.error('交易失败:', error);
    return {
      success: false,
      error: error.message || '交易失败',
    };
  }
}

/**
 * 获取交易历史
 * @param {string} address - 钱包地址
 * @returns {Promise<Array>} 交易记录
 */
export async function getTransactionHistory(address) {
  try {
    const publicKey = new PublicKey(address);
    const signatures = await connection.getSignaturesForAddress(publicKey, { limit: 10 });
    
    return signatures.map((sig) => ({
      signature: sig.signature,
      slot: sig.slot,
      blockTime: sig.blockTime ? new Date(sig.blockTime * 1000).toLocaleString() : '未知',
      status: sig.err ? '失败' : '成功',
    }));
  } catch (error) {
    console.error('获取交易历史失败:', error);
    return [];
  }
}

/**
 * 请求 Devnet SOL (水龙头)
 * @param {string} address - 钱包地址
 * @returns {Promise<object>} 结果
 */
export async function requestAirdrop(address) {
  try {
    const publicKey = new PublicKey(address);
    const signature = await connection.requestAirdrop(publicKey, 2 * LAMPORTS_PER_SOL);
    
    await connection.confirmTransaction(signature);
    
    return {
      success: true,
      signature,
    };
  } catch (error) {
    console.error('请求空投失败:', error);
    return {
      success: false,
      error: error.message || '空投失败',
    };
  }
}
