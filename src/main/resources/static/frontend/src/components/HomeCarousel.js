import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const images = [
  "/GRUA.jpg",
  "/GRUA.jpg",
  "/GRUA.jpg",
];

const settings = {
  dots: true,
  infinite: true,
  speed: 600,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 4000,
  arrows: true,
};

const HomeCarousel = () => (
  <div style={{ maxWidth: "800px", margin: "0 auto", borderRadius: "10px" }}>
    <Slider {...settings}>
      {images.map((img, index) => (
        <div key={index}>
          <img
            src={img}
            alt={`Maquinaria ${index + 1}`}
            style={{
              width: "100%",
              height: "400px",
              objectFit: "cover",
              display: "block",
              borderRadius: "10px"
            }}
          />
        </div>
      ))}
    </Slider>
  </div>
);

export default HomeCarousel;