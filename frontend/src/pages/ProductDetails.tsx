import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Form, Spinner, Badge, Card } from 'react-bootstrap';
import { ShoppingCart, ArrowLeft, Star, MessageSquare, Send, Trash2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function ProductDetails() {
  const { token, isAuthenticated, user } = useAuth(); // 'user' może zawierać id zalogowanego
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<any | null>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  
  // Stan dla nowej opinii
  const [newReviewContent, setNewReviewContent] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);

  // 1. Ładowanie danych z API
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        // Pobierz produkt
        const prodRes = await fetch(`http://127.0.0.1:5000/api/products/${id}`);
        const prodData = await prodRes.json();
        setProduct(prodData);

        // Pobierz opinie
        const reviewsRes = await fetch(`http://127.0.0.1:5000/api/products/${id}/reviews`);
        const reviewsData = await reviewsRes.json();
        setReviews(reviewsData);
      } catch (err) {
        console.error("Błąd ładowania danych:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [id]);

  // 2. Dodawanie opinii do bazy
  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) return alert("Musisz się zalogować!");

    try {
      const response = await fetch(`http://127.0.0.1:5000/api/products/${id}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          rating: newReviewRating,
          content: newReviewContent
        })
      });

      if (response.ok) {
        // Odśwież listę opinii po dodaniu
        const freshReviews = await fetch(`http://127.0.0.1:5000/api/products/${id}/reviews`).then(r => r.json());
        setReviews(freshReviews);
        setNewReviewContent('');
        setNewReviewRating(5);
      } else {
        const errData = await response.json();
        alert(errData.msg || "Błąd podczas dodawania opinii");
      }
    } catch (err) {
      alert("Błąd połączenia z serwerem");
    }
  };

  // 3. Usuwanie opinii
  const handleDeleteReview = async (reviewId: number) => {
    if (!window.confirm("Czy na pewno chcesz usunąć tę opinię?")) return;

    try {
      const response = await fetch(`http://127.0.0.1:5000/api/products/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        setReviews(reviews.filter(r => r.id !== reviewId));
      }
    } catch (err) {
      alert("Nie udało się usunąć opinii");
    }
  };

  if (loading) return <Container className="py-5 text-center"><Spinner animation="border" variant="dark" /></Container>;
  if (!product) return <Container className="py-5">Produkt nie został znaleziony.</Container>;

  return (
    <Container className="py-5">
      <Button variant="link" onClick={() => navigate(-1)} className="text-dark ps-0 mb-5 d-flex align-items-center gap-2 text-decoration-none fw-bold">
        <ArrowLeft size={18} /> POWRÓT DO SKLEPU
      </Button>

      <Row className="gx-5 mb-5 align-items-center">
        <Col lg={6}>
          <div className="p-4 rounded-4 border d-flex align-items-center justify-content-center bg-white" style={{ minHeight: '450px' }}>
            <img src={product.image_url} alt={product.name} className="img-fluid" style={{ maxHeight: '380px', objectFit: 'contain' }} />
          </div>
        </Col>

        <Col lg={6} className="text-start">
          <Badge bg="white" className="text-dark border px-3 py-2 rounded-2 mb-3 text-capitalize fw-semibold">
            {product.category}
          </Badge>
          <h1 className="fw-bold mb-3">{product.name}</h1>
          <h2 className="fs-6 mb-5">Available: {product.stock}</h2>
          <h2 className="fw-bold mb-5">${product.price.toFixed(2)}</h2>
          
          <div className="d-flex gap-3 align-items-end">
            <Form.Group style={{ width: '100px' }}>
              <Form.Label className="small fw-bold text-muted">ILOŚĆ</Form.Label>
              <Form.Control type="number" min="1" value={quantity} onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value)))} className="py-2 text-center" />
            </Form.Group>
            <Button variant="dark" className="px-5 py-2 fw-bold d-flex align-items-center gap-2" style={{ height: '48px' }}>
              DODAJ DO KOSZYKA <ShoppingCart size={20} />
            </Button>
          </div>
        </Col>
      </Row>

      <hr className="my-5" />
      <Row className="mb-5">
        <Col lg={12}>
          <h4 className="fw-bold mb-4 text-uppercase small">Opis produktu</h4>
          <p className="text-secondary fs-5">{product.description}</p>
        </Col>
      </Row>

      {/* SEKCJA OPINII */}
      <Row className="pt-4">
        <Col lg={7}>
          <h4 className="fw-bold mb-4 d-flex align-items-center gap-2 text-uppercase small">
            <MessageSquare size={18} /> Opinie ({reviews.length})
          </h4>

          {/* Formularz - tylko dla zalogowanych */}
          {isAuthenticated ? (
            <Card className="mb-5 border-0 bg-light" style={{ borderRadius: '12px' }}>
              <Card.Body className="p-3">
                <Form onSubmit={handleAddReview}>
                  <Row className="g-2">
                    <Col md={4}>
                      <Form.Select size="sm" value={newReviewRating} onChange={(e) => setNewReviewRating(parseInt(e.target.value))}>
                        {[5,4,3,2,1].map(num => <option key={num} value={num}>{num} Gwiazdek</option>)}
                      </Form.Select>
                    </Col>
                    <Col xs={12}>
                      <Form.Control 
                        size="sm" as="textarea" rows={2} placeholder="Twoja opinia..." 
                        value={newReviewContent} onChange={(e) => setNewReviewContent(e.target.value)} required 
                      />
                    </Col>
                    <Col xs={12} className="text-end">
                      <Button type="submit" variant="dark" size="sm" className="fw-bold px-3 py-1">
                        Wyślij <Send size={14} className="ms-1" />
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </Card.Body>
            </Card>
          ) : (
            <div className="alert alert-secondary mb-5 small">Zaloguj się, aby dodać opinię.</div>
          )}

          {/* Lista opinii z bazy */}
          <div className="d-flex flex-column gap-3">
            {reviews.map(review => (
              <div key={review.id} className="pb-3 border-bottom border-light">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <div className="fw-bold small">{review.username}</div>
                  <div className="d-flex align-items-center gap-2">
                    <small className="text-muted" style={{ fontSize: '0.7rem' }}>{review.date}</small>
                    
                    {/* Przycisk usuwania - logiczne sprawdzenie autora */}
                    {isAuthenticated && user?.username === review.username && (
                      <Button variant="link" className="p-0 text-danger" onClick={() => handleDeleteReview(review.id)}>
                        <Trash2 size={14} />
                      </Button>
                    )}
                  </div>
                </div>
                <div className="text-warning mb-1 d-flex gap-1">
                  {[...Array(review.rating)].map((_, i) => <Star key={i} size={10} fill="currentColor" />)}
                </div>
                <p className="text-muted mb-0" style={{ fontSize: '0.85rem' }}>{review.content}</p>
              </div>
            ))}
          </div>
        </Col>
      </Row>
    </Container>
  );
}