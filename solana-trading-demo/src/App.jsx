import { WalletProvider } from './solana/WalletContext';
import WalletButton from './components/WalletButton';
import TransferForm from './components/TransferForm';
import TransactionHistory from './components/TransactionHistory';
import './App.css';

function App() {
  return (
    <WalletProvider>
      <div className="app">
        <header className="app-header">
          <div className="header-content">
            <h1 className="logo">
              <span className="logo-icon">◎</span>
              Solana Trading Demo
            </h1>
            <p className="subtitle">Solana 钱包连接与交易演示</p>
          </div>
        </header>

        <main className="app-main">
          <WalletButton />
          <TransferForm />
          <TransactionHistory />
        </main>

        <footer className="app-footer">
          <p>网络: Devnet | 请确保已安装 Phantom 钱包扩展</p>
          <a href="https://phantom.app/" target="_blank" rel="noopener noreferrer">
            获取 Phantom 钱包
          </a>
        </footer>
      </div>
    </WalletProvider>
  );
}

export default App;
