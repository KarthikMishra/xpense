import {useState} from 'react'
import { useEffect } from 'react';
import ExpenseTable from "./ExpenseTable";
import LinebarChart from "./LinebarChart";
import PieChart from "./PieChart";
import Modal from 'react-modal'
import { v4 as uuidv4 } from "uuid";
import "./Dashboard.css"

Modal.setAppElement("#root");

export default function Dashboard() {
    const [walletBalance, setWalletBalance] = useState(
        localStorage.getItem("walletBalance") ? JSON.parse(localStorage.getItem("walletBalance")) : 5000
    );

    const [expenses, setExpenses] = useState(
        localStorage.getItem("expenses")?JSON.parse(localStorage.getItem("expenses")):[]
    );

    useEffect(() => {
        localStorage.setItem("walletBalance", walletBalance);
        localStorage.setItem("expenses", expenses);
    },[])

    const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
    const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);
    const [newExpense, setNewExpense] = useState({
        id: null,
        title: "",
        price: "",
        category: "",
        date: "",
    });
    const [newIncome, setNewIncome] = useState("");

    function getTotalExpenses() {
            return expenses.reduce((total, expense) => 
                total + parseInt(expense.price, 10),0);
    };

    const categories = ["Food",
        "Entertainment",
        "Travel",
        "Shopping",
        "Grocery",
        "Others",];
    

    function handleExpenseListUpdate(expenses){
        setExpenses(expenses);
        const totalBalance = 
            walletBalance - getTotalExpenses();
        setWalletBalance(totalBalance);
        localStorage.setItem("expenses", JSON.stringify(expenses));    
    }

    {/*
    useEffect(() => {
    handleExpenseListUpdate(expenses);
    }, [expenses]);
    */    
    }
 
    const handleInputChange = (e, isExpense = true) => {
        const { name, value } = e.target;
        if (isExpense) {
            setNewExpense((prevState) => ({ ...prevState, [name]: value }));
        } else {
            setNewIncome(value);
        }
    };

    const addExpense = (e) => {
        e.preventDefault();
        if (walletBalance < newExpense.price) {
        return alert("Couldn't add expense, insufficient wallet balance.");
        }
        newExpense.id = uuidv4();

        const updatedBalance = walletBalance - newExpense.price;
        setWalletBalance(updatedBalance);
        localStorage.setItem("walletBalance", JSON.stringify(updatedBalance));
        localStorage.setItem("expenses", JSON.stringify([...expenses, newExpense]));

        setExpenses((prevExpenses) => [...prevExpenses, newExpense]);
        setIsExpenseModalOpen(false);
        setNewExpense({
            id: null,
            title: "",
            price: "",
            category: "",
            date: "",
        });
    };

    const addBalance = (e) => {
        e.preventDefault();
        if (!isNaN(newIncome) && newIncome.trim() !== "") {
        setWalletBalance((prevBalance) => prevBalance + parseInt(newIncome, 10));
        localStorage.setItem(
            "walletBalance",
            JSON.stringify(walletBalance + parseInt(newIncome, 10))
        );
        setIsIncomeModalOpen(false);
        setNewIncome("");
        }
    };

    const modalStyle = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      width: "80%",
      maxWidth: "500px",
      background: "rgba(255, 255, 255, 0.6)",
      borderRadius: "10px",
      border: "border: 1px solid rgba(255, 255, 255, 0.18)",
      boxShadow: " 0 8px 12px rgba(0, 0, 0, 0.1)",
      backdropFilter: "blur(10px)",
    },
    };

    return(
        <div>
            <div className="dashboard-container">
                <h1>Expense Tracker</h1>
            <div className="wallet-container">
            <div className="wallet-income-expense-container">
            <div className="wallet-card-container"> 
            <h2>Wallet Balance: <span className="income-amount">₹{walletBalance}</span></h2>
            <button
                className="glassmorphism"
                onClick={() => setIsIncomeModalOpen(true)}
            >
            + Add Income
            </button>
            </div>
            <div className="wallet-card-container">
            <h2> Expenses: <span className="expense-amount">₹{getTotalExpenses()}</span></h2>
            <button
                onClick={() => setIsExpenseModalOpen(true)}
            >
             + Add Expense   
            </button>
            </div>
            <PieChart data={expenses} />
            </div>
            
            <Modal
                isOpen={isIncomeModalOpen}
                onRequestClose={() => setIsIncomeModalOpen(false)}
                style={modalStyle}
                contentLabel="Add Balance"
            >
                <h2 className="modal-header">Add Balance</h2>
                <form className="modal-form-income" onSubmit={addBalance}>
                <input
                className="glassmorphismButton"
                name="income"
                placeholder="Income Amount"
                type="number"
                value={newIncome}
                onChange={(e) => handleInputChange(e, false)}
                required
                ></input>
                <button className="glassmorphismButton" type="submit">
                    Add Balance
                </button>
                <button
                    className="glassmorphismButton"
                    type="button"
                    onClick={() => setIsIncomeModalOpen(false)}
                >
                    Cancel
                </button>
                </form>
            </Modal>

            <Modal
                isOpen={isExpenseModalOpen}
                onRequestClose={() => setIsExpenseModalOpen(false)}
                style={modalStyle}
                contentLabel="Add New Expense"
            >
                <h2 className="modal-header">Add New Expense</h2>
                <form className="modal-form-expense" onSubmit={addExpense}>
                    <input
                        name="title"
                        placeholder="Title"
                        value={newExpense.title}
                        onChange={handleInputChange}
                        required
                    />

                    <input
                        name="price"
                        placeholder="Price"
                        type="number"
                        value={newExpense.price}
                        onChange={handleInputChange}
                        required
                    />
                    <select
                        className="select-option"
                        name="category"
                        value={newExpense.category}
                        onChange={handleInputChange}
                        required
                    >
                    <option value="">Select Category</option>{" "}
                    {categories.map((category, i) => (
                        <option key={i} value={category}>
                        {category}
                        </option>
                    ))}
                    </select>
                    <input
                        name="date"
                        placeholder="Date"
                        type="date"
                        value={newExpense.date}
                        onChange={handleInputChange}
                        required
                    />
                    <div>
                        <button className="glassmorphismButton" type="submit">
                        Add Expense
                        </button>
                        <button
                            className="glassmorphismButton" 
                            type="button"
                            onClick={() => setIsExpenseModalOpen(false)}
                        >
                        Cancel
                        </button>
                    </div>
                </form>
            </Modal>
            </div>
            {(expenses.length > 0) &&
                (<div className="dashboard-info-container">
                    <ExpenseTable
                        expenseData={expenses}
                        handleExpenseListUpdate={handleExpenseListUpdate}
                        categories={categories}
                    />
                    <LinebarChart data={expenses} categories={categories} />
                </div>
                )
            }
        </div>
        </div>
    );

}