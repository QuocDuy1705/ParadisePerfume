import { Link } from "react-router-dom";
import "../assets/styles/hero.css";

const Hero = () => {
  return (
    <section className="hero-section">
      <div className="hero-content">
        <h1>PARADISE</h1>
        <p>
          Tinh hoa của sự thanh lịch vượt thời gian. Khám phá những hương thơm
          định nghĩa sự sang trọng và tinh tế.
        </p>
        <Link to="/products">
          <button className="hero-button">KHÁM PHÁ BỘ SƯU TẬP</button>
        </Link>
      </div>
    </section>
  );
};

export default Hero;
