import React from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { useLocation } from "react-router";

const NavBar: React.FC = () => {
  const location = useLocation();
  return (
    <>
      <Navbar
        collapseOnSelect
        expand="lg"
        className="bg-body-tertiary fixed-top"
      >
        <Container>
          <Navbar.Brand href="/">Budget Buddy</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link
                href="/dashboard"
                className={location.pathname === "/dashboard" ? "fw-bold" : ""}
              >
                Dashboard
              </Nav.Link>
              <Nav.Link
                href="/"
                className={location.pathname === "/" ? "fw-bold" : ""}
              >
                New Transaction
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default NavBar;
