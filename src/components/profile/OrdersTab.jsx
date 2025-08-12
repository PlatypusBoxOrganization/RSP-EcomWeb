import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getOrders, getOrder as getOrderApi } from '../../services/api/profileService';

const OrdersTab = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loadingOrderDetails, setLoadingOrderDetails] = useState(false);

  // Fetch orders from API
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await getOrders();
        setOrders(response.data || []);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError('Failed to load orders. Please try again.');
        toast.error('Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const fetchOrderDetails = async (orderId) => {
    if (selectedOrder?._id === orderId) {
      setSelectedOrder(null);
      return;
    }

    setLoadingOrderDetails(true);
    try {
      const response = await getOrderApi(orderId);
      setSelectedOrder(response.data);
    } catch (error) {
      console.error('Error fetching order details:', error);
      toast.error('Failed to load order details');
    } finally {
      setLoadingOrderDetails(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      'Processing': 'bg-blue-100 text-blue-800',
      'Shipped': 'bg-purple-100 text-purple-800',
      'Out for Delivery': 'bg-yellow-100 text-yellow-800',
      'Delivered': 'bg-green-100 text-green-800',
      'Cancelled': 'bg-red-100 text-red-800',
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusMap[status] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  if (loading && orders.length === 0) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || orders.length === 0) {
    return (
      <div className="text-center py-12">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          {error ? 'Error loading orders' : 'No orders found'}
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          {error || "You haven't placed any orders yet."}
        </p>
        <div className="mt-6">
          <Link
            to="/shop"
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {error ? 'Try Again' : 'Continue Shopping'}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Order History</h3>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {orders.map((order) => (
            <li key={order._id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-blue-600 truncate">
                    Order #{order.orderNumber}
                  </p>
                  <div className="ml-2 flex-shrink-0 flex">
                    {getStatusBadge(order.status)}
                  </div>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <p className="flex items-center text-sm text-gray-500">
                      <span>Placed on {formatDate(order.createdAt)}</span>
                    </p>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                    <p>
                      {order.items?.length || 0} {order.items?.length === 1 ? 'item' : 'items'} • {formatCurrency(order.totalPrice || 0)}
                    </p>
                  </div>
                </div>
                <div className="mt-2 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => fetchOrderDetails(order._id)}
                    disabled={loadingOrderDetails}
                    className="text-sm font-medium text-blue-600 hover:text-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loadingOrderDetails && selectedOrder?._id === order._id ? (
                      'Loading...'
                    ) : selectedOrder?._id === order._id ? (
                      'Hide details'
                    ) : (
                      'View details'
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      // TODO: Implement reorder functionality
                      toast.info('Reorder functionality coming soon');
                    }}
                    className="text-sm font-medium text-gray-700 hover:text-gray-500"
                  >
                    Reorder
                  </button>
                </div>
              </div>

              {selectedOrder?._id === order._id && (
                <div className="border-t border-gray-200 bg-gray-50 px-4 py-5 sm:px-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-3">Order Items</h4>
                      <div className="space-y-4">
                        {selectedOrder.items?.map((item, index) => (
                          <div key={index} className="flex items-start">
                            <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-gray-100">
                              {item.image ? (
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="h-full w-full object-cover object-center"
                                />
                              ) : (
                                <div className="h-full w-full flex items-center justify-center text-gray-400">
                                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                </div>
                              )}
                            </div>
                            <div className="ml-4 flex-1">
                              <div className="flex justify-between">
                                <h5 className="text-sm font-medium text-gray-900">{item.name}</h5>
                                <p className="ml-4 text-sm font-medium text-gray-900">
                                  {formatCurrency(item.price)}
                                </p>
                              </div>
                              <p className="mt-1 text-sm text-gray-500">Qty: {item.quantity}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-3">Shipping Information</h4>
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <p className="text-sm text-gray-900 font-medium">
                          {selectedOrder.shippingAddress?.name || 'N/A'}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          {selectedOrder.shippingAddress?.street || ''}
                        </p>
                        <p className="text-sm text-gray-500">
                          {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} {selectedOrder.shippingAddress?.postalCode}
                        </p>
                        <p className="text-sm text-gray-500">
                          {selectedOrder.shippingAddress?.country}
                        </p>
                        
                        <h5 className="mt-4 text-sm font-medium text-gray-900">Payment Method</h5>
                        <p className="text-sm text-gray-500 capitalize">
                          {selectedOrder.paymentMethod ? selectedOrder.paymentMethod.replace('_', ' ') : 'N/A'}
                        </p>
                        
                        <h5 className="mt-4 text-sm font-medium text-gray-900">Order Summary</h5>
                        <div className="mt-2 space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Subtotal</span>
                            <span>{formatCurrency(selectedOrder.itemsPrice || 0)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Shipping</span>
                            <span>{formatCurrency(selectedOrder.shippingPrice || 0)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Tax</span>
                            <span>{formatCurrency(selectedOrder.taxPrice || 0)}</span>
                          </div>
                          <div className="flex justify-between font-medium text-gray-900 pt-2 border-t border-gray-200 mt-2">
                            <span>Total</span>
                            <span>{formatCurrency(selectedOrder.totalPrice || 0)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default OrdersTab;
