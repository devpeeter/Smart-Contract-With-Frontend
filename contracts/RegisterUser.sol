// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract RegisterUser {

    address immutable owner;

    enum Gender {
        MALE,
        FEMALE
    }

    struct User {
        address user;
        string username;
        Gender gender;
    }

    mapping(address => User) users;

    constructor(){
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner allowed");
        _;
    }

    function registerUser(string memory _username, Gender _gender) external {
        require(users[msg.sender].user == address (0), "Registered already!");

        User storage _user = users[msg.sender];
        _user.user = msg.sender;
        _user.gender = _gender;
        _user.username = _username;
    }

    function removeUser(address _user) external onlyOwner {
        require(users[_user].user != address (0), "User does not exist");

        delete users[_user];
    }

    function viewUser(address _user) external view returns (address, string memory, Gender){
        require(users[_user].user != address (0), "User does not exist");
        User memory _foundUser = users[_user];

        return (_foundUser.user, _foundUser.username, _foundUser.gender);
    }
}
