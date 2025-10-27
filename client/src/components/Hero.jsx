import { Link } from "react-router-dom";
import "../assets/styles/hero.css";

const Hero = () => {
  return (
    <section className="hero-section">
      <div className="hero-content">
        <h1>PARADISE</h1>
        <p>
          The essence of timeless elegance. Discover fragrances that define
          luxury and sophistication.
        </p>
        <Link to="/products">
          <button className="hero-button">EXPLORE COLLECTION</button>
        </Link>
      </div>
    </section>
  );
};

export default Hero;
