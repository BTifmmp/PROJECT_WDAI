import React from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import { ShoppingCart, User, Bell, PackageSearch, LogIn } from "lucide-react";

export default function Header() {
  const auth = useAuth();
  const navigate = useNavigate();

  // --- MOCK DATA ---
  const cartItemCount = 3;
  const notificationCount = 5;

  return (
    <Navbar expand="lg" className="bg-white border-bottom py-3 mb-4 sticky-top">
      <Container>
        {/* Logo */}
        <Navbar.Brand
          as={Link as any}
          to="/"
          className="fw-bold d-flex align-items-center gap-2">
          <PackageSearch size={28} className="text-primary" />
          <span style={{ letterSpacing: "-1px", fontSize: "1.5rem" }}>
            ShopShop
          </span>
        </Navbar.Brand>

        <Navbar.Toggle
          aria-controls="basic-navbar-nav"
          className="border-0 shadow-none"
        />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <NavDropdown
              className="ms-lg-4"
              title="Products"
              id="basic-nav-dropdown">
              <NavDropdown.Item as={Link} to="/">
                All Products
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item as={Link} to="/products/electronics">
                Electronics
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/products/jewelery">
                Jewelery
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/products/clothing">
                Clothing
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>

          {/* RIGHT SIDE: AUTH CONDITIONAL */}
          <Nav className="d-flex align-items-center gap-3">
            {auth.isAuthenticated ? (
              <>
                {/* 1. Notifications */}
                <Nav.Link
                  as={Link}
                  to="/notifications"
                  className="position-relative p-2">
                  <Bell size={22} strokeWidth={2} className="text-dark" />
                  {notificationCount > 0 && (
                    <Badge
                      pill
                      bg="danger"
                      className="position-absolute top-0 start-100 translate-middle border border-white"
                      style={{ fontSize: "0.6rem", padding: "0.35em 0.5em" }}>
                      {notificationCount}
                    </Badge>
                  )}
                </Nav.Link>

                {/* 2. Cart */}
                <Nav.Link
                  as={Link}
                  to="/cart"
                  className="position-relative p-2">
                  <ShoppingCart
                    size={22}
                    strokeWidth={2}
                    className="text-dark"
                  />
                  {cartItemCount > 0 && (
                    <Badge
                      pill
                      bg="primary"
                      className="position-absolute top-0 start-100 translate-middle border border-white"
                      style={{ fontSize: "0.6rem", padding: "0.35em 0.5em" }}>
                      {cartItemCount}
                    </Badge>
                  )}
                </Nav.Link>

                {/* 3. Account Dropdown */}
                <NavDropdown
                  title={
                    <User size={22} strokeWidth={2} className="text-dark" />
                  }
                  id="account-dropdown"
                  align="end">
                  <NavDropdown.Header className="fw-bold">
                    My Account
                  </NavDropdown.Header>
                  <NavDropdown.Item href="#orders">My Orders</NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item
                    onClick={() => {
                      auth.logout();
                      navigate("/");
                    }}
                    className="text-danger">
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              </>
            ) : (
              /* 4. Login Button (Visible when not logged in) */
              <Button
                variant="dark"
                as={Link as any}
                to="/login"
                className="px-4 d-flex align-items-center gap-2 fw-bold"
                style={{ fontSize: "0.9rem" }}>
                <LogIn size={18} /> Login
              </Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
