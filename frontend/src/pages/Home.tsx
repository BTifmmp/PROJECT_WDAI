import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Spinner, Alert, Form, InputGroup } from 'react-bootstrap';
import { Search, Filter } from 'lucide-react';
import Button from 'react-bootstrap/Button';
import ProductCard from '../components/products/ProductCard'; 

interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // New States for Filtering
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    fetch('https://fakestoreapi.com/products')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch products');
        return res.json();
      })
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Get unique categories from the product list
  const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))];

  // Logic to filter products based on search and category
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" variant="dark" />
        <p className="mt-3 fw-medium">Loading products...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">Error: {error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Row className="mb-5 g-3">
        <Col>
          <h1 className="fw-bold m-0 text-start">Our Products</h1>
        </Col>
        
        {/* Search and Category Controls */}
        <Col md={6}>
          <Row className="g-2">
            <Col sm={7}>
              <InputGroup>
                <InputGroup.Text className="bg-white border-end-0 text-muted">
                  <Search size={18} />
                </InputGroup.Text>
                <Form.Control
                  placeholder="Search products..."
                  className="border-start-0 shadow-none py-2"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </InputGroup>
            </Col>
            
            <Col sm={5}>
              <InputGroup>
                <InputGroup.Text className="bg-white border-end-0 text-muted">
                  <Filter size={18} />
                </InputGroup.Text>
                <Form.Select
                  className="border-start-0 shadow-none py-2 text-capitalize"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </Form.Select>
              </InputGroup>
            </Col>
          </Row>
        </Col>
      </Row>

      {/* Product Grid */}
      {filteredProducts.length > 0 ? (
        <Row xs={1} md={3} lg={4} className="g-4">
          {filteredProducts.map((product) => (
            <Col key={product.id}>
              <ProductCard 
                id={product.id}
                title={product.title}
                price={product.price}
                description={product.description}
                category={product.category}
                image={product.image}
              />
            </Col>
          ))}
        </Row>
      ) : (
        <div className="text-center py-5">
          <p className="text-muted fs-5">No products found matching your criteria.</p>
          <Button variant="link" onClick={() => {setSearchQuery(''); setSelectedCategory('all');}}>
            Clear filters
          </Button>
        </div>
      )}
    </Container>
  );
}