import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Table, Button, Badge, Form, InputGroup, Spinner, Modal } from 'react-bootstrap';
import { FaSearch, FaEye, FaTimes, FaTruck, FaCheckCircle, FaFilter, FaRedo } from 'react-icons/fa';
import { toast } from 'react-toastify';
import axios from 'axios';
import { format } from 'date-fns';
import { io } from 'socket.io-client';

const statusVariant = {
  placed: 'primary',
  processing: 'info',
  shipped: 'warning',
  delivered: 'success',
  cancelled: 'danger'
};

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [socket, setSocket] = useState(null);

  // Initialize WebSocket connection
  useEffect(() => {
    const newSocket = io(process.env.REACT_APP_API_URL);
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Connected to WebSocket server');
      newSocket.emit('join_admin_room');
    });

    newSocket.on('order_updated', (order) => {
      setOrders(prevOrders => {
        const orderIndex = prevOrders.findIndex(o => o._id === order._id);
        if (orderIndex >= 0) {
          const updatedOrders = [...prevOrders];
          updatedOrders[orderIndex] = order;
          return updatedOrders;
        }
        return [order, ...prevOrders];
      });
      
      if (order.status !== 'cancelled' && order.status !== 'delivered') {
        toast.info(`Order #${order.orderNumber} status updated to ${order.status}`);
      }
    });

    return () => newSocket.disconnect();
  }, []);

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get('/api/orders', {
          params: {
            search: searchTerm,
            status: statusFilter === 'all' ? '' : statusFilter,
            date: dateFilter
          }
        });
        setOrders(data.orders);
      } catch (error) {
        toast.error('Failed to fetch orders');
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [searchTerm, statusFilter, dateFilter]);

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      setUpdatingStatus(true);
      const { data } = await axios.put(`/api/orders/${orderId}/status`, {
        status: newStatus,
        reason: `Status updated by admin to ${newStatus}`
      });
      
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order._id === data._id ? data : order
        )
      );
      
      toast.success(`Order status updated to ${newStatus}`);
    } catch (error) {
      toast.error('Failed to update order status');
      console.error('Error updating order status:', error);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleShowDetails = (order) => {
    setSelectedOrder(order);
    setShowDetails(true);
  };

  const handleRefresh = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setDateFilter('');
  };

  const formatDate = (dateString) => {
    return format(new Date(dateString), 'MMM dd, yyyy hh:mm a');
  };

  const getStatusActions = (order) => {
    switch (order.status) {
      case 'placed':
        return (
          <>
            <Button 
              variant="info" 
              size="sm" 
              className="me-2"
              onClick={() => handleStatusUpdate(order._id, 'processing')}
              disabled={updatingStatus}
            >
              {updatingStatus ? 'Processing...' : 'Process Order'}
            </Button>
            <Button 
              variant="danger" 
              size="sm"
              onClick={() => handleStatusUpdate(order._id, 'cancelled')}
              disabled={updatingStatus}
            >
              Cancel Order
            </Button>
          </>
        );
      case 'processing':
        return (
          <Button 
            variant="warning" 
            size="sm"
            onClick={() => handleStatusUpdate(order._id, 'shipped')}
            disabled={updatingStatus}
          >
            {updatingStatus ? 'Updating...' : 'Mark as Shipped'}
          </Button>
        );
      case 'shipped':
        return (
          <Button 
            variant="success" 
            size="sm"
            onClick={() => handleStatusUpdate(order._id, 'delivered')}
            disabled={updatingStatus}
          >
            {updatingStatus ? 'Updating...' : 'Mark as Delivered'}
          </Button>
        );
      default:
        return null;
    }
  };

  return (
    <Container fluid className="py-4">
      <h2 className="mb-4">Order Management</h2>
      
      {/* Filters */}
      <Row className="mb-4">
        <Col md={4}>
          <InputGroup>
            <InputGroup.Text><FaSearch /></InputGroup.Text>
            <Form.Control
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Col>
        <Col md={3}>
          <Form.Select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="placed">Placed</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </Form.Select>
        </Col>
        <Col md={3}>
          <Form.Control
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          />
        </Col>
        <Col md={2}>
          <Button variant="outline-secondary" onClick={handleRefresh}>
            <FaRedo className="me-1" /> Refresh
          </Button>
        </Col>
      </Row>

      {/* Orders Table */}
      <div className="table-responsive">
        {loading ? (
          <div className="text-center my-5">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center my-5">
            <h4>No orders found</h4>
            <p>Try adjusting your search or filters</p>
          </div>
        ) : (
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Order #</th>
                <th>Date</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{order.orderNumber}</td>
                  <td>{formatDate(order.createdAt)}</td>
                  <td>
                    {order.user?.name || 'Guest'}<br />
                    <small className="text-muted">{order.user?.email || order.shippingAddress?.email}</small>
                  </td>
                  <td>{order.orderItems.reduce((sum, item) => sum + item.quantity, 0)}</td>
                  <td>₹{order.totalPrice.toFixed(2)}</td>
                  <td>
                    <Badge bg={statusVariant[order.status] || 'secondary'} className="text-capitalize">
                      {order.status}
                    </Badge>
                  </td>
                  <td>
                    <Button 
                      variant="outline-primary" 
                      size="sm" 
                      className="me-2"
                      onClick={() => handleShowDetails(order)}
                    >
                      <FaEye />
                    </Button>
                    {getStatusActions(order)}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </div>

      {/* Order Details Modal */}
      <Modal show={showDetails} onHide={() => setShowDetails(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Order Details - #{selectedOrder?.orderNumber}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrder && (
            <>
              <Row className="mb-4">
                <Col md={6}>
                  <h5>Customer Information</h5>
                  <p>
                    <strong>Name:</strong> {selectedOrder.user?.name || selectedOrder.shippingAddress?.name}<br />
                    <strong>Email:</strong> {selectedOrder.user?.email || selectedOrder.shippingAddress?.email}<br />
                    <strong>Phone:</strong> {selectedOrder.shippingAddress?.phone}
                  </p>
                  <h5 className="mt-4">Shipping Address</h5>
                  <p>
                    {selectedOrder.shippingAddress?.address}<br />
                    {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state}<br />
                    {selectedOrder.shippingAddress?.postalCode}<br />
                    {selectedOrder.shippingAddress?.country}
                  </p>
                </Col>
                <Col md={6}>
                  <h5>Order Summary</h5>
                  <Table borderless size="sm">
                    <tbody>
                      <tr>
                        <td>Order Status:</td>
                        <td>
                          <Badge bg={statusVariant[selectedOrder.status] || 'secondary'} className="text-capitalize">
                            {selectedOrder.status}
                          </Badge>
                        </td>
                      </tr>
                      <tr>
                        <td>Order Date:</td>
                        <td>{formatDate(selectedOrder.createdAt)}</td>
                      </tr>
                      {selectedOrder.paidAt && (
                        <tr>
                          <td>Paid On:</td>
                          <td>{formatDate(selectedOrder.paidAt)}</td>
                        </tr>
                      )}
                      {selectedOrder.deliveredAt && (
                        <tr>
                          <td>Delivered On:</td>
                          <td>{formatDate(selectedOrder.deliveredAt)}</td>
                        </tr>
                      )}
                      {selectedOrder.cancelledAt && (
                        <tr>
                          <td>Cancelled On:</td>
                          <td>{formatDate(selectedOrder.cancelledAt)}</td>
                        </tr>
                      )}
                      <tr>
                        <td>Payment Method:</td>
                        <td className="text-capitalize">
                          {selectedOrder.paymentMethod}
                          {selectedOrder.isPaid && (
                            <Badge bg="success" className="ms-2">
                              Paid
                            </Badge>
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </Col>
              </Row>

              <h5>Order Items</h5>
              <Table striped bordered hover size="sm">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Qty</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.orderItems.map((item) => (
                    <tr key={item._id}>
                      <td>
                        <div className="d-flex align-items-center">
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            style={{ width: '50px', height: '50px', objectFit: 'cover', marginRight: '10px' }}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = '/images/default-product.png';
                            }}
                          />
                          {item.name}
                        </div>
                      </td>
                      <td>₹{item.price.toFixed(2)}</td>
                      <td>{item.quantity}</td>
                      <td>₹{(item.price * item.quantity).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="3" className="text-end"><strong>Subtotal:</strong></td>
                    <td>₹{selectedOrder.itemsPrice.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td colSpan="3" className="text-end"><strong>Shipping:</strong></td>
                    <td>₹{selectedOrder.shippingPrice.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td colSpan="3" className="text-end"><strong>Tax:</strong></td>
                    <td>₹{selectedOrder.taxPrice.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td colSpan="3" className="text-end"><strong>Total:</strong></td>
                    <td>₹{selectedOrder.totalPrice.toFixed(2)}</td>
                  </tr>
                </tfoot>
              </Table>

              {selectedOrder.statusHistory && selectedOrder.statusHistory.length > 0 && (
                <div className="mt-4">
                  <h5>Status History</h5>
                  <div className="timeline">
                    {[...selectedOrder.statusHistory].reverse().map((history, index) => (
                      <div key={index} className="timeline-item">
                        <div className="timeline-marker"></div>
                        <div className="timeline-content">
                          <p className="mb-0">
                            <strong className="text-capitalize">{history.status}</strong>
                            <small className="text-muted ms-2">
                              {formatDate(history.changedAt)}
                            </small>
                          </p>
                          {history.reason && (
                            <p className="text-muted mb-0">
                              <small>{history.reason}</small>
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetails(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminOrders;
