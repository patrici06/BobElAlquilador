import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { getRolesFromJwt } from '../utils/getUserRolesFromJwt';

function NavBar() {
    const navigate = useNavigate();
    const token = sessionStorage.getItem('token');
    const roles = getRolesFromJwt();
    const isAuthenticated = !!token;
    const isCliente = roles.includes('ROLE_CLIENTE');
    const isEmpleado = roles.includes('ROLE_EMPLEADO');

    const handleLogout = () => {
        sessionStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <Navbar bg="dark" variant="dark" expand="lg">
            <Container>
                <Navbar.Brand as={Link} to="/">Bob El Alquilador</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/">Inicio</Nav.Link>
                        {isCliente && (
                            <>
                                <Nav.Link as={Link} to="/consultas">Nueva Consulta</Nav.Link>
                            </>
                        )}
                    </Nav>
                    <Nav>
                        {!isAuthenticated ? (
                            <>
                                <Nav.Link as={Link} to="/login">Iniciar Sesión</Nav.Link>
                                <Nav.Link as={Link} to="/register">Registrarse</Nav.Link>
                            </>
                        ) : (
                            <Nav.Link onClick={handleLogout}>Cerrar Sesión</Nav.Link>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default NavBar; 