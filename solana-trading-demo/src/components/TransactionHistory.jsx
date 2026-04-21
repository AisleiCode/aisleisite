import { useState, useEffect } from 'react';
import { useWallet } from '../solana/WalletContext';
import { getTransactionHistory } from '../solana/transactions';
import './TransactionHistory.css';

export default function TransactionHistory() {
  const { walletAddress } = useWallet();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (walletAddress) {
      loadTransactions();
    } else {
      setTransactions([]);
    }
  }, [walletAddress]);

  const loadTransactions = async () => {
    if (!walletAddress) return;
    
    setLoading(true);
    try {
      const history = await getTransactionHistory(walletAddress);
      setTransactions(history);
    } catch (error) {
      console.error('加载交易历史失败:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!walletAddress) {
    return null;
  }

  return (
    <div className="history-card">
      <div className="history-header">
        <h2 className="card-title">交易历史</h2>
        <button className="refresh-btn" onClick={loadTransactions} disabled={loading}>
          {loading ? '刷新中...' : '刷新'}
        </button>
      </div>

      {transactions.length === 0 ? (
        <p className="empty-msg">暂无交易记录</p>
      ) : (
        <div className="transaction-list">
          {transactions.map((tx) => (
            <div key={tx.signature} className="transaction-item">
              <div className="tx-info">
                <span className={`tx-status ${tx.status === '成功' ? 'success' : 'failed'}`}>
                  {tx.status}
                </span>
                <span className="tx-time">{tx.blockTime}</span>
              </div>
              <a
                href={`https://explorer.solana.com/tx/${tx.signature}?cluster=devnet`}
                target="_blank"
                rel="noopener noreferrer"
                className="tx-link"
              >
                {tx.signature.slice(0, 44)}...
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
