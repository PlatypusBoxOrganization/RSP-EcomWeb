import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import UserInfoTab from '../components/profile/UserInfoTab';
import AddressTab from '../components/profile/AddressTab';
import OrdersTab from '../components/profile/OrdersTab';
import { getProfile } from '../services/api/profileService';

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('info');
  const { user: authUser, logout, setUser } = useAuth();
  const [user, setUserProfile] = useState(authUser);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch fresh user data when component mounts
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await getProfile();
        setUserProfile(response.data);
        setUser(response.data); // Update auth context
      } catch (err) {
        console.error('Error fetching user profile:', err);
        setError('Failed to load profile data');
        toast.error('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    if (!authUser) {
      navigate('/login', { state: { from: '/profile' } });
    } else {
      fetchUserProfile();
    }
  }, [authUser, navigate, setUser]);

  // Update local state when auth user changes
  useEffect(() => {
    if (authUser) {
      setUserProfile(authUser);
    }
  }, [authUser]);

  const handleProfileUpdate = (updatedUser) => {
    setUserProfile(updatedUser);
    setUser(updatedUser); // Update auth context
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Profile Header */}
          <div className="bg-white px-4 py-5 border-b border-gray-200 sm:px-6">
            <div className="-ml-4 -mt-4 flex justify-between items-center flex-wrap sm:flex-nowrap">
              <div className="ml-4 mt-4">
                <h3 className="text-2xl font-bold leading-6 text-gray-900">
                  My Account
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Manage your account settings and view your orders
                </p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {[
                { id: 'info', name: 'Personal Information' },
                { id: 'address', name: 'Addresses' },
                { id: 'orders', name: 'Orders' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : error ? (
              <div className="rounded-md bg-red-50 p-4">
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
            ) : (
              <>
                {activeTab === 'info' && (
                  <UserInfoTab 
                    user={user} 
                    onProfileUpdate={handleProfileUpdate} 
                  />
                )}
                {activeTab === 'address' && <AddressTab />}
                {activeTab === 'orders' && <OrdersTab />}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
