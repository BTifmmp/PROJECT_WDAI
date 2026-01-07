import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-body border-top py-4 mt-auto">
      <Container>
        <Row className="gy-4">
          <Col xs={12} md={4}>
            <h5>ShopShop</h5>
            <p className="small text-secondary">
              Your one-stop shop for the latest trends.
            </p>
          </Col>

          <Col xs={6} md={4}>
            <h6>Quick Links</h6>
            <ul className="list-unstyled small">
              <li><Link to="/" className="text-secondary text-decoration-none">Home</Link></li>
              <li><Link to="/products" className="text-secondary text-decoration-none">All Products</Link></li>
              <li><Link to="/cart" className="text-secondary text-decoration-none">Cart</Link></li>
            </ul>
          </Col>
        </Row>

        <hr className="bg-secondary" />

        <Row>
          <Col className="text-center small text-secondary">
            &copy; {currentYear} ShopShop. All rights reserved.
          </Col>
        </Row>
      </Container>
    </footer>
  );
}