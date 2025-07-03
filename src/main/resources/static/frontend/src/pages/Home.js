import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import HomeCarousel from "../components/HomeCarousel";

const Home = () => {
  return (
    <div
      style={{
        position: "relative",
        minHeight: "100vh",
        backgroundImage: "url('/fondo.jpeg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Overlay oscuro menos transparente para atenuar fondo */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(255, 255, 255, 0.95)", // menos transparente (casi sólido)
          zIndex: 0,
        }}
      ></div>

      {/* Contenido principal */}
      <main
        style={{
          position: "relative",
          zIndex: 1,
          fontFamily: "Arial, sans-serif",
          lineHeight: "1.6",
          color: "#333",
          paddingBottom: "3rem",
        }}
      >
        {/* SOBRE NOSOTROS */}
        <section
          style={{
            padding: "4rem 2rem",
            maxWidth: "1100px",
            margin: "2rem auto",
            backgroundColor: "#fff",
            borderRadius: "12px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
          }}
        >
          <h2
            style={{
              fontSize: "2.5rem",
              marginBottom: "1rem",
              textAlign: "center",
            }}
          >
            Conocé Nuestra Historia
          </h2>
          <hr
            style={{
              width: "60px",
              border: "2px solid #007bff",
              margin: "1rem auto 2.5rem",
            }}
          />

          <div
            style={{
              display: "flex",
              flexDirection: "row",
              gap: "2rem",
              flexWrap: "wrap",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {/* TEXTO */}
            <div style={{ flex: "1 1 400px", minWidth: "300px" }}>
              <p style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>
                En <strong>BobElAlquilador</strong>, nos dedicamos con pasión al
                alquiler de maquinaria pesada desde 1995. Con raíces en La Plata,
                Argentina, hemos crecido hasta tener presencia internacional en más
                de 30 países.
              </p>
              <p style={{ fontSize: "1.1rem" }}>
                Nuestro compromiso con la excelencia, la seguridad y la innovación
                nos ha convertido en el socio preferido de empresas constructoras
                alrededor del mundo. Ya sea una retroexcavadora en Buenos Aires o
                una grúa en Berlín, tenemos la solución.
              </p>
            </div>

            {/* IMAGEN DECORATIVA */}
            <div
              style={{
                flex: "1 1 400px",
                minWidth: "300px",
                textAlign: "center",
              }}
            >
              <img
                src="/GRUA.jpg"
                alt="Maquinaria"
                style={{
                  width: "100%",
                  maxWidth: "450px",
                  height: "auto",
                  borderRadius: "10px",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                }}
              />
            </div>
          </div>
        </section>

        {/* CARRUSEL */}
        <section
          style={{
            padding: "2rem 1rem",
            backgroundColor: "#fff",
            borderRadius: "12px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
            maxWidth: "1100px",
            margin: "2rem auto",
          }}
        >
          <HomeCarousel />
        </section>

        {/* VIDEO */}
        <section
          style={{
            padding: "4rem 2rem",
            maxWidth: "1100px",
            margin: "2rem auto 3rem",
            backgroundColor: "#fff",
            borderRadius: "12px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
            textAlign: "center",
          }}
        >
          <h2 style={{ fontSize: "2rem", marginBottom: "1rem" }}>Conocé Más</h2>
          <div style={{ maxWidth: "960px", margin: "0 auto" }}>
            <iframe
              width="100%"
              height="540"
              src="https://www.youtube.com/embed/lKn4FeL1cxg"
              title="YouTube video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ border: "none", borderRadius: "8px" }}
            ></iframe>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
