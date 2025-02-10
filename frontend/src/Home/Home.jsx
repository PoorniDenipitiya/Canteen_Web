import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import { Carousel } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Home.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import bakery1 from "../Assets/bakery.jpg";
import bakery2 from "../Assets/bakery1.jpeg";
import beverages from "../Assets/beverages.jpeg";
import burger from "../Assets/burger.jpeg";
import cake from "../Assets/cake.jpeg";
import pizza from "../Assets/pizza.jpeg";
import crape from "../Assets/crape.jpeg";
import pizza1 from "../Assets/pizza1.jpeg";
import sandwitch from "../Assets/sandwitch.jpeg";
import HomeCanteenMenu from "./HomeCanteenMenu";

function Home() {
  const navigate = useNavigate();
  const [cookies, removeCookie] = useCookies([]);
  const [username, setUsername] = useState("");
  const [selectedCanteen, setSelectedCanteen] = useState(null);

  useEffect(() => {
    const verifyCookie = async () => {
      if (!cookies.token) {
        navigate("/login");
      }
      try {
        const { data } = await axios.post(
          'http://localhost:3002/verify-cookie',
          {},
          { withCredentials: true }
        );
        const { status, user } = data;
        setUsername(user);
        if (status) {
          toast(`Hello ${user}`, {
            position: "top-right",
          });
        } else {
          removeCookie("token");
          navigate("/login");
        }
      } catch (error) {
        console.error("Network Error", error);
        removeCookie("token");
        navigate("/login");
      }
    };
    verifyCookie();
  }, [cookies, navigate, removeCookie]);



  const handleCanteenClick = (canteen) => {
    setSelectedCanteen(canteen);
  };

  const renderMenu = () => {
    if (!selectedCanteen) {
      return <p>Please select a canteen to see today's menu.</p>;
    }

    const menu = {
      "Canteen 1": ["Item 1", "Item 2", "Item 3"],
      "Canteen 2": ["Item A", "Item B", "Item C"],
      "Canteen 3": ["Item X", "Item Y", "Item Z"],
      "Canteen 4": ["Item M", "Item N", "Item O"],
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
    <>
    

      <div>
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
          <h1 style={{ marginTop: "50px", marginBottom: "30px" }}>
        Canteens
          </h1>
        </center>
        <div className="box-container">
          <div className="box" onClick={() => handleCanteenClick("Canteen 1")}>
            <div className="box-text">Goda Goda Canteen</div>
            <img src={bakery1} alt="Canteen 1" className="box-img" />
          </div>
          <div className="box" onClick={() => handleCanteenClick("Canteen 2")}>
            <div className="box-text">Goda Yata Canteen</div>
            <img src={bakery2} alt="Canteen 2" className="box-img" />
          </div>
          <div className="box" onClick={() => handleCanteenClick("Canteen 3")}>
            <div className="box-text">Wala Canteen</div>
            <img src={beverages} alt="Canteen 3" className="box-img" />
          </div>
          <div className="box" onClick={() => handleCanteenClick("Canteen 4")}>
            <div className="box-text">Sentra Court</div>
            <img src={burger} alt="Canteen 4" className="box-img" />
          </div>
          <div className="box" onClick={() => handleCanteenClick("Canteen 4")}>
            <div className="box-text">L Canteen</div>
            <img src={burger} alt="Canteen 4" className="box-img" />
          </div>
          <div className="box" onClick={() => handleCanteenClick("Canteen 4")}>
            <div className="box-text">Civil Canteen</div>
            <img src={burger} alt="Canteen 4" className="box-img" />
          </div>

        </div>
        {renderMenu()}
      </div>
      <ToastContainer />
    </>
  );
}

export default Home;