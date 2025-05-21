import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

function Register() {
    return (
        <div style={{ paddingBottom: "3rem" }}>
            <Header />
            <main style={{ padding: "2rem" }}>
                <h1>Register</h1>
                {/* Aquí va tu formulario de registro */}
            </main>
            <Footer />
        </div>
    );
}

export default Register;