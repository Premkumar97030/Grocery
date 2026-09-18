import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { ArrowLeft, Upload, Image as ImageIcon, Check } from 'lucide-react';

const AdminProductFormPage = () => {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditing);
  const [error, setError] = useState('');

  // Form Fields
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [discountPrice, setDiscountPrice] = useState('');
  const [unit, setUnit] = useState('1 pc');
  const [stock, setStock] = useState('50');
  const [image, setImage] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const catRes = await categoryService.getCategories();
        const catList = Array.isArray(catRes.data) ? catRes.data : (Array.isArray(catRes.categories) ? catRes.categories : []);
        setCategories(catList);

        if (isEditing) {
          const prodRes = await productService.getProductById(id);
          const p = prodRes.data?.product || prodRes.data;

          if (p) {
            setName(p.name || '');
            setDescription(p.description || '');
            setCategory(typeof p.category === 'object' ? p.category?.name : (p.category || ''));
            setPrice(p.price !== undefined ? p.price.toString() : '');
            setDiscountPrice(p.discountPrice ? p.discountPrice.toString() : '');
            setUnit(p.unit || '1 unit');
            setStock(p.stock !== undefined ? p.stock.toString() : '50');
            setImage(p.image || '');
            setIsFeatured(Boolean(p.isFeatured));
            setIsAvailable(p.isActive !== false);
          }
        }
      } catch (err) {
        setError('Failed to load form data: ' + (err.message || 'Product not found'));
      } finally {
        setInitialLoading(false);
      }
    };

    fetchData();
  }, [id, isEditing]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!category) {
      setError('Please select a category');
      return;
    }

    setLoading(true);
    setError('');

    const payload = {
      name,
      description,
      category,
      price: parseFloat(price),
      discountPrice: discountPrice ? parseFloat(discountPrice) : 0,
      unit,
      stock: parseInt(stock, 10) || 0,
      image: image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=60',
      isFeatured,
      isActive: isAvailable,
    };

    try {
      if (isEditing) {
        await productService.updateProduct(id, payload);
      } else {
        await productService.createProduct(payload);
      }
      navigate('/admin/products');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };


  if (initialLoading) {
    return (
      <div className="py-20 flex justify-center items-center">
        <LoadingSpinner size="lg" message="Loading Product..." />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          to="/admin/products"
          className="p-2.5 rounded-xl border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 transition-colors shadow-sm"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditing ? 'Edit Grocery Item' : 'Add New Grocery Item'}
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {isEditing ? `Updating product #${id}` : 'Fill in the details to publish item to store'}
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl font-medium">
          {error}
        </div>
      )}

      {/* Form Container */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-emerald-100/60 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="sm:col-span-2">
            <Input
              label="Product Name"
              type="text"
              placeholder="e.g. Organic Cavendish Bananas"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Description
            </label>
            <textarea
              rows={3}
              placeholder="Detailed description of the product, farm source, nutritional value..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm bg-white"
              required
            >
              <option value="">Select a category</option>
              {categories.map((c) => (
                <option key={c._id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Input
              label="Unit / Pack Size"
              type="text"
              placeholder="e.g. 1 kg, 500g, 1L, 1 bunch, 6 pack"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              required
            />
          </div>

          <div>
            <Input
              label="Price (₹)"
              type="number"
              step="1"
              min="0"
              placeholder="150"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>

          <div>
            <Input
              label="Discount / Strike Price (₹) (Optional)"
              type="number"
              step="1"
              min="0"
              placeholder="130"
              value={discountPrice}
              onChange={(e) => setDiscountPrice(e.target.value)}
              helperText="Set original price if offering a discount"
            />
          </div>

          <div>
            <Input
              label="Stock Inventory Count"
              type="number"
              min="0"
              placeholder="50"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              required
            />
          </div>

          <div>
            <Input
              label="Image URL"
              type="url"
              placeholder="https://images.unsplash.com/..."
              value={image}
              onChange={(e) => setImage(e.target.value)}
              helperText="Paste direct high-res image link"
            />
          </div>
        </div>

        {/* Image Preview */}
        {image && (
          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center gap-4">
            <img
              src={image}
              alt="Preview"
              className="w-16 h-16 rounded-xl object-cover border border-gray-200 bg-white"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=60';
              }}
            />
            <div>
              <p className="text-xs font-bold text-gray-700">Image Preview</p>
              <p className="text-xs text-gray-400 truncate max-w-sm">{image}</p>
            </div>
          </div>
        )}

        {/* Flags */}
        <div className="pt-2 flex flex-wrap items-center gap-6 border-t border-gray-100">
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="w-4 h-4 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500"
            />
            <span className="text-sm font-medium text-gray-700">Featured on Homepage</span>
          </label>

          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={isAvailable}
              onChange={(e) => setIsAvailable(e.target.checked)}
              className="w-4 h-4 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500"
            />
            <span className="text-sm font-medium text-gray-700">Available for Ordering</span>
          </label>
        </div>

        {/* Submit Actions */}
        <div className="pt-6 border-t border-gray-100 flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate('/admin/products')}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={loading}
            className="shadow-md shadow-emerald-600/20"
          >
            {isEditing ? 'Save Changes' : 'Create Product'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AdminProductFormPage;
