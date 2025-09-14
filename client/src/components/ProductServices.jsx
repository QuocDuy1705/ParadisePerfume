import "../assets/styles/ProductServices.css";

const ProductServices = () => {
  return (
    <section className="product-services">
      <div className="service-item">
        <img src="/icons/shipping.svg" alt="Free Shipping" />
        <p>Free Standard Shipping</p>
      </div>
      <div className="service-item">
        <img src="/icons/return.svg" alt="Easy Returns" />
        <p>Complimentary Returns</p>
      </div>
      <div className="service-item">
        <img src="/icons/gift.svg" alt="Gift Wrap" />
        <p>Luxury Gift Wrapping</p>
      </div>
    </section>
  );
};

export default ProductServices;
