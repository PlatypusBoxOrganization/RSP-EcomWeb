import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { 
  addAddress as addAddressApi, 
  updateAddress as updateAddressApi, 
  deleteAddress as deleteAddressApi,
  getProfile
} from '../../services/api/profileService';

const AddressTab = () => {
  const [addresses, setAddresses] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
    isDefault: false
  });

  // Fetch addresses from API
  useEffect(() => {
    const fetchAddresses = async () => {
      setIsLoading(true);
      setError('');
      try {
        const response = await getProfile();
        setAddresses(response.data.addresses || []);
      } catch (error) {
        console.error('Error fetching addresses:', error);
        setError('Failed to load addresses. Please try again.');
        toast.error('Failed to load addresses');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAddresses();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      if (editingId) {
        // Update existing address
        const updatedAddress = await updateAddressApi(editingId, formData);
        setAddresses(addresses.map(addr => 
          addr._id === editingId ? updatedAddress.data : addr
        ));
        toast.success('Address updated successfully');
      } else {
        // Add new address
        const newAddress = await addAddressApi(formData);
        setAddresses([...addresses, newAddress.data]);
        toast.success('Address added successfully');
      }
      
      // Reset form
      setFormData({
        name: '',
        street: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'India',
        isDefault: false
      });
      setEditingId(null);
      setIsAdding(false);
    } catch (error) {
      console.error('Error saving address:', error);
      setError(error.message || 'Failed to save address. Please try again.');
      toast.error('Failed to save address');
    }
  };

  const handleEdit = (address) => {
    setFormData(address);
    setEditingId(address._id);
    setIsAdding(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this address?')) {
      return;
    }
    
    try {
      const response = await deleteAddressApi(id);
      
      if (response?.success) {
        setAddresses(addresses.filter(addr => addr._id !== id));
        toast.success('Address deleted successfully');
      } else {
        const errorMessage = response?.error || 'Failed to delete address';
        console.error('Delete address error:', errorMessage);
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error('Unexpected error deleting address:', {
        error,
        message: error?.message,
        response: error?.response?.data
      });
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to delete address. Please try again.';
      toast.error(errorMessage);
    }
  };

  const setAsDefault = async (id) => {
    try {
      const address = addresses.find(addr => addr._id === id);
      if (!address) {
        console.error('Address not found for ID:', id);
        toast.error('Address not found');
        return;
      }
      
      const response = await updateAddressApi(id, { ...address, isDefault: true });
      
      if (response?.success) {
        // Update all addresses, setting only the selected one as default
        setAddresses(addresses.map(addr => ({
          ...addr,
          isDefault: addr._id === id ? true : false
        })));
        
        toast.success('Default address updated');
      } else {
        const errorMessage = response?.error || 'Failed to update default address';
        console.error('Error setting default address:', errorMessage);
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error('Unexpected error setting default address:', {
        error,
        message: error?.message,
        response: error?.response?.data
      });
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to update default address';
      toast.error(errorMessage);
    }
  };

  if (isLoading && addresses.length === 0) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-md bg-red-50 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">{error}</h3>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Saved Addresses</h3>
        <button
          onClick={() => {
            setIsAdding(true);
            setEditingId(null);
            setFormData({
              name: '',
              street: '',
              city: '',
              state: '',
              postalCode: '',
              country: 'India',
              isDefault: false
            });
          }}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Add New Address
        </button>
      </div>

      {/* Add/Edit Address Form */}
      {isAdding && (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6 mb-6">
          <h4 className="text-lg font-medium mb-4">
            {editingId ? 'Edit Address' : 'Add New Address'}
          </h4>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-6">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Address Nickname (e.g., Home, Work)
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  required
                />
              </div>

              <div className="sm:col-span-6">
                <label htmlFor="street" className="block text-sm font-medium text-gray-700">
                  Street Address
                </label>
                <input
                  type="text"
                  name="street"
                  id="street"
                  value={formData.street}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  id="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                  State/Province/Region
                </label>
                <input
                  type="text"
                  name="state"
                  id="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">
                  ZIP / Postal code
                </label>
                <input
                  type="text"
                  name="postalCode"
                  id="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  required
                />
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                  Country
                </label>
                <select
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                >
                  <option>India</option>
                  <option>United States</option>
                  <option>Canada</option>
                  <option>Mexico</option>
                </select>
              </div>

              <div className="sm:col-span-6 flex items-center">
                <input
                  id="isDefault"
                  name="isDefault"
                  type="checkbox"
                  checked={formData.isDefault}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="isDefault" className="ml-2 block text-sm text-gray-700">
                  Set as default address
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {editingId ? 'Update Address' : 'Add Address'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Address List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {addresses.length === 0 ? (
            <li className="p-6 text-center text-gray-500">
              No saved addresses. Add your first address above.
            </li>
          ) : (
            addresses.map((address) => (
              <li key={address._id} className="p-6">
                <div className="flex items-start">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <h4 className="text-lg font-medium text-gray-900">{address.name}</h4>
                      {address.isDefault && (
                        <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Default
                        </span>
                      )}
                    </div>
                    <div className="mt-2 text-sm text-gray-500">
                      <p>{address.street}</p>
                      <p>{address.city}, {address.state} {address.postalCode}</p>
                      <p>{address.country}</p>
                    </div>
                  </div>
                  <div className="ml-4 flex-shrink-0 flex space-x-2">
                    {!address.isDefault && (
                      <button
                        onClick={() => setAsDefault(address._id)}
                        className="text-sm font-medium text-blue-600 hover:text-blue-500"
                      >
                        Set as default
                      </button>
                    )}
                    <button
                      onClick={() => handleEdit(address)}
                      className="ml-4 text-sm font-medium text-blue-600 hover:text-blue-500"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(address._id)}
                      className="ml-4 text-sm font-medium text-red-600 hover:text-red-500"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default AddressTab;
