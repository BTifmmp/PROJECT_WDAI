import React from 'react';
import { Card, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star } from 'lucide-react';
import { apiFetch } from '../../api/api';

interface ProductProps {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
}

export default function ProductCard({ id, title, price, description, category, image }: ProductProps) {
  
const handleAddToCart = async (e: React.MouseEvent) => {
  e.preventDefault();
  e.stopPropagation();

  await apiFetch('/cart/add', {
    method: 'POST',
    body: JSON.stringify({ // 2. Turn the object into a string
      product_id: id, 
      quantity: 1
    })
  });
};

  return (
    <Link to={`/product/${id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <Card 
        className="h-100 overflow-hidden" 
        style={{ 
          borderRadius: '16px', 
          border: '1px solid #eee',
          backgroundColor: '#fff',
          transition: 'all 0.2s ease',
          cursor: 'pointer',
          boxShadow: 'none'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = '#0d6efd';
          e.currentTarget.style.backgroundColor = '#fafafa';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = '#eee';
          e.currentTarget.style.backgroundColor = '#fff';
        }}
      >
        <div className="position-relative">
          {/* Flat Category Tag */}
          <div 
            className="position-absolute top-0 start-0 m-3 px-2 py-1 fw-bold text-uppercase"
            style={{ 
              fontSize: '0.65rem', 
              backgroundColor: '#f8f9fa', 
              border: '1px solid #ddd',
              borderRadius: '4px',
              letterSpacing: '0.5px',
              zIndex: 2 
            }}
          >
            {category}
          </div>
          
          <div className="p-4 d-flex align-items-center justify-content-center" style={{ height: '220px', backgroundColor: '#fff' }}>
            <Card.Img 
              variant="top" 
              src={image} 
              style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} 
            />
          </div>
        </div>

        <Card.Body className="d-flex flex-column px-4 pb-4">
          {/* Availability Indicator */}
          <div className="d-flex align-items-center gap-2 mb-2">
            <span style={{ height: '8px', width: '8px', backgroundColor: '#2ecc71', borderRadius: '50%', display: 'inline-block' }}></span>
            <span className="text-uppercase fw-bold text-muted" style={{ fontSize: '0.6rem', letterSpacing: '1px' }}>Available</span>
          </div>

          <Card.Title className="fs-6 fw-bold mb-1 text-truncate text-start" style={{ color: '#111' }}>
            {title}
          </Card.Title>
          
          <div className="fs-4 fw-bold mb-3" style={{ color: '#111' }}>
            ${price.toFixed(2)}
          </div>

          <Card.Text 
            className="text-muted small mb-4" 
            style={{ 
              display: '-webkit-box', 
              WebkitLineClamp: 2, 
              WebkitBoxOrient: 'vertical', 
              overflow: 'hidden',
              fontSize: '0.85rem',
              lineHeight: '1.4'
            }}
          >
            {description}
          </Card.Text>

          <Button 
            onClick={handleAddToCart}
            variant="dark" 
            className="w-100 py-2 rounded-3 fw-bold d-flex align-items-center justify-content-center gap-2"
            style={{ 
              fontSize: '0.9rem',
              border: 'none',
              borderRadius: '8px' // Matching the modern flat aesthetic
            }}
          >
            <ShoppingCart size={16} /> Add to Cart
          </Button>
        </Card.Body>
      </Card>
    </Link>
  );
}