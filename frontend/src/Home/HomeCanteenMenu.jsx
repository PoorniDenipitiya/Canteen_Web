import React, { useState } from 'react';
import './HomeCanteenMenu.css';

const HomeCanteenMenu = ({ selectedCanteen }) => {
    const [selectedCategory, setSelectedCategory] = useState('All');

    const handleCategoryChange = (event) => {
        setSelectedCategory(event.target.value);
    };

    const renderMenu = () => {
        if (!selectedCanteen) {
            return <p className="menu-message">Please select a canteen to see today's menu.</p>;
        }

        // Replace this with actual menu data for each canteen
        const menu = {
            "Canteen 1": [
                { category: 'Beverages', name: 'Item 1', price: 'Rs.200.00' },
                { category: 'Food', name: 'Item 2', price: 'Rs.200.00' },
                { category: 'Dessert', name: 'Item 3', price: 'Rs.200.00' },
                { category: 'Bakery Items', name: 'Item 4', price: 'Rs.200.00' },
                { category: 'Pharmacy Items', name: 'Item 5', price: 'Rs.200.00' },
                { category: 'Stationary Items', name: 'Item 6', price: 'Rs.200.00' }
            ],
            "Canteen 2": [
                { category: 'Beverages', name: 'Item A', price: 'Rs.200.00' },
                { category: 'Food', name: 'Item B', price: 'Rs.200.00' },
                { category: 'Dessert', name: 'Item C', price: 'Rs.200.00' },
                { category: 'Bakery Items', name: 'Item D', price: 'Rs.200.00' },
                { category: 'Pharmacy Items', name: 'Item E', price: 'Rs.200.00' },
                { category: 'Stationary Items', name: 'Item F', price: 'Rs.200.00' }
            ],
            "Canteen 3": [
                { category: 'Beverages', name: 'Item S', price: 'Rs.200.00' },
                { category: 'Food', name: 'Item T', price: 'Rs.200.00' },
                { category: 'Dessert', name: 'Item U', price: 'Rs.200.00' },
                { category: 'Bakery Items', name: 'Item V', price: 'Rs.200.00' },
                { category: 'Pharmacy Items', name: 'Item W', price: 'Rs.200.00' },
                { category: 'Stationary Items', name: 'Item X', price: 'Rs.200.00' }
            ],
            "Canteen 4": [
                { category: 'Beverages', name: 'Item M', price: 'Rs.200.00' },
                { category: 'Food', name: 'Item N', price: 'Rs.200.00' },
                { category: 'Dessert', name: 'Item O', price: 'Rs.200.00' },
                { category: 'Bakery Items', name: 'Item P', price: 'Rs.200.00' },
                { category: 'Pharmacy Items', name: 'Item Q', price: 'Rs.200.00' },
                { category: 'Stationary Items', name: 'Item R', price: 'Rs.200.00' }
            ]
        };

        const filteredMenu = selectedCategory === 'All'
            ? menu[selectedCanteen]
            : menu[selectedCanteen]?.filter(item => item.category === selectedCategory);

        if (!filteredMenu) {
            return <p className="menu-message">No menu available for the selected canteen.</p>;
        }

        return (
            <div className="menu-section">
                <h2 className="canteen-name">{selectedCanteen} - Today's Menu</h2>
                <div className="filter-container">
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
                <table className="menu-table">
                    <thead>
                        <tr>
                            <th>Category</th>
                            <th>Item</th>
                            <th>Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredMenu.map((item, index) => (
                            <tr key={index}>
                                <td>{item.category}</td>
                                <td>{item.name}</td>
                                <td>{item.price}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <div className="menu-container">
            {renderMenu()}
        </div>
    );
};

export default HomeCanteenMenu;