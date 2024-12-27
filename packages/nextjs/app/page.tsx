'use client';

import { useState, useEffect } from 'react';
import { useAccount, useContractWrite, useContractRead } from 'wagmi';
import { ethers } from 'ethers';

const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
const contractABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "sender",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "PaymentReceived",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "recipient",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "Withdrawal",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "getBalance",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getOwner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "greeting",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "pay",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address payable",
        "name": "recipient",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "withdraw",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];



export default function HomePage() {
  const { isConnected } = useAccount();
  const [amount, setAmount] = useState('');
  const [contract, setContract] = useState(null);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawAddress, setWithdrawAddress] = useState('');

  const { write: pay, error } = useContractWrite({
    address: contractAddress,
    abi: contractABI,
    functionName: 'pay',
    overrides: {
      value: amount ? ethers.parseEther(amount) : ethers.parseEther('0'),
    },
  });
  console.log("useContractWrite result:", pay);
  if (error) {
    console.error('Ошибка в useContractWrite:', error);
  }
  
  

  const { data: balance } = useContractRead({
    address: contractAddress,
    abi: contractABI,
    functionName: 'getBalance',
  });

  const { data: owner } = useContractRead({
    address: contractAddress,
    abi: contractABI,
    functionName: 'getOwner',
  });
  console.log("Contract owner:", owner);

  useEffect(() => {
    const initContract = async () => {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contractInstance = new ethers.Contract(contractAddress, contractABI, signer);
      setContract(contractInstance);
    };

    initContract().catch(console.error);
  }, []);

  const handlePayment = async () => {
    if (!contract) {
      alert('Контракт не инициализирован.');
      return;
    }

    try {
      const tx = await contract.pay({ value: ethers.parseEther(amount) });
      await tx.wait(); // Ожидаем завершения транзакции
      alert('Платеж успешно выполнен!');
    } catch (err) {
      console.error('Ошибка при выполнении платежа:', err);
      alert('Произошла ошибка при выполнении платежа.');
    }
  };

  const handleWithdraw = async () => {
    if (!contract) {
      alert('Контракт не инициализирован.');
      return;
    }

    if (!withdrawAddress || !withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      alert('Введите корректный адрес и сумму для вывода.');
      return;
    }

    try {
      const tx = await contract.withdraw(
        withdrawAddress,
        ethers.parseEther(withdrawAmount)
      );
      await tx.wait(); // Ожидаем завершения транзакции
      alert('Деньги успешно выведены!');
    } catch (err) {
      console.error('Ошибка при выводе средств:', err);
      alert('Произошла ошибка при выводе средств.');
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>YourContract</h1>
      {isConnected ? (
        <>
          <div>
            <h2>Ввод средств</h2>
            <label>Введите сумму (ETH): </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.01"
              style={{ marginRight: '10px' }}
            />
            <button onClick={handlePayment} style={{ padding: '5px 10px' }}>
              Отправить платеж
            </button>
          </div>
          <div style={{ marginTop: '20px' }}>
            <h2>Вывод средств</h2>
            <label>Адрес получателя: </label>
            <input
              type="text"
              value={withdrawAddress}
              onChange={(e) => setWithdrawAddress(e.target.value)}
              placeholder="0x..."
              style={{ marginRight: '10px', width: '300px' }}
            />
            <br />
            <label>Сумма (ETH): </label>
            <input
              type="number"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              placeholder="0.01"
              style={{ marginRight: '10px' }}
            />
            <button onClick={handleWithdraw} style={{ padding: '5px 10px' }}>
              Вывести средства
            </button>
          </div>
          <div style={{ marginTop: '20px' }}>
            <h2>Баланс контракта: {balance ? ethers.formatEther(balance) : '0'} ETH</h2>
          </div>
        </>
      ) : (
        <p>Пожалуйста, подключите ваш кошелек.</p>
      )}
    </div>
  );
}
