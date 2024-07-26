// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract MetaToken {
    address public owner;

    mapping (address => uint256) public userBalance;

    constructor () {
        owner = msg.sender;
    }

    modifier onlyOwner()  {
        require(msg.sender == owner, "Unauthorized!");
        _;
    }

    function mintToken (address _receiver) external onlyOwner {
        userBalance[_receiver] = userBalance[_receiver] + 10000;
    }

    function checkUserBalance() external view returns (uint256 _balance) {
        //require(userBalance[msg.sender] >= 0, "No Balance");
        _balance = userBalance[msg.sender];
    }

    function userWithdrawals(uint256 _withdrawalAmount) external {
      //  require(userBalance[msg.sender] >= _withdrawalAmount, "Insufficient Balance");
        userBalance[msg.sender] = userBalance[msg.sender] - _withdrawalAmount;
    }
}
