// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PaymentProcessor {
    // Событие для регистрации платежей
    event PaymentReceived(address indexed sender, uint256 amount);

    // Событие для вывода средств
    event Withdrawal(address indexed recipient, uint256 amount);

    // Функция для отправки платежа
    function pay() external payable {
        require(msg.value > 0, "Payment must be greater than 0");
        emit PaymentReceived(msg.sender, msg.value);
    }

    // Функция для вывода средств владельцем контракта
    function withdraw(address payable recipient, uint256 amount) external {
        require(address(this).balance >= amount, "Insufficient balance");
        require(msg.sender == owner, "Only the owner can withdraw funds");
        recipient.transfer(amount);
        emit Withdrawal(recipient, amount);
    }

    // Функция для получения баланса контракта
    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }

    // Владелец контракта
    address public owner;

    // Конструктор для установки владельца контракта
    constructor() {
        owner = msg.sender;
    }
}
