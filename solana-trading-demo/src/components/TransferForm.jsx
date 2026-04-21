import { useState } from 'react';
import { useWallet } from '../solana/WalletContext';
import { sendSOL, requestAirdrop } from '../solana/transactions';
import './TransferForm.css';

export default function TransferForm() {
  const { walletAddress, fetchBalance } = useWallet();
  const [toAddress, setToAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [airdropLoading, setAirdropLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!walletAddress) {
      setMessage({ type: 'error', text: '请先连接钱包' });
      return;
    }

    if (!toAddress || !amount) {
      setMessage({ type: 'error', text: '请填写完整信息' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const result = await sendSOL(walletAddress, toAddress, parseFloat(amount));
      
      if (result.success) {
        setMessage({
          type: 'success',
          text: `交易成功! 签名: ${result.signature.slice(0, 20)}...`,
        });
        setToAddress('');
        setAmount('');
        // 刷新余额
        await fetchBalance(walletAddress);
      } else {
        setMessage({ type: 'error', text: result.error });
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleAirdrop = async () => {
    if (!walletAddress) {
      setMessage({ type: 'error', text: '请先连接钱包' });
      return;
    }

    setAirdropLoading(true);
    setMessage(null);

    try {
      const result = await requestAirdrop(walletAddress);
      
      if (result.success) {
        setMessage({
          type: 'success',
          text: `成功获取 2 SOL (Devnet)! 交易: ${result.signature.slice(0, 20)}...`,
        });
        await fetchBalance(walletAddress);
      } else {
        setMessage({ type: 'error', text: result.error });
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setAirdropLoading(false);
    }
  };

  if (!walletAddress) {
    return (
      <div className="transfer-card">
        <p className="connect-prompt">请先连接钱包以使用转账功能</p>
      </div>
    );
  }

  return (
    <div className="transfer-card">
      <h2 className="card-title">发送 SOL</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="toAddress">接收地址</label>
          <input
            id="toAddress"
            type="text"
            placeholder="输入接收方 Solana 地址"
            value={toAddress}
            onChange={(e) => setToAddress(e.target.value)}
            className="input-field"
          />
        </div>

        <div className="form-group">
          <label htmlFor="amount">金额 (SOL)</label>
          <input
            id="amount"
            type="number"
            placeholder="0.00"
            step="0.01"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="input-field"
          />
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? '交易中...' : '发送 SOL'}
        </button>
      </form>

      <div className="divider"></div>

      <button
        className="airdrop-btn"
        onClick={handleAirdrop}
        disabled={airdropLoading}
      >
        {airdropLoading ? '请求中...' : '🚰 获取 Devnet SOL (空投)'}
      </button>

      {message && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}
    </div>
  );
}
