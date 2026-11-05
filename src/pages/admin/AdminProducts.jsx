import React, { useEffect, useState } from 'react';
import { Container, Table, Button, Modal, Form } from 'react-bootstrap';
import api from '../../services/api/axiosConfig';
import { toast } from 'react-toastify';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({ name: '', slug: '', image: '', brand: '', category: '', description: '', price: 0, countInStock: 0, color: 'Black', discount: 0 });

  const load = async () => {
    const { data } = await api.get('/products/admin/all');
    setProducts(data);
  };
  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    await api.post('/products', form);
    toast.success('Created');
    setShow(false);
    load();
  };

  const remove = async (id) => {
    await api.delete(`/products/${id}`);
    load();
  };

  return (
    <Container className="py-4">
      <h2>Products</h2>
      <Button onClick={() => setShow(true)} className="mb-3">Add Product</Button>
      <Table striped bordered hover>
        <thead><tr><th>Name</th><th>Price</th><th>Stock</th><th></th></tr></thead>
        <tbody>
          {products.map(p => (
            <tr key={p._id}>
              <td>{p.name}</td>
              <td>{p.price}</td>
              <td>{p.countInStock}</td>
              <td><Button size="sm" variant="danger" onClick={() => remove(p._id)}>Delete</Button></td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton><Modal.Title>Add Product</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form onSubmit={submit}>
            {Object.keys(form).map(k => (
              <Form.Group key={k} className="mb-2">
                <Form.Label>{k}</Form.Label>
                <Form.Control value={form[k]} onChange={e => setForm({ ...form, [k]: e.target.value })} />
              </Form.Group>
            ))}
            <Button type="submit">Save</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
}