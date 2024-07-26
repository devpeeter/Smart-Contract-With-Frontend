 
# Meta Token
This is a simple decentralized application (DApp) where users get token minted to them, they can check their balance and also withdraw their token.

## Description
This is a simple Solidity smart contract comprising five functions: 
- three defined functions - mintToken, checkUserBalance and userWithdrawals.
- two automatically generated functions - owner, userBalance.

The three defined functions are:

- mintToken (address _receiver) : This function is what the owner (the EOA account that deloys this contract) of the contract call with function argument  (address _receiver) to mint 10,000 of the token to the address.
- checkUserBalance(): This function allows a user (msg.sender) to check his/her token balance in the contract.
- userWithdrawals(uint256 _withdrawalAmount): This function allows user to withdraw token from their balance.

The two automatically generated functions are:

- owner(): This automatically generated function was generated because of the public visibility, and it returns the EOA address that deploys this contract.
- userBalance(address): This fuction is the function powering the checkUserBalance().


## Getting Started
After cloning the github, do the following to get the code running on your computer.

- Inside the project directory, in the terminal type: npm i
- Open two additional terminals in your VS code
- In the second terminal type: npx hardhat node
- In the third terminal, type: npx hardhat run --network localhost scripts/deploy.js 
- Back in the first terminal, type npm run dev to launch the front-end. After this, the project will be running on your localhost. Typically at http://localhost:3000/

## Authors
Warith Adebowale

## License
This project is licensed under the MIT License - see the LICENSE.md file for details
