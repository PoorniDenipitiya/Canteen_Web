import React from 'react';

const Footer = () => {
    return (
        <footer style={footerStyle} className="fixed-footer">
            <p>© 2024 Canteen Automation System. All rights reserved.</p>
        </footer>
    );
};

const footerStyle = {
    backgroundColor: '#333',
    color: '#fff',
    textAlign: 'center',
    padding: '10px 0',
    position: 'fixed',
    left: '0',
    bottom: '0',
    width: '100%',
    zIndex: 1000
};

export default Footer;