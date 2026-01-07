import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Form, Spinner, Badge, Card } from 'react-bootstrap';
import { ShoppingCart, ArrowLeft, Star, MessageSquare, Send } from 'lucide-react';

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  
  const [reviews, setReviews] = useState([
    { id: 1, user: "Jan Kowalski", rating: 5, comment: "Świetna jakość!", date: "2025-12-01" }
  ]);
  const [newReview, setNewReview] = useState({ user: '', comment: '', rating: 5 });

  useEffect(() => {
    fetch(`https://fakestoreapi.com/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    const reviewToAdd = {
      id: Date.now(),
      user: newReview.user || "Anonim",
      rating: newReview.rating,
      comment: newReview.comment,
      date: new Date().toISOString().split('T')[0] || ""
    };
    setReviews([reviewToAdd, ...reviews]);
    setNewReview({ user: '', comment: '', rating: 5 });
  };

  if (loading) return <Container className="py-5 text-center"><Spinner animation="border" variant="dark" /></Container>;
  if (!product) return <Container className="py-5">Product not found.</Container>;

  return (
    <Container className="py-5">
      {/* Back Button */}
      <Button variant="link" onClick={() => navigate(-1)} className="text-dark ps-0 mb-5 d-flex align-items-center gap-2 text-decoration-none fw-bold">
        <ArrowLeft size={18} /> BACK TO SHOP
      </Button>

      {/* TOP PART: IMAGE (LEFT) AND INFO (RIGHT-ALIGNED) */}
      <Row className="gx-5 mb-5 align-items-center">
        {/* IMAGE */}
        <Col lg={6}>
          <div className="p-4 rounded-4 border d-flex align-items-center justify-content-center bg-white" style={{ minHeight: '450px' }}>
            <img src={product.image} alt={product.title} className="img-fluid" style={{ maxHeight: '380px', objectFit: 'contain' }} />
          </div>
        </Col>

        {/* INFO (Aligned to the right side of this column) */}
        <Col lg={6} className="text-start">
          <div className="d-flex align-items-center justify-content-start gap-2 mb-3">
            <span className="text-uppercase fw-bold text-success" style={{ fontSize: '0.75rem', letterSpacing: '1px' }}>
               12 AVAILABLE IN STOCK
            </span>
            <span style={{ height: '8px', width: '8px', backgroundColor: '#2ecc71', borderRadius: '50%' }}></span>
          </div>

          <Badge bg="white" className="text-dark border px-3 py-2 rounded-2 mb-3 text-capitalize fw-semibold">
            {product.category}
          </Badge>
          
          <h1 className="fw-bold mb-3" style={{ fontSize: '2.5rem', letterSpacing: '-0.5px' }}>{product.title}</h1>
          
          <div className="d-flex align-items-center justify-content-start gap-2 mb-4">
            <span className="text-muted small fw-medium">({reviews.length} Customer Reviews)</span>
            <div className="text-warning d-flex">
              {[...Array(5)].map((_, i) => <Star key={i} size={16} fill={i < 4 ? "currentColor" : "none"} className={i < 4 ? "" : "text-muted"} />)}
            </div>
          </div>

          <h2 className="fw-bold mb-5" style={{ fontSize: '3rem' }}>${product.price.toFixed(2)}</h2>

          {/* Buy Section */}
          <div className="d-flex gap-3 align-items-end justify-content-start">
            <Form.Group style={{ width: '100px' }}>
              <Form.Label className="small fw-bold text-muted text-uppercase d-block text-start" style={{ fontSize: '0.65rem' }}>Qty</Form.Label>
              <Form.Control 
                type="number" min="1" value={quantity} 
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value)))}
                className="py-2 border-2 text-center"
                style={{ borderRadius: '8px' }}
              />
            </Form.Group>
            
            <Button 
              variant="dark" 
              className="px-5 py-2 fw-bold d-flex align-items-center justify-content-center gap-2"
              style={{ height: '48px', borderRadius: '8px', backgroundColor: '#111', minWidth: '200px' }}
            >
              ADD TO CART <ShoppingCart size={20} />
            </Button>
          </div>
        </Col>
      </Row>

      {/* DESCRIPTION BELOW THE MAIN PART */}
      <hr className="my-5" />
      <Row className="mb-5">
        <Col lg={12}>
          <h4 className="fw-bold mb-4 text-uppercase" style={{ fontSize: '0.9rem', letterSpacing: '1px' }}>Description</h4>
          <p className="text-secondary fs-5" style={{ lineHeight: '1.8' }}>{product.description}</p>
        </Col>
      </Row>

      {/* REVIEWS SECTION */}
      <Row className="pt-4 justify-content-start"> {/* Change to justify-content-center to center the whole section */}
        <Col lg={7}> {/* Reduced from 12 to 7 to make it much more compact */}
          <h4 className="fw-bold mb-4 d-flex align-items-center gap-2 text-uppercase" style={{ fontSize: '0.85rem', letterSpacing: '1px' }}>
            <MessageSquare size={18} /> Reviews ({reviews.length})
          </h4>

          {/* Opinion Form - More compact padding */}
          <Card className="mb-5 border-0 bg-light" style={{ borderRadius: '12px' }}>
            <Card.Body className="p-3"> {/* Reduced padding from p-4 to p-3 */}
              <h6 className="fw-bold mb-3 small">Add your opinion</h6>
              <Form onSubmit={handleAddReview}>
                <Row className="g-2"> {/* Tighter gutters */}
                  <Col md={4}>
                    <Form.Select 
                      size="sm" // Smaller inputs
                      className="border-0 shadow-none"
                      value={newReview.rating}
                      onChange={(e) => setNewReview({...newReview, rating: parseInt(e.target.value)})}
                    >
                      {[5,4,3,2,1].map(num => <option key={num} value={num}>{num} Stars</option>)}
                    </Form.Select>
                  </Col>
                  <Col md={8}>
                    <Form.Control 
                      size="sm"
                      placeholder="Your Name" 
                      value={newReview.user}
                      onChange={(e) => setNewReview({...newReview, user: e.target.value})}
                      required 
                      className="border-0 shadow-none"
                    />
                  </Col>
                  <Col xs={12}>
                    <Form.Control 
                      size="sm"
                      as="textarea" rows={2} placeholder="Write a comment..." 
                      value={newReview.comment}
                      onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                      required
                      className="border-0 shadow-none"
                    />
                  </Col>
                  <Col xs={12} className="text-end">
                    <Button type="submit" variant="dark" size="sm" className="fw-bold px-3 py-1 rounded-2 d-flex align-items-center gap-2 ms-auto">
                      Post <Send size={14} />
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>

          {/* List of Reviews - Simplified list style */}
          <div className="d-flex flex-column gap-3">
            {reviews.map(review => (
              <div key={review.id} className="pb-3 border-bottom border-light">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <div className="fw-bold small">{review.user}</div>
                  <small className="text-muted" style={{ fontSize: '0.7rem' }}>{review.date}</small>
                </div>
                <div className="text-warning mb-1 d-flex gap-1">
                  {[...Array(review.rating)].map((_, i) => <Star key={i} size={10} fill="currentColor" />)}
                </div>
                <p className="text-muted mb-0" style={{ fontSize: '0.85rem' }}>{review.comment}</p>
              </div>
            ))}
          </div>
        </Col>
      </Row>
    </Container>
  );
}