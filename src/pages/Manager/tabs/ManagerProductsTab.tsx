import React, { useState } from 'react';
import { UnitProduct, BusinessHealthItem } from '../../../types';
import {
  Package,
  Plus,
  Search,
  Trash2,
  Edit2,
  DollarSign,
  Layers,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Tag
} from 'lucide-react';

interface ManagerProductsTabProps {
  business: BusinessHealthItem;
  products: UnitProduct[];
  onOpenAddProductModal: () => void;
  onDeleteProduct: (id: string) => void;
  onUpdateProductPrice?: (id: string, newPrice: number) => void;
}

export const ManagerProductsTab: React.FC<ManagerProductsTabProps> = ({
  business,
  products,
  onOpenAddProductModal,
  onDeleteProduct,
  onUpdateProductPrice
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [editingProduct, setEditingProduct] = useState<UnitProduct | null>(null);
  const [editPriceVal, setEditPriceVal] = useState('');
  const [productToDelete, setProductToDelete] = useState<UnitProduct | null>(null);

  // Extract unique categories
  const categories = ['All', 'Dates', 'Apples', 'Citrus & Orange', 'Grapes & Pomegranate', 'Nuts & Specialty'];

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.category && p.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
      p.unit.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === 'All' ||
      (p.category && p.category.toLowerCase() === selectedCategory.toLowerCase());

    return matchesSearch && matchesCategory;
  });

  const handleStartEdit = (prod: UnitProduct) => {
    setEditingProduct(prod);
    setEditPriceVal(prod.unitPrice.toString());
  };

  const handleSavePrice = () => {
    if (editingProduct && onUpdateProductPrice) {
      const price = parseFloat(editPriceVal);
      if (!isNaN(price) && price > 0) {
        onUpdateProductPrice(editingProduct.id, price);
      }
    }
    setEditingProduct(null);
  };

  return (
    <div className="space-y-6 animate-fade-in font-['Inter',sans-serif]">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E5EAE8] shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-[#0E5A4F] uppercase tracking-wider bg-[#E6F4ED] px-2 py-0.5 rounded">
              UNIT PRODUCTS & INVENTORY
            </span>
            <span className="text-xs text-[#71807B]">{business.name}</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-[#18211F] mt-1">
            Product Catalog & Price List
          </h2>
          <p className="text-xs text-[#71807B] mt-0.5">
            Total <strong>{products.length} products</strong> listed in catalog. You can update unit prices or add new products.
          </p>
        </div>

        <button
          id="products-add-btn"
          onClick={onOpenAddProductModal}
          className="px-4 py-2.5 rounded-xl bg-[#0E5A4F] hover:bg-[#073F37] text-white text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Product</span>
        </button>
      </div>

      {/* Category Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => {
          const count = cat === 'All' 
            ? products.length 
            : products.filter(p => p.category?.toLowerCase() === cat.toLowerCase()).length;
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer border ${
                isSelected
                  ? 'bg-[#0E5A4F] text-white border-[#0E5A4F] shadow-xs'
                  : 'bg-white text-[#71807B] border-[#E5EAE8] hover:bg-[#F6F8F7] hover:text-[#18211F]'
              }`}
            >
              <span>{cat}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-[#F6F8F7] text-[#71807B]'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search & Counter Strip */}
      <div className="bg-white p-4 rounded-xl border border-[#E5EAE8] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-[#71807B]" />
          <input
            id="search-products-input"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by product name, unit or category..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-[#E5EAE8] bg-[#F6F8F7] focus:bg-white focus:border-[#0E5A4F] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-4 text-xs text-[#71807B] font-medium">
          <span>Showing Products: <strong className="text-[#18211F]">{filteredProducts.length}</strong> (Out of {products.length} total)</span>
          <span>•</span>
          <span>Business Unit: <strong className="text-[#0E5A4F]">{business.name}</strong></span>
        </div>
      </div>

      {/* Product Grid / Table */}
      <div className="bg-white rounded-2xl border border-[#E5EAE8] shadow-xs overflow-hidden">
        {filteredProducts.length === 0 ? (
          <div className="p-12 text-center text-[#71807B] text-xs">
            <Package className="w-8 h-8 text-[#A3B8B0] mx-auto mb-2" />
            <p>No products found.</p>
            <button
              onClick={onOpenAddProductModal}
              className="mt-2 text-[#0E5A4F] font-bold underline cursor-pointer"
            >
              + Add New Product
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-[#0E5A4F] text-white text-[10px] uppercase font-bold tracking-wider">
                <tr>
                  <th className="p-3">#</th>
                  <th className="p-3">Product Name</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Unit</th>
                  <th className="p-3 text-right">Unit Price</th>
                  <th className="p-3 text-center">Stock</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5EAE8]">
                {filteredProducts.map((p, idx) => (
                  <tr key={p.id} className="hover:bg-[#F6F8F7]/80 transition-colors group">
                    <td className="p-3 text-[#71807B] font-mono text-[11px]">{idx + 1}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-[#E6F4ED] text-[#0E5A4F] flex items-center justify-center font-bold text-xs shrink-0">
                          <Package className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="font-bold text-[#18211F] block text-xs group-hover:text-[#0E5A4F] transition-colors">
                            {p.name}
                          </span>
                          {p.notes && (
                            <span className="text-[10px] text-[#71807B] block truncate max-w-[200px]" title={p.notes}>
                              {p.notes}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-[#F6F8F7] border border-[#E5EAE8] text-[10px] font-bold text-[#71807B]">
                        {p.category || 'General'}
                      </span>
                    </td>

                    <td className="p-3">
                      <span className="font-semibold text-xs text-[#0E5A4F] bg-[#E6F4ED] px-2 py-0.5 rounded inline-block">
                        {p.unit}
                      </span>
                    </td>

                    <td className="p-3 text-right font-mono">
                      <span className="text-sm font-bold text-[#18211F]">
                        ৳ {p.unitPrice.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-[#71807B] block">/ {p.unit}</span>
                    </td>

                    <td className="p-3 text-center font-mono">
                      <span className="font-bold text-xs text-[#18211F]">
                        {p.stock !== undefined ? p.stock : '—'}
                      </span>
                      {p.stock !== undefined && (
                        <span className="text-[10px] text-[#22A06B] block font-sans">In-Stock</span>
                      )}
                    </td>

                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => handleStartEdit(p)}
                          className="p-1 rounded text-[#0E5A4F] hover:bg-[#E6F4ED] transition-colors cursor-pointer"
                          title="Update Price"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setProductToDelete(p)}
                          className="p-1 rounded text-[#71807B] hover:text-[#D9534F] hover:bg-red-50 transition-colors cursor-pointer"
                          title="Delete Product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Price Edit Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-[#E5EAE8]">
            <h3 className="text-sm font-bold text-[#18211F]">Update Unit Price</h3>
            <p className="text-xs text-[#71807B] mt-0.5">{editingProduct.name} ({editingProduct.unit})</p>

            <div className="my-4">
              <label className="block text-xs font-bold text-[#18211F] mb-1">
                New Unit Price (৳)
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center font-bold text-[#0E5A4F]">৳</span>
                <input
                  type="number"
                  min="0"
                  step="any"
                  autoFocus
                  value={editPriceVal}
                  onChange={(e) => setEditPriceVal(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 rounded-lg border border-[#0E5A4F] text-sm font-bold text-[#18211F] focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setEditingProduct(null)}
                className="px-3 py-1.5 rounded-lg border border-[#E5EAE8] text-xs font-semibold text-[#71807B] hover:bg-[#F6F8F7] cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSavePrice}
                className="px-4 py-1.5 rounded-lg bg-[#0E5A4F] hover:bg-[#073F37] text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Product Confirmation Modal */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 text-center shadow-2xl border border-[#E5EAE8]">
            <div className="w-12 h-12 rounded-full bg-red-100 text-[#D9534F] flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#18211F]">Confirm Product Deletion</h3>
            <p className="text-xs text-[#71807B] mt-1">
              Are you sure you want to delete <strong>{productToDelete.name}</strong> from the catalog?
            </p>
            <div className="mt-5 flex items-center justify-center gap-2.5">
              <button
                onClick={() => setProductToDelete(null)}
                className="px-4 py-2 rounded-lg border border-[#E5EAE8] text-xs font-bold text-[#71807B] hover:bg-[#F6F8F7] cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDeleteProduct(productToDelete.id);
                  setProductToDelete(null);
                }}
                className="px-4 py-2 rounded-lg bg-[#D9534F] hover:bg-red-700 text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
