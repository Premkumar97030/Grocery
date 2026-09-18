import React, { useState } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';
import { MapPin, Phone, User, Home, Building } from 'lucide-react';

export const AddressForm = ({ onSubmit, onCancel, loading = false }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    addressLine: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
    isDefault: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Full Name"
          name="fullName"
          required
          icon={User}
          placeholder="e.g. Prem Kumar"
          value={formData.fullName}
          onChange={handleChange}
        />
        <Input
          label="Phone Number"
          name="phone"
          required
          icon={Phone}
          placeholder="e.g. +91 98765 43210"
          value={formData.phone}
          onChange={handleChange}
        />
      </div>

      <Input
        label="Street Address / Flat / Floor / Building"
        name="addressLine"
        required
        icon={Home}
        placeholder="e.g. Flat 402, Green Meadows, Outer Ring Rd"
        value={formData.addressLine}
        onChange={handleChange}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Input
          label="City"
          name="city"
          required
          icon={Building}
          placeholder="e.g. Hyderabad"
          value={formData.city}
          onChange={handleChange}
        />
        <Input
          label="State / Region"
          name="state"
          required
          placeholder="e.g. Telangana"
          value={formData.state}
          onChange={handleChange}
        />
        <Input
          label="PIN / Postal Code"
          name="postalCode"
          required
          placeholder="e.g. 500081"
          value={formData.postalCode}
          onChange={handleChange}
        />
      </div>

      <div className="flex items-center gap-2 pt-2">
        <input
          type="checkbox"
          id="isDefault"
          name="isDefault"
          checked={formData.isDefault}
          onChange={handleChange}
          className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
        />
        <label htmlFor="isDefault" className="text-xs font-semibold text-slate-700 cursor-pointer">
          Set as default delivery address
        </label>
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" variant="primary" loading={loading}>
          Save Address
        </Button>
      </div>
    </form>
  );
};

export default AddressForm;
