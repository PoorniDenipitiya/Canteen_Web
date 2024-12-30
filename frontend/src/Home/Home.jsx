import React, {useState} from "react";
import { Carousel } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Home.css';
import { Link } from 'react-router-dom';
import bakery1 from '../Assets/bakery.jpg';
import bakery2 from '../Assets/bakery1.jpeg';
import beverages from '../Assets/beverages.jpeg';
import burger from '../Assets/burger.jpeg';
import cake from '../Assets/cake.jpeg';
import pizza from '../Assets/pizza.jpeg';
import crape from '../Assets/crape.jpeg';
import pizza1 from '../Assets/pizza1.jpeg';
import sandwitch from '../Assets/sandwitch.jpeg';
import HomeCanteenMenu from './HomeCanteenMenu';

function Home() {
    const [selectedCanteen, setSelectedCanteen] = useState(null);

    const handleCanteenClick = (canteen) => {
        setSelectedCanteen(canteen);
    };

    const renderMenu = () => {
        if (!selectedCanteen) {
            return <p>Please select a canteen to see today's menu.</p>;
        }

        // Replace this with actual menu data for each canteen
        const menu = {
            "Canteen 1": ["Item 1", "Item 2", "Item 3"],
            "Canteen 2": ["Item A", "Item B", "Item C"],
            "Canteen 3": ["Item X", "Item Y", "Item Z"],
            "Canteen 4": ["Item M", "Item N", "Item O"]
        };

        return (
            <div>
                <h2>{selectedCanteen} - Today's Menu</h2>
                <ul>
                    {menu[selectedCanteen].map((item, index) => (
                        <li key={index}>{item}</li>
                    ))}
                </ul>
            </div>
        );
    };

    return (
        <div>
          { /* <center>
                <h1>This is Home Component</h1>
            </center>*/}
            <Carousel interval={3000}>
                <Carousel.Item>
                    <img
                        className="d-block w-100 custom-carousel-img"
                        src={bakery1}
                        alt="Slide"
                    />
                    <Carousel.Caption>
                        <h3>First slide label</h3>
                        <p>Sample Description</p>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <img
                        className="d-block w-100 custom-carousel-img"
                        src={bakery2}
                        alt="Slide"
                    />
                    <Carousel.Caption>
                        <h3>Second slide label</h3>
                        <p>Sample Description</p>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <img
                        className="d-block w-100 custom-carousel-img"
                        src={beverages}
                        alt="Slide"
                    />
                    <Carousel.Caption>
                        <h3>Second slide label</h3>
                        <p>Sample Description</p>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <img
                        className="d-block w-100 custom-carousel-img"
                        src={burger}
                        alt="Slide"
                    />
                    <Carousel.Caption>
                        <h3>Second slide label</h3>
                        <p>Sample Description</p>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <img
                        className="d-block w-100 custom-carousel-img"
                        src={cake}
                        alt="Slide"
                    />
                    <Carousel.Caption>
                        <h3>Second slide label</h3>
                        <p>Sample Description</p>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <img
                        className="d-block w-100 custom-carousel-img"
                        src={crape}
                        alt="Slide"
                    />
                    <Carousel.Caption>
                        <h3>Second slide label</h3>
                        <p>Sample Description</p>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <img
                        className="d-block w-100 custom-carousel-img"
                        src={pizza}
                        alt="Slide"
                    />
                    <Carousel.Caption>
                        <h3>Second slide label</h3>
                        <p>Sample Description</p>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <img
                        className="d-block w-100 custom-carousel-img"
                        src={pizza1}
                        alt="Slide"
                    />
                    <Carousel.Caption>
                        <h3>Second slide label</h3>
                        <p>Sample Description</p>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <img
                        className="d-block w-100 custom-carousel-img"
                        src={sandwitch}
                        alt="Slide"
                    />
                    <Carousel.Caption>
                        <h3>Second slide label</h3>
                        <p>Sample Description</p>
                    </Carousel.Caption>
                </Carousel.Item>
            </Carousel>

         
            <center>
                <h1 style={{ marginTop: '50px', marginBottom: '30px' }}>Top Canteens</h1>
            </center>
            <div className="box-container">
                <div className="box" onClick={() => handleCanteenClick("Canteen 1")}>
                    <div className="box-text">Canteen 1</div>
                    <img src={bakery1} alt="Canteen 1" className="box-img" />
                </div>
                <div className="box" onClick={() => handleCanteenClick("Canteen 2")}>
                    <div className="box-text">Canteen 2</div>
                    <img src={bakery2} alt="Canteen 2" className="box-img" />
                </div>
                <div className="box" onClick={() => handleCanteenClick("Canteen 3")}>
                    <div className="box-text">Canteen 3</div>
                    <img src={beverages} alt="Canteen 3" className="box-img" />
                </div>
                <div className="box" onClick={() => handleCanteenClick("Canteen 4")}>
                    <div className="box-text">Canteen 4</div>
                    <img src={burger} alt="Canteen 4" className="box-img" />
                </div>
            </div>
            <HomeCanteenMenu selectedCanteen={selectedCanteen} />
        </div>
    );
}

export default Home;