 
# RegisterUser
This is a simple decentralized application (DApp) where users can register and search for their profiles after registration. Also, a registered user could be deleted.

## Description
This is a simple Solidity smart contract comprising three functions: 
- registerUser: allows user to register their profile by inputting their username and gender.
- viewUser: allows users to view their profile after registration.
- removeUser: allows the owner of the contract to remove a registered user.

## Getting Started
After cloning the github, do the following to get the code running on your computer.

- Inside the project directory, in the terminal type: npm i
- Open two additional terminals in your VS code
- In the second terminal type: npx hardhat node
- In the third terminal, type: npx hardhat run --network localhost scripts/deploy.js 
- Back in the first terminal, type npm run dev to launch the front-end. After this, the project will be running on your localhost. Typically at http://localhost:3000/

### Updated Loom Video
https://www.loom.com/share/87417c9457d048b68312b0920c71fe76?sid=431166cc-0cd3-459f-92b9-40d7c42aa6e4

## Authors
Peter Fatukasi

## License
This project is licensed under the MIT License - see the LICENSE.md file for details
