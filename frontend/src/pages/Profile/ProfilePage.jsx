import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/userService';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import AddressCard from '../../components/checkout/AddressCard';
import AddressForm from '../../components/checkout/AddressForm';
import Modal from '../../components/common/Modal';
import { User, Lock, MapPin, Plus, ShieldCheck, Mail, Phone, Calendar } from 'lucide-react';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile'); // profile, security, addresses

  // Profile Form State
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');

  // Password Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Addresses State
  const [addresses, setAddresses] = useState(user?.addresses || []);
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [addressLoading, setAddressLoading] = useState(false);
  const [addressError, setAddressError] = useState('');

  // Handle Profile Update
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileSuccess('');
    setProfileError('');
    try {
      const res = await userService.updateProfile({ name, phone });
      updateUser(res.data);
      setProfileSuccess('Profile updated successfully!');
    } catch (err) {
      setProfileError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setProfileLoading(false);
    }
  };

  // Handle Password Change
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }
    setPasswordLoading(true);
    setPasswordSuccess('');
    setPasswordError('');
    try {
      await userService.changePassword({ currentPassword, newPassword });
      setPasswordSuccess('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPasswordError(err.response?.data?.message || 'Failed to change password');
    } finally {
      setPasswordLoading(false);
    }
  };

  // Handle Add / Edit Address
  const handleAddressSubmit = async (addressData) => {
    setAddressLoading(true);
    setAddressError('');
    try {
      let res;
      if (editingAddress) {
        res = await userService.updateAddress(editingAddress._id, addressData);
      } else {
        res = await userService.addAddress(addressData);
      }
      setAddresses(res.data);
      updateUser({ ...user, addresses: res.data });
      setAddressModalOpen(false);
      setEditingAddress(null);
    } catch (err) {
      setAddressError(err.response?.data?.message || 'Failed to save address');
    } finally {
      setAddressLoading(false);
    }
  };

  // Handle Delete Address
  const handleDeleteAddress = async (id) => {
    if (!window.confirm('Are you sure you want to delete this address?')) return;
    try {
      const res = await userService.deleteAddress(id);
      setAddresses(res.data);
      updateUser({ ...user, addresses: res.data });
    } catch (err) {
      alert('Failed to delete address');
    }
  };

  // Handle Set Default Address
  const handleSetDefaultAddress = async (id) => {
    try {
      const res = await userService.setDefaultAddress(id);
      setAddresses(res.data);
      updateUser({ ...user, addresses: res.data });
    } catch (err) {
      alert('Failed to set default address');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-emerald-100/60 mb-8 flex flex-col sm:flex-row items-center gap-6">
        <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-3xl shadow-inner border-2 border-emerald-200">
          {user?.name?.charAt(0).toUpperCase() || 'U'}
        </div>
        <div className="text-center sm:text-left flex-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{user?.name}</h1>
            <span className={`px-3 py-0.5 text-xs font-semibold rounded-full uppercase tracking-wider ${
              user?.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-emerald-100 text-emerald-700'
            }`}>
              {user?.role || 'Customer'}
            </span>
          </div>
          <p className="text-gray-500 text-sm mt-1 flex items-center justify-center sm:justify-start gap-4">
            <span className="flex items-center gap-1.5"><Mail className="w-4 h-4" /> {user?.email}</span>
            {user?.phone && <span className="flex items-center gap-1.5"><Phone className="w-4 h-4" /> {user.phone}</span>}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Navigation Sidebar */}
        <div className="md:col-span-1 space-y-2">
          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
              activeTab === 'profile'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'text-gray-600 hover:bg-emerald-50 hover:text-emerald-700'
            }`}
          >
            <User className="w-4 h-4" /> Personal Information
          </button>
          <button
            onClick={() => setActiveTab('addresses')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
              activeTab === 'addresses'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'text-gray-600 hover:bg-emerald-50 hover:text-emerald-700'
            }`}
          >
            <MapPin className="w-4 h-4" /> Saved Addresses
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
              activeTab === 'security'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'text-gray-600 hover:bg-emerald-50 hover:text-emerald-700'
            }`}
          >
            <Lock className="w-4 h-4" /> Security & Password
          </button>
        </div>

        {/* Tab Content */}
        <div className="md:col-span-3">
          {/* Personal Info Tab */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-emerald-100/60">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Personal Information</h2>
              <p className="text-gray-500 text-sm mb-6">Manage your contact details and preferences</p>

              {profileSuccess && (
                <div className="mb-6 p-4 bg-emerald-50 text-emerald-800 rounded-xl text-sm font-medium border border-emerald-200">
                  {profileSuccess}
                </div>
              )}
              {profileError && (
                <div className="mb-6 p-4 bg-rose-50 text-rose-800 rounded-xl text-sm font-medium border border-rose-200">
                  {profileError}
                </div>
              )}

              <form onSubmit={handleProfileSubmit} className="space-y-5">
                <Input
                  label="Full Name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <Input
                  label="Email Address"
                  type="email"
                  value={user?.email || ''}
                  disabled
                  helperText="Email address cannot be changed"
                />
                <Input
                  label="Phone Number"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                <div className="pt-4 flex justify-end">
                  <Button type="submit" loading={profileLoading} variant="primary">
                    Save Changes
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* Addresses Tab */}
          {activeTab === 'addresses' && (
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-emerald-100/60">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Saved Addresses</h2>
                  <p className="text-gray-500 text-sm mt-1">Manage delivery locations for quick checkout</p>
                </div>
                <Button
                  onClick={() => {
                    setEditingAddress(null);
                    setAddressModalOpen(true);
                  }}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Add Address
                </Button>
              </div>

              {addresses.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-2xl">
                  <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">No saved addresses yet</p>
                  <p className="text-gray-400 text-sm mt-1">Add an address to speed up your future orders</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {addresses.map((addr) => (
                    <AddressCard
                      key={addr._id}
                      address={addr}
                      onEdit={() => {
                        setEditingAddress(addr);
                        setAddressModalOpen(true);
                      }}
                      onDelete={() => handleDeleteAddress(addr._id)}
                      onSetDefault={() => handleSetDefaultAddress(addr._id)}
                    />
                  ))}
                </div>
              )}

              {/* Address Modal */}
              <Modal
                isOpen={addressModalOpen}
                onClose={() => {
                  setAddressModalOpen(false);
                  setEditingAddress(null);
                }}
                title={editingAddress ? 'Edit Address' : 'Add New Address'}
              >
                {addressError && (
                  <div className="mb-4 p-3 bg-rose-50 text-rose-700 rounded-lg text-sm border border-rose-200">
                    {addressError}
                  </div>
                )}
                <AddressForm
                  initialData={editingAddress}
                  onSubmit={handleAddressSubmit}
                  loading={addressLoading}
                  onCancel={() => {
                    setAddressModalOpen(false);
                    setEditingAddress(null);
                  }}
                />
              </Modal>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-emerald-100/60">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Change Password</h2>
              <p className="text-gray-500 text-sm mb-6">Ensure your account is protected with a strong password</p>

              {passwordSuccess && (
                <div className="mb-6 p-4 bg-emerald-50 text-emerald-800 rounded-xl text-sm font-medium border border-emerald-200">
                  {passwordSuccess}
                </div>
              )}
              {passwordError && (
                <div className="mb-6 p-4 bg-rose-50 text-rose-800 rounded-xl text-sm font-medium border border-rose-200">
                  {passwordError}
                </div>
              )}

              <form onSubmit={handlePasswordSubmit} className="space-y-5">
                <Input
                  label="Current Password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
                <Input
                  label="New Password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  required
                />
                <Input
                  label="Confirm New Password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <div className="pt-4 flex justify-end">
                  <Button type="submit" loading={passwordLoading} variant="primary">
                    Update Password
                  </Button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
