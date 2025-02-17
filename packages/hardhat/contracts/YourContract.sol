// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "hardhat/console.sol";

/**
 * A smart contract that allows changing a state variable of the contract and tracking the changes
 * It also allows the owner to withdraw the Ether in the contract
 * @author BuidlGuidl
 */
contract YourContract {
    // Событие для регистрации платежей
    event PaymentReceived(address indexed sender, uint256 amount);

    // Событие для вывода средств
    event Withdrawal(address indexed recipient, uint256 amount);

    // Владелец контракта
    address public owner;

    // Конструктор для установки владельца контракта
    constructor() {
        owner = msg.sender;  // Устанавливаем владельца контракта
    }

    // Функция для отправки платежа
    function pay() external payable {
        require(msg.value > 0, "Payment must be greater than 0");
        emit PaymentReceived(msg.sender, msg.value);
    }

    // Функция для вывода средств владельцем контракта
    function withdraw(address payable recipient, uint256 amount) external {
        require(address(this).balance >= amount, "Insufficient balance");
        recipient.transfer(amount);
        emit Withdrawal(recipient, amount);
    }

    function getOwner() external view returns (address) {
    return owner;
}

    // Функция для получения баланса контракта
    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }

    // Функция для приветствия
    function greeting() external pure returns (string memory) {
        return "Hello, welcome to YourContract!";
    }
}
