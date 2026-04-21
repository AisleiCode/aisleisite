import { useWallet } from '../solana/WalletContext';
import { formatAddress } from '../solana/config';
import './WalletButton.css';

export default function WalletButton() {
  const { walletAddress, balance, isConnecting, error, connectWallet, disconnectWallet } = useWallet();

  if (!walletAddress) {
    return (
      <div className="wallet-section">
        <button className="connect-btn" onClick={connectWallet} disabled={isConnecting}>
          {isConnecting ? '连接中...' : '连接钱包'}
        </button>
        {error && <p className="error-msg">{error}</p>}
      </div>
    );
  }

  return (
    <div className="wallet-section">
      <div className="wallet-info">
        <div className="address-badge">
          <span className="dot"></span>
          {formatAddress(walletAddress)}
        </div>
        <div className="balance-display">
          <span className="balance-label">余额:</span>
          <span className="balance-amount">{balance.toFixed(4)} SOL</span>
        </div>
      </div>
      <button className="disconnect-btn" onClick={disconnectWallet}>
        断开连接
      </button>
    </div>
  );
}
