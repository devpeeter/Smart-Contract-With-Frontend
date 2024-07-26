import {useState, useEffect} from "react";
import {ethers} from "ethers";
import atm_abi from "../artifacts/contracts/MetaToken.sol/MetaToken.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [mintAddress, setMintAddress] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');


  const contractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
  const atmABI = atm_abi.abi;

  const getWallet = async() => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const account = await ethWallet.request({method: "eth_accounts"});
      handleAccount(account);
    }
  }

  const handleAccount = (account) => {
    if (account) {
      console.log ("Account connected: ", account);
      setAccount(account);
    }
    else {
      console.log("No account found");
    }
  }

  const connectAccount = async() => {
    if (!ethWallet) {
      alert('MetaMask wallet is required to connect');
      return;
    }
  
    const accounts = await ethWallet.request({ method: 'eth_requestAccounts' });
    handleAccount(accounts);
    
    // once wallet is set we can get a reference to our deployed contract
    getATMContract();
  };

  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);
 
    setATM(atmContract);
  }

  const checkUserBalance = async() => {
    if (atm) {
      setBalance((await atm.checkUserBalance()).toNumber());
    }
  }

  const mintToken = async(userAddress) => {
    if (atm) {
      const tx = await atm.mintToken(userAddress);
      await tx.wait();
    }
  }

  const userWithdrawals = async(withdrawalAmount) => {
    if (atm) {
      const tx = await atm.userWithdrawals(withdrawalAmount);
      await tx.wait()
    }
  }

  const initUser = () => {
    const buttonStyle = {
      backgroundColor: '#4CAF50',  // Cool green color
      color: 'white',
      padding: '15px 32px',
      textAlign: 'center',
      textDecoration: 'none',
      display: 'inline-block',
      fontSize: '16px',
      margin: '4px 2px',
      cursor: 'pointer',
      borderRadius: '12px',        // Curved edges
      boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)',  // Shadow
      border: 'none',
      justifyContent: 'center'
    };

    // Check to see if user is connected. If not, connect to their account
    if (!account) {
      return (
          <button style={buttonStyle} onClick={connectAccount}>
            Please connect your Metamask wallet
          </button>
      )
    }

    return (
        <div className="container">
          <button className="button" onClick={checkUserBalance}>Check Balance</button>
          <h3 className="balance-info">Your Balance: {balance}</h3>

          <form
              className="form"
              onSubmit={(e) => {
                e.preventDefault();
                mintToken(mintAddress);
              }}
          >
            <input
                type="text"
                value={mintAddress}
                onChange={(e) => setMintAddress(e.target.value)}
                placeholder="Input address"
                className="input"
            />
            <button type="submit" className="button">Mint Token</button>
          </form>

          <form
              className="form"
              onSubmit={(e) => {
                e.preventDefault();
                userWithdrawals(withdrawAmount);
              }}
          >
            <input
                type="number"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                placeholder="Amount to withdraw"
                className="input"
            />
            <button type="submit" className="button">Withdraw Token</button>
          </form>

          <style jsx>{`
      .container {
        text-align: center;
        padding: 20px;
        background-color: #f0f0f0;
        border-radius: 10px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        max-width: 500px;
        margin: 0 auto;
        font-family: Arial, sans-serif;
      }
      .account-info {
        font-size: 1.2em;
        margin-bottom: 20px;
      }
      .balance-info {
        font-size: 1.5em;
        margin: 20px 0;
        color: #333;
      }
      .button {
        background-color: #4CAF50;
        color: white;
        border: none;
        padding: 10px 20px;
        margin: 10px 0;
        border-radius: 5px;
        cursor: pointer;
        font-size: 1em;
      }
      .button:hover {
        background-color: #45a049;
      }
      .form {
        margin: 20px 0;
      }
      .input {
        padding: 10px;
        margin: 10px 0;
        border: 1px solid #ccc;
        border-radius: 5px;
        width: calc(100% - 22px);
        font-size: 1em;
      }
    `}</style>
        </div>
    );

  }

  useEffect(() => {getWallet();}, []);

  return (
      <main className="container">
        <div className="box">
          <header className="header">
            <h1>Welcome to the Meta Token!</h1>
          </header>
          {initUser()}
        </div>
        <style jsx>{`
      .container {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        background-color: #f0f0f0;
      }
      .box {
        border: 2px solid #4CAF50;
        border-radius: 10px;
        padding: 20px;
        background-color: #ffffff;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      }
      .header {
        background-color: #FF9800; /* Complementary color to #4CAF50 */
        color: #ffffff;
        padding: 20px;
        border-radius: 8px;
        margin-bottom: 20px;
      }
      .header h1 {
        margin: 0;
        font-size: 2em;
        font-weight: bold;
      }
    `}</style>
      </main>
  );
}
