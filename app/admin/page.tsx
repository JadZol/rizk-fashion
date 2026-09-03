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
const QUICK_COLORS = ["Black", "White", "Beige", "Camel", "Rose", "Pink", "Red", "Burgundy", "Navy", "Blue", "Green", "Grey", "Charcoal", "Brown", "Olive", "Gold", "Silver"];
const CATEGORIES = ["Dresses", "Tops & Sweaters", "Shirts", "Coats & Jackets", "Jeans", "Pants", "Skirts", "Shorts", "Sets"];
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

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [category, setCategory] = useState("Dresses");
  const [stockStatus, setStockStatus] = useState(STOCK_OPTIONS[0]);
  const [description, setDescription] = useState("");

  const [selectedSizes, setSelectedSizes] = useState<string[]>(["S", "M", "L"]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [photoColors, setPhotoColors] = useState<string[]>([]); 
  const [uploading, setUploading] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editSalePrice, setEditSalePrice] = useState("");
  const [editSizes, setEditSizes] = useState("");
  const [editColors, setEditColors] = useState("");

  useEffect(() => {
    async function init() {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
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
    setSelectedSizes(prev =>
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  }

  function handleFilesChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    setImageFiles(prev => [...prev, ...files]);

    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...newPreviews]);
    setPhotoColors(prev => [...prev, ...files.map(() => "")]);
  }

  function handleRemovePhoto(indexToRemove: number) {
    setImageFiles(prev => prev.filter((_, i) => i !== indexToRemove));
    setImagePreviews(prev => prev.filter((_, i) => i !== indexToRemove));
    setPhotoColors(prev => prev.filter((_, i) => i !== indexToRemove));
  }

  function handlePhotoColorChange(index: number, textValue: string) {
    const updated = [...photoColors];
    updated[index] = textValue;
    setPhotoColors(updated);
  }

  function handleClearPhotos() {
    setImageFiles([]);
    setImagePreviews([]);
    setPhotoColors([]);
    const fileInput = document.getElementById("product-photo-input") as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  }

  async function handleAddProduct(e: React.FormEvent) {
    e.preventDefault();
    if (selectedSizes.length === 0) {
      alert("Please select at least one size.");
      return;
    }
    if (imageFiles.length === 0) {
      alert("Please upload at least one product photo.");
      return;
    }

    const uniqueColors = Array.from(new Set(photoColors.map(c => c.trim()).filter(Boolean)));

    if (uniqueColors.length === 0) {
      alert("Please specify a color name for each uploaded photo.");
      return;
    }

    setUploading(true);

    const uploadResults = await Promise.all(
      imageFiles.map(async (file) => {
        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from("product-images")
          .upload(fileName, file);

        if (uploadError) return null;

        const { data } = supabase.storage
          .from("product-images")
          .getPublicUrl(fileName);

        return data.publicUrl ?? null;
      })
    );

    const uploadedUrls = uploadResults.filter((url): url is string => !!url);
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
        colors: uniqueColors.join(", "),
        image_url: mainImageUrl,
        image_urls: allImageUrlsString,
      },
    ]);

    setUploading(false);

    if (error) {
      alert("Error adding product: " + error.message);
    } else {
      alert("Product published successfully!");
      setName("");
      setPrice("");
      setSalePrice("");
      setDescription("");
      setImageFiles([]);
      setImagePreviews([]);
      setPhotoColors([]);
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
        sale_price: editSalePrice ? parseFloat(editSalePrice) : null,
        sizes: editSizes,
        colors: editColors,
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

        <div className="bg-white p-6 border border-[#F3D9CE] flex justify-between items-center shadow-sm">
          <h1 className="text-2xl font-serif text-[#2E2624]">Rizk Fashion Admin Control</h1>
          <button onClick={handleLogout} className="text-[#6B5F5A] underline text-sm hover:text-[#2E2624]">Sign Out</button>
        </div>

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

        <div className="bg-white p-8 border border-[#F3D9CE] shadow-sm">
          <h2 className="text-xl text-[#2E2624] mb-6 font-medium">Add New Clothing Item</h2>
          <form onSubmit={handleAddProduct} className="space-y-6">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#6B5F5A] mb-2">Product Name</label>
                <input required value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-2 border border-[#F3D9CE] focus:outline-none" placeholder="e.g. Silk Evening Dress" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#6B5F5A] mb-2">Category</label>
                <select value={category} onChange={e => setCategory(e.target.value)} className="w-full px-4 py-2 border border-[#F3D9CE] bg-white focus:outline-none">
                  {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#6B5F5A] mb-2">Regular Price ($)</label>
                <input type="number" step="0.01" required value={price} onChange={e => setPrice(e.target.value)} className="w-full px-4 py-2 border border-[#F3D9CE]" placeholder="0.00" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-red-600 mb-2">Sale Price ($) - Optional</label>
                <input type="number" step="0.01" value={salePrice} onChange={e => setSalePrice(e.target.value)} className="w-full px-4 py-2 border border-red-200" placeholder="Leave blank if not on sale" />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#6B5F5A] mb-2">Stock Urgency Status</label>
              <select value={stockStatus} onChange={e => setStockStatus(e.target.value)} className="w-full px-4 py-2 border border-[#F3D9CE] bg-white text-sm">
                {STOCK_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#6B5F5A] mb-2">Select Available Sizes</label>
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_SIZES.map(size => (
                  <button
                    type="button"
                    key={size}
                    onClick={() => toggleSize(size)}
                    className={`w-12 h-12 text-sm font-medium border transition-all ${
                      selectedSizes.includes(size) ? "bg-[#2E2624] text-white border-[#2E2624]" : "bg-white text-[#6B5F5A] border-[#F3D9CE]"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#6B5F5A] mb-2">Description (Optional)</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full px-4 py-2 border border-[#F3D9CE]" rows={2} />
            </div>

            {/* Product Photos with Individual Remove Buttons */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs uppercase tracking-wider text-[#6B5F5A]">
                  Product Gallery Photos & Color Assignment <span className="text-[10px] text-[#D98C7A]">(Click a color or type custom)</span>
                </label>
                {imageFiles.length > 0 && (
                  <button type="button" onClick={handleClearPhotos} className="text-xs text-red-600 underline font-medium">
                    Remove All Photos ({imageFiles.length})
                  </button>
                )}
              </div>
              
              <input
                id="product-photo-input"
                type="file"
                accept="image/*"
                multiple
                onChange={handleFilesChange}
                className="w-full p-2 border border-[#F3D9CE] text-sm bg-white mb-4"
              />

              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-[#FBF3EC] border border-[#F3D9CE]">
                  {imagePreviews.map((src, index) => (
                    <div key={index} className="flex flex-col gap-3 bg-white p-4 border border-[#F3D9CE] relative">
                      {/* Individual Remove Button */}
                      <button
                        type="button"
                        onClick={() => handleRemovePhoto(index)}
                        className="absolute top-2 right-2 bg-red-100 text-red-600 hover:bg-red-600 hover:text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold transition-colors"
                        title="Remove this photo"
                      >
                        ✕
                      </button>

                      <div className="flex items-center gap-4 pr-6">
                        <div className="w-16 h-20 bg-gray-100 flex-shrink-0 overflow-hidden">
                          <img src={src} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="text-[10px] uppercase tracking-wider font-bold text-[#2E2624]">Photo #{index + 1} {index === 0 && "(Cover)"}</p>
                          <label className="block text-[10px] text-[#6B5F5A] uppercase">Color Name:</label>
                          <input 
                            type="text"
                            value={photoColors[index] || ""}
                            onChange={(e) => handlePhotoColorChange(index, e.target.value)}
                            placeholder="e.g. Champagne"
                            className="w-full p-2 border border-[#F3D9CE] text-xs bg-white focus:outline-none focus:border-[#D98C7A]"
                          />
                        </div>
                      </div>

                      {/* Quick-Select Color Grid */}
                      <div>
                        <p className="text-[9px] uppercase tracking-wider text-gray-400 mb-1">Quick Select:</p>
                        <div className="flex flex-wrap gap-1">
                          {QUICK_COLORS.map(c => (
                            <button
                              key={c}
                              type="button"
                              onClick={() => handlePhotoColorChange(index, c)}
                              className="px-2 py-0.5 text-[9px] uppercase border border-[#F3D9CE] bg-[#FBF3EC] text-[#2E2624] hover:bg-[#2E2624] hover:text-white transition-colors"
                            >
                              {c}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button type="submit" disabled={uploading} className="w-full bg-[#D98C7A] text-white py-4 uppercase tracking-widest text-sm font-medium">
              {uploading ? "Publishing..." : "Publish Product"}
            </button>
          </form>
        </div>

        {/* Existing Inventory */}
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
                      <div className="space-y-2 py-1">
                        <div className="flex space-x-2">
                          <input value={editName} onChange={e => setEditName(e.target.value)} placeholder="Name" className="px-2 py-1 border border-[#F3D9CE] text-sm" />
                          <input value={editPrice} onChange={e => setEditPrice(e.target.value)} placeholder="Price" className="px-2 py-1 border border-[#F3D9CE] text-sm w-20" />
                          <input value={editSalePrice} onChange={e => setEditSalePrice(e.target.value)} placeholder="Sale $" className="px-2 py-1 border border-[#F3D9CE] text-sm w-20 text-red-600" />
                        </div>
                        <div className="flex space-x-2">
                          <input value={editSizes} onChange={e => setEditSizes(e.target.value)} placeholder="Sizes" className="px-2 py-1 border border-[#F3D9CE] text-xs w-48" />
                          <input value={editColors} onChange={e => setEditColors(e.target.value)} placeholder="Colors" className="px-2 py-1 border border-[#F3D9CE] text-xs w-48" />
                        </div>
                      </div>
                    ) : (
                      <>
                        <h3 className="text-sm font-medium text-[#2E2624]">
                          {p.name} <span className="text-xs bg-[#F3D9CE] px-2 py-0.5 ml-2 text-[#2E2624]">{p.category || "Collection"}</span>
                        </h3>
                        <p className="text-xs text-[#D98C7A] mt-0.5">
                          {p.sale_price ? (
                            <>
                              <span className="line-through text-gray-400 mr-2">${Number(p.price).toFixed(2)}</span>
                              <span className="text-red-600 font-bold">Sale: ${Number(p.sale_price).toFixed(2)}</span>
                            </>
                          ) : (
                            `$${Number(p.price).toFixed(2)}`
                          )}
                        </p>
                        <p className="text-[10px] text-gray-500 mt-0.5">Sizes: {p.sizes || "N/A"} | Colors: {p.colors || "N/A"}</p>
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
                      <button onClick={() => { setEditingId(p.id); setEditName(p.name); setEditPrice(p.price.toString()); setEditSalePrice(p.sale_price ? p.sale_price.toString() : ""); setEditSizes(p.sizes || ""); setEditColors(p.colors || ""); }} className="text-[#6B5F5A] underline hover:text-[#2E2624]">Edit</button>
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