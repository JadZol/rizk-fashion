// app/admin/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Product = {
  id: string;
  name: string;
  price: number;
  sale_price: number | null;
  description: string | null;
  image_url: string | null;
  image_urls: string | null;
  sizes: string | null;
  colors: string | null;
  category: string | null;
  stock_status: string | null;
};

const AVAILABLE_SIZES = ["XS", "S", "M", "L", "XL"];
const AVAILABLE_COLORS = ["Black", "White", "Beige", "Rose", "Red", "Navy", "Grey", "Brown"];
const CATEGORIES = ["Dresses", "Tops & Sweaters", "Shirts", "Coats & Jackets", "Jeans", "Pants", "Skirts", "Shorts"];
const STOCK_OPTIONS = [
  "In Stock — Ready for Express Delivery",
  "Low Stock — Only 2 pieces left",
  "Last Piece Available",
  "Made to Order / Pre-Order"
];

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  
  // Form state
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [category, setCategory] = useState("Dresses");
  const [stockStatus, setStockStatus] = useState(STOCK_OPTIONS[0]);
  const [description, setDescription] = useState("");
  
  const [selectedSizes, setSelectedSizes] = useState<string[]>(["S", "M", "L"]);
  const [selectedColors, setSelectedColors] = useState<string[]>(["Black", "White", "Rose"]);

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState("");

  useEffect(() => {
    async function init() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/admin/login");
        return;
      }
      fetchInventory();
      setLoading(false);
    }
    init();
  }, [router]);

  async function fetchInventory() {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) {
      setProducts(data);
    }
  }

  function toggleSize(size: string) {
    if (selectedSizes.includes(size)) {
      setSelectedSizes(selectedSizes.filter(s => s !== size));
    } else {
      setSelectedSizes([...selectedSizes, size]);
    }
  }

  function toggleColor(color: string) {
    if (selectedColors.includes(color)) {
      setSelectedColors(selectedColors.filter(c => c !== color));
    } else {
      setSelectedColors([...selectedColors, color]);
    }
  }

  async function handleAddProduct(e: React.FormEvent) {
    e.preventDefault();
    if (selectedSizes.length === 0) {
      alert("Please select at least one size.");
      return;
    }
    if (selectedColors.length === 0) {
      alert("Please select at least one color.");
      return;
    }

    setUploading(true);

    const uploadedUrls: string[] = [];
    for (const file of imageFiles) {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(fileName, file);

      if (!uploadError) {
        const { data } = supabase.storage
          .from("product-images")
          .getPublicUrl(fileName);
        if (data.publicUrl) uploadedUrls.push(data.publicUrl);
      }
    }

    const mainImageUrl = uploadedUrls.length > 0 ? uploadedUrls[0] : null;
    const allImageUrlsString = uploadedUrls.length > 0 ? uploadedUrls.join(", ") : null;

    const { error } = await supabase.from("products").insert([
      {
        name,
        price: parseFloat(price),
        sale_price: salePrice ? parseFloat(salePrice) : null,
        category,
        stock_status: stockStatus,
        description: description || null,
        sizes: selectedSizes.join(", "),
        colors: selectedColors.join(", "),
        image_url: mainImageUrl,
        image_urls: allImageUrlsString,
      },
    ]);

    setUploading(false);

    if (error) {
      alert("Error adding product: " + error.message);
    } else {
      alert("Product published successfully with gallery!");
      setName("");
      setPrice("");
      setSalePrice("");
      setDescription("");
      setImageFiles([]);
      fetchInventory();
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this product?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (!error) fetchInventory();
  }

  async function handleUpdate(id: string) {
    const { error } = await supabase
      .from("products")
      .update({
        name: editName,
        price: parseFloat(editPrice),
      })
      .eq("id", id);

    if (error) {
      alert("Error updating product: " + error.message);
    } else {
      setEditingId(null);
      fetchInventory();
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/admin/login");
  }

  if (loading) return <p className="p-10 text-center font-light text-[#6B5F5A]">Loading secure portal...</p>;

  const totalItems = products.length;
  const saleItemsCount = products.filter(p => p.sale_price !== null && p.sale_price > 0).length;

  return (
    <main className="min-h-screen bg-[#FBF3EC] p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="bg-white p-6 border border-[#F3D9CE] flex justify-between items-center shadow-sm">
          <h1 className="text-2xl font-serif text-[#2E2624]">Rizk Fashion Admin Control</h1>
          <button onClick={handleLogout} className="text-[#6B5F5A] underline text-sm hover:text-[#2E2624]">
            Sign Out
          </button>
        </div>

        {/* Analytics Summary Row */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-6 border border-[#F3D9CE] text-center shadow-sm">
            <p className="text-xs uppercase tracking-widest text-[#6B5F5A] mb-1">Total Catalog Items</p>
            <p className="text-3xl font-serif text-[#2E2624]">{totalItems}</p>
          </div>
          <div className="bg-white p-6 border border-[#F3D9CE] text-center shadow-sm">
            <p className="text-xs uppercase tracking-widest text-red-600 mb-1">Active Sale Items</p>
            <p className="text-3xl font-serif text-red-600">{saleItemsCount}</p>
          </div>
        </div>

        {/* Add Product Form */}
        <div className="bg-white p-8 border border-[#F3D9CE] shadow-sm">
          <h2 className="text-xl text-[#2E2624] mb-6 font-medium">Add New Clothing Item (Multi-Photo Gallery)</h2>
          <form onSubmit={handleAddProduct} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#6B5F5A] mb-2">Product Name</label>
                <input required value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-2 border border-[#F3D9CE] focus:outline-none focus:border-[#D98C7A]" placeholder="e.g. Silk Evening Dress" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#6B5F5A] mb-2">Category</label>
                <select value={category} onChange={e => setCategory(e.target.value)} className="w-full px-4 py-2 border border-[#F3D9CE] bg-white focus:outline-none focus:border-[#D98C7A]">
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#6B5F5A] mb-2">Regular Price ($)</label>
                <input type="number" step="0.01" required value={price} onChange={e => setPrice(e.target.value)} className="w-full px-4 py-2 border border-[#F3D9CE] focus:outline-none focus:border-[#D98C7A]" placeholder="0.00" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-red-600 mb-2">Sale Price ($) - Optional</label>
                <input type="number" step="0.01" value={salePrice} onChange={e => setSalePrice(e.target.value)} className="w-full px-4 py-2 border border-red-200 focus:outline-none focus:border-red-400" placeholder="Leave blank if not on sale" />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#6B5F5A] mb-2">Stock Urgency Status</label>
              <select value={stockStatus} onChange={e => setStockStatus(e.target.value)} className="w-full px-4 py-2 border border-[#F3D9CE] bg-white focus:outline-none focus:border-[#D98C7A] text-sm">
                {STOCK_OPTIONS.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            {/* Sizes Grid */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#6B5F5A] mb-2">Select Available Sizes</label>
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_SIZES.map(size => {
                  const isSelected = selectedSizes.includes(size);
                  return (
                    <button
                      type="button"
                      key={size}
                      onClick={() => toggleSize(size)}
                      className={`w-12 h-12 text-sm font-medium border transition-all ${
                        isSelected 
                          ? "bg-[#2E2624] text-white border-[#2E2624]" 
                          : "bg-white text-[#6B5F5A] border-[#F3D9CE] hover:border-[#D98C7A]"
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Colors Grid */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#6B5F5A] mb-2">Select Available Colors</label>
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_COLORS.map(color => {
                  const isSelected = selectedColors.includes(color);
                  return (
                    <button
                      type="button"
                      key={color}
                      onClick={() => toggleColor(color)}
                      className={`px-4 py-2 text-xs uppercase tracking-wider border transition-all ${
                        isSelected 
                          ? "bg-[#2E2624] text-white border-[#2E2624]" 
                          : "bg-white text-[#6B5F5A] border-[#F3D9CE] hover:border-[#D98C7A]"
                      }`}
                    >
                      {color}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#6B5F5A] mb-2">Description (Optional)</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full px-4 py-2 border border-[#F3D9CE] focus:outline-none focus:border-[#D98C7A]" rows={2} placeholder="Leave blank or type details..." />
            </div>

            {/* Multi-Photo Upload */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#6B5F5A] mb-2">Product Photos (Select multiple for gallery)</label>
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-[#F3D9CE] cursor-pointer bg-[#FAFAFA] hover:bg-[#F3D9CE]/20 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4 text-center">
                  <svg className="w-8 h-8 mb-2 text-[#6B5F5A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                  <p className="text-sm text-[#2E2624] font-medium">
                    {imageFiles.length > 0 ? `${imageFiles.length} photo(s) selected` : "Click to select multiple product photos"}
                  </p>
                  <p className="text-xs text-[#6B5F5A] mt-1">First photo will be the main display cover</p>
                </div>
                <input 
                  type="file" 
                  accept="image/*" 
                  multiple
                  className="hidden" 
                  onChange={e => { if (e.target.files) setImageFiles(Array.from(e.target.files)); }} 
                />
              </label>
            </div>

            <button 
              type="submit" 
              disabled={uploading} 
              className="w-full bg-[#D98C7A] text-white py-4 uppercase tracking-widest text-sm hover:bg-[#C4735F] transition-colors font-medium disabled:opacity-50"
            >
              {uploading ? "Publishing Product & Photos..." : "Publish Product"}
            </button>
          </form>
        </div>

        {/* Inventory List */}
        <div className="bg-white p-8 border border-[#F3D9CE] shadow-sm">
          <h2 className="text-xl text-[#2E2624] mb-6 font-medium">Inventory ({products.length})</h2>
          <div className="space-y-4">
            {products.map(p => (
              <div key={p.id} className="flex items-center justify-between border-b border-[#F3D9CE] pb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-16 bg-[#F3D9CE] overflow-hidden flex-shrink-0">
                    {p.image_url && <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />}
                  </div>
                  <div>
                    {editingId === p.id ? (
                      <div className="flex space-x-2">
                        <input value={editName} onChange={e => setEditName(e.target.value)} className="px-2 py-1 border border-[#F3D9CE] text-sm" />
                        <input value={editPrice} onChange={e => setEditPrice(e.target.value)} className="px-2 py-1 border border-[#F3D9CE] text-sm w-20" />
                      </div>
                    ) : (
                      <>
                        <h3 className="text-sm font-medium text-[#2E2624]">
                          {p.name} <span className="text-xs bg-[#F3D9CE] px-2 py-0.5 ml-2 text-[#2E2624]">{p.category || "Collection"}</span>
                        </h3>
                        <p className="text-xs text-[#D98C7A] mt-0.5">
                          {p.sale_price ? (
                            <>
                              <span className="line-through text-gray-400 mr-2">${p.price.toFixed(2)}</span>
                              <span className="text-red-600 font-bold">Sale: ${p.sale_price.toFixed(2)}</span>
                            </>
                          ) : (
                            `$${p.price.toFixed(2)}`
                          )}
                        </p>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex space-x-3 text-sm">
                  {editingId === p.id ? (
                    <>
                      <button onClick={() => handleUpdate(p.id)} className="text-green-700 underline font-medium">Save</button>
                      <button onClick={() => setEditingId(null)} className="text-gray-600 underline">Cancel</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => { setEditingId(p.id); setEditName(p.name); setEditPrice(p.price.toString()); }} className="text-[#6B5F5A] underline hover:text-[#2E2624]">Edit</button>
                      <button onClick={() => handleDelete(p.id)} className="text-red-600 underline hover:text-red-800">Delete</button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}