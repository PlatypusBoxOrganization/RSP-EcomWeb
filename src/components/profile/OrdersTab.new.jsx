import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getOrders, getOrder as getOrderApi, cancelOrder } from '../../services/api/profileService';
import { FaChevronDown, FaChevronUp, FaBoxOpen, FaUndo, FaSearch } from 'react-icons/fa';

const OrdersTab = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filters, setFilters] = useState({ status: '', search: '' });

  // Fetch orders
  useEffect(() => {
    const fetchOrdersData = async () => {
      try {
        const response = await getOrders(1, 5, filters.status);
        setOrders(response.data.orders || []);
      } catch (err) {
        setError('Failed to load orders');
        toast.error('Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrdersData();
  }, [filters.status]);

  // Handle order details fetch
  const handleOrderClick = async (orderId) => {
    if (selectedOrder?._id === orderId) {
      setSelectedOrder(null);
      return;
    }
    
    try {
      const response = await getOrderApi(orderId);
      setSelectedOrder(response.data);
    } catch (err) {
      toast.error('Failed to load order details');
    }
  };

  // Handle order cancellation
  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    
    try {
      await cancelOrder(orderId);
      toast.success('Order cancelled successfully');
      // Refresh orders
      const response = await getOrders(1, 5, filters.status);
      setOrders(response.data.orders || []);
      setSelectedOrder(null);
    } catch (err) {
      toast.error(err.message || 'Failed to cancel order');
    }
  };

  // Loading state
  if (loading && orders.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <p className="text-red-700">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 text-sm text-red-700 hover:text-red-800"
        >
          Try again
        </button>
      </div>
    );
  }

  // Empty state
  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <FaBoxOpen className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-lg font-medium text-gray-900">No orders found</h3>
        <p className="mt-1 text-sm text-gray-500">
          {filters.status ? 'Try adjusting your filters' : 'Get started by placing an order'}
        </p>
        <div className="mt-6">
          <Link
            to="/shop"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search orders..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
        </div>
        <select
          className="block w-full sm:w-48 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Orders List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {orders.map((order) => (
            <li key={order._id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <p className="text-sm font-medium text-blue-600">
                      Order #{order._id.substring(order._id.length - 6).toUpperCase()}
                    </p>
                    <span className={`ml-2 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                      order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                  <button
                    onClick={() => handleOrderClick(order._id)}
                    className="text-sm text-blue-600 hover:text-blue-500"
                  >
                    {selectedOrder?._id === order._id ? 'Hide details' : 'View details'}
                  </button>
                </div>

                {selectedOrder?._id === order._id && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h4 className="font-medium text-gray-900 mb-2">Order Items</h4>
                    <ul className="space-y-4">
                      {selectedOrder.orderItems.map((item) => (
                        <li key={item._id} className="flex items-center">
                          <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                            <img
                              src={item.image || '/placeholder-product.jpg'}
                              alt={item.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="ml-4 flex-1">
                            <h5 className="text-sm font-medium text-gray-900">{item.name}</h5>
                            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                            <p className="text-sm font-medium text-gray-900">
                              ₹{item.price.toFixed(2)}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-6 border-t border-gray-200 pt-4">
                      <h4 className="font-medium text-gray-900 mb-2">Order Summary</h4>
                      <dl className="space-y-2">
                        <div className="flex justify-between">
                          <dt className="text-sm text-gray-600">Subtotal</dt>
                          <dd className="text-sm font-medium text-gray-900">
                            ₹{selectedOrder.itemsPrice?.toFixed(2)}
                          </dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-sm text-gray-600">Shipping</dt>
                          <dd className="text-sm font-medium text-gray-900">
                            {selectedOrder.shippingPrice === 0 ? 'Free' : `₹${selectedOrder.shippingPrice?.toFixed(2)}`}
                          </dd>
                        </div>
                        <div className="flex justify-between border-t border-gray-200 pt-2">
                          <dt className="text-base font-medium text-gray-900">Total</dt>
                          <dd className="text-base font-medium text-blue-600">
                            ₹{selectedOrder.totalPrice?.toFixed(2)}
                          </dd>
                        </div>
                      </dl>
                    </div>

                    {order.status !== 'cancelled' && order.status !== 'delivered' && (
                      <div className="mt-6 flex justify-end">
                        <button
                          onClick={() => handleCancelOrder(order._id)}
                          className="px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700"
                        >
                          Cancel Order
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default OrdersTab;
