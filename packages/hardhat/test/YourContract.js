const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("YourContract", function () {
  let contract;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    // Получаем аккаунты
    [owner, addr1, addr2] = await ethers.getSigners();

    // Разворачиваем контракт
    const YourContract = await ethers.getContractFactory("YourContract");
    contract = await YourContract.deploy();
  });

  it("should have the correct owner", async function () {
    expect(await contract.getOwner()).to.equal(owner.address);
  });

  it("should allow payments and emit PaymentReceived event", async function () {
    const amount = ethers.parseEther("1");

    // Подписываемся на событие
    await expect(contract.connect(addr1).pay({ value: amount }))
      .to.emit(contract, "PaymentReceived")
      .withArgs(addr1.address, amount);

    // Проверяем баланс контракта
    const balance = await contract.getBalance();
    expect(balance).to.equal(amount);
  });

  it("should allow the owner to withdraw funds", async function () {
    const depositAmount = ethers.parseEther("2");  // 2 ETH
    const withdrawAmount = ethers.parseEther("1"); // 1 ETH

    // Адрес для вывода
    const recipient = addr2.address;

    // Адрес получает средства
    await contract.connect(addr1).pay({ value: depositAmount });

    // Подписываемся на событие вывода
    await expect(contract.connect(owner).withdraw(recipient, withdrawAmount))
      .to.emit(contract, "Withdrawal")
      .withArgs(recipient, withdrawAmount);

    // Проверяем баланс контракта с использованием BigInt
    const contractBalance = await contract.getBalance();
    const contractBalanceBigInt = BigInt(contractBalance.toString()); // Преобразуем в BigInt
    const depositAmountBigInt = BigInt(depositAmount.toString()); // Преобразуем в BigInt
    const withdrawAmountBigInt = BigInt(withdrawAmount.toString()); // Преобразуем в BigInt

    const expectedBalance = depositAmountBigInt - withdrawAmountBigInt;

    // Проверяем, что баланс контракта после вывода средств правильный
    expect(contractBalanceBigInt).to.equal(expectedBalance);
  });

  it("should revert if the contract tries to withdraw more than the balance", async function () {
    const amount = ethers.parseEther("1");

    // Пытаемся вывести больше средств, чем есть в контракте
    await expect(contract.connect(owner).withdraw(addr2.address, amount))
      .to.be.revertedWith("Insufficient balance");
  });

  it("should allow anyone to call greeting", async function () {
    const greeting = await contract.greeting();
    expect(greeting).to.equal("Hello, welcome to YourContract!");
  });
});
