import React, { useState } from 'react';
import { menuData } from '../Home/HomeCanteenMenu';
import './Order.css';
import cake from '../Assets/cake.jpeg'; // Ensure the correct path to the default image

const Order = () => {
    const [selectedCanteen, setSelectedCanteen] = useState('Canteen 1');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    const handleCanteenChange = (event) => {
        setSelectedCanteen(event.target.value);
    };

    const handleCategoryChange = (event) => {
        setSelectedCategory(event.target.value);
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredMenu = menuData[selectedCanteen].filter(item => {
        return (selectedCategory === 'All' || item.category === selectedCategory) &&
               item.name.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
        <div className="order-container">
            <div className="sidebar">
                <div className="search-container">
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                </div>
                <div className="canteen-filter">
                    <label htmlFor="canteen">Select Canteen: </label>
                    <select id="canteen" value={selectedCanteen} onChange={handleCanteenChange}>
                        <option value="Canteen 1">Canteen 1</option>
                        <option value="Canteen 2">Canteen 2</option>
                        <option value="Canteen 3">Canteen 3</option>
                        <option value="Canteen 4">Canteen 4</option>
                    </select>
                </div>
                <div className="category-filter">
                    <label htmlFor="category">Select Category: </label>
                    <select id="category" value={selectedCategory} onChange={handleCategoryChange}>
                        <option value="All">All</option>
                        <option value="Beverages">Beverages</option>
                        <option value="Food">Food</option>
                        <option value="Dessert">Dessert</option>
                        <option value="Bakery Items">Bakery Items</option>
                        <option value="Pharmacy Items">Pharmacy Items</option>
                        <option value="Stationary Items">Stationary Items</option>
                    </select>
                </div>
            </div>
            <div className="menu-section">
                <div className="card-container">
                    {filteredMenu.map((item, index) => (
                        <div className="card" key={index}>
                            <div className="card-icons">
                                <i className="fas fa-heart heart-icon"></i>
                                <i className="fas fa-cart-plus cart-icon"></i>
                            </div>
                            <img src={ cake} alt={item.name} className="card-image" />
                            <div className="card-content">
                                <h3>{item.name}</h3>
                                <p>{item.category}</p>
                                <p>{item.price}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Order;