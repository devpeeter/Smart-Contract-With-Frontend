import {useEffect, useState} from "react";
import {ethers} from "ethers";
import atm_abi from "../artifacts/contracts/RegisterUser.sol/RegisterUser.json";

export default function HomePage() {
    const [ethWallet, setEthWallet] = useState(undefined);
    const [account, setAccount] = useState(undefined);
    const [registerContract, setRegisterContract] = useState(undefined);
    const [username, setUsername] = useState('');
    const [gender, setGender] = useState('');
    const [userToRemove, setUserToRemove] = useState('');
    const [userToView, setUserToView] = useState('');
    const [returnedUser, setReturnedUser] = useState('');
    const [returnedUsername, setReturnedUsername] = useState('');
    const [returnedGender, setReturnedGender] = useState('');
    const [isUserViewed, setIsUserViewed] = useState(false);


    const contractAddress = "0x0165878A594ca255338adfa4d48449f69242Eb8F";
    const atmABI = atm_abi.abi;

    const getWallet = async () => {
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
            console.log("Account connected: ", account);
            setAccount(account);
        } else {
            console.log("No account found");
        }
    }

    const connectAccount = async () => {
        if (!ethWallet) {
            alert('MetaMask wallet is required to connect');
            return;
        }

        const accounts = await ethWallet.request({method: 'eth_requestAccounts'});
        handleAccount(accounts);

        // once wallet is set we can get a reference to our deployed contract
        getRegisterUserContract();
    };

    const getRegisterUserContract = () => {
        const provider = new ethers.providers.Web3Provider(ethWallet);
        const signer = provider.getSigner();
        const registerUserContract = new ethers.Contract(contractAddress, atmABI, signer);

        setRegisterContract(registerUserContract);
    }

    const viewUser = async (userAddress) => {
        if (registerContract) {
            try {
                const [retUser, retUsername, retGender] = await registerContract.viewUser(userAddress);
                setReturnedUser(retUser);
                setReturnedUsername(retUsername);

                let _gender = ''
                if (retGender === 0) {
                    _gender = "Male"
                } else if (retGender === 1) {
                    _gender = "Female"
                }

                setReturnedGender(_gender);
            } catch (e) {
                alert("Error: User does not exist")
            }
        }
    }

    const registerUser = async (username, gender) => {
        if (registerContract) {

            try {
                const tx = await registerContract.registerUser(username, gender);
                await tx.wait();
                alert("User registered successfully")
            } catch (error) {
                alert(`Error: ${error}`)
            }
        }
    }

    const removeUser = async (userAddress) => {
        if (registerContract) {

            try {
                const tx = await registerContract.removeUser(userAddress);
                await tx.wait();
                alert("User removed successfully")
            } catch (error) {
                alert(`Error: ${error}`)
            }
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        let _gender = 0;
        if (gender === "Male") {
            _gender = 0
        } else if (gender === "Female") {
            _gender = 1
        }
        await registerUser(username, _gender);
    };

    const handleViewSubmit = async (e) => {
        e.preventDefault();
        await viewUser(userToView);
        setIsUserViewed(true); // Set the flag to true after viewing the user
    };

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

                <form
                    className="form"
                    onSubmit={handleViewSubmit}
                >
                    <input
                        type="text"
                        value={userToView}
                        onChange={(e) => setUserToView(e.target.value)}
                        placeholder="0x...."
                        className="input"
                    />
                    <button type="submit" className="button">View User</button>
                </form>

                {isUserViewed && (
                    <>
                        <p>{`User: ${returnedUser}`}</p>
                        <p>{`Username: ${returnedUsername}`}</p>
                        <p>{`Gender: ${returnedGender}`}</p>
                    </>
                )}

                <form className="form" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Input username"
                        className="input"
                    />
                    <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        className="input"
                    >
                        <option value="">Select gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>
                    <button type="submit" className="button">Register</button>
                </form>


                <form
                    className="form"
                    onSubmit={(e) => {
                        e.preventDefault();
                        removeUser(userToRemove);
                    }}
                >
                    <input
                        type="text"
                        value={userToRemove}
                        onChange={(e) => setUserToRemove(e.target.value)}
                        placeholder="User to remove"
                        className="input"
                    />
                    <button type="submit" className="button">Remove User</button>
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
                        background-color: #3498db;
                        color: white;
                        border: none;
                        padding: 10px 20px;
                        margin: 10px 0;
                        border-radius: 5px;
                        cursor: pointer;
                        font-size: 1em;
                    }

                    .button:hover {
                        background-color: #3498db;
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

    useEffect(() => {
        getWallet();
    }, []);

    return (
        <main className="container">
            <div className="box">
                <header className="header">
                    <h1>User Registry!</h1>
                </header>
                {initUser()}
            </div>
            <style jsx>{`
            .container {
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                background-color: #2c3e50; /* Dark background */
                font-family: 'Arial', sans-serif; /* Modern font */
            }

            .box {
                border: none;
                border-radius: 15px;
                padding: 30px;
                background-color: #ecf0f1; /* Light grey background */
                box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15); /* Larger shadow */
                transition: transform 0.3s ease; /* Smooth transition */
            }

            .box:hover {
                transform: translateY(-10px); /* Lift on hover */
            }

            .header {
                background-color: #3498db; /* Cool blue */
                color: #ffffff;
                padding: 20px 30px;
                border-radius: 10px;
                margin-bottom: 30px;
                text-align: center;
                box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1); /* Shadow for the header */
            }

            .header h1 {
                margin: 0;
                font-size: 2.5em; /* Larger font size */
                font-weight: bold;
            }
        `}</style>
        </main>
    );

}
