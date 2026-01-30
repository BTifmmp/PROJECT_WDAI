import React, { useEffect, useState } from "react";
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
import { apiFetch } from "../../api/api";

export default function Header() {
  const auth = useAuth();
  const navigate = useNavigate();

    const [cartItemsCount, setCartItemsCount] = useState<number>(0);
  
    useEffect(() => {
      const loadCart = async () => {
        try {
        const data = await apiFetch("/cart/");
        console.log("CART RESPONSE:", data);
  
        if (!data) {
          setCartItemsCount(0);
          return;
        }
  
        if (Array.isArray(data.items)) {
          setCartItemsCount(data.items.length);
        } else if (Array.isArray(data)) {
          setCartItemsCount(data.length);
        } else {
          setCartItemsCount(0);
        }
        } catch (err) {
        console.error("CART FETCH CRASHED:", err);
        setCartItemsCount(0);
        }
      };
  
      loadCart();
    }, []);

        const [notificationsCount, setNotificationsCount] = useState<number>(0);
  
    useEffect(() => {
      const loadNotifications = async () => {
        try {
        const data = await apiFetch("/notifications/");
  
        if (!data) {
          setNotificationsCount(0);
          return;
        }
  
if (Array.isArray(data.items)) {
    // Liczymy tylko te, gdzie is_read jest false
    console.log("CART ITEMS:", data.items);
    const count = data.items.reduce((acc:any, n:any) => !n.is_read ? acc + 1 : acc, 0);
    setNotificationsCount(count);
} else if (Array.isArray(data)) {
    // To samo dla bezpośredniej tablicy
    const count = data.reduce((acc, n) => !n.is_read ? acc + 1 : acc, 0);
    setNotificationsCount(count);
} else {
    setNotificationsCount(0);
}
        } catch (err) {
        console.error("NOTIFICATIONS FETCH CRASHED:", err);
        setNotificationsCount(0);
        }
      };
  
      loadNotifications();
    }, []);

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
                  {notificationsCount > 0 && (
                    <Badge
                      pill
                      bg="danger"
                      className="position-absolute top-0 start-100 translate-middle border border-white"
                      style={{ fontSize: "0.6rem", padding: "0.35em 0.5em" }}>
                      {notificationsCount}
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
                  {cartItemsCount > 0 && (
                    <Badge
                      pill
                      bg="primary"
                      className="position-absolute top-0 start-100 translate-middle border border-white"
                      style={{ fontSize: "0.6rem", padding: "0.35em 0.5em" }}>
                      {cartItemsCount}
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
                  <NavDropdown.Item as={Link} to="/my-orders">My Orders</NavDropdown.Item>
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
