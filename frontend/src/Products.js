import React, { useEffect, useState, useRef } from 'react';
export default function Products({ token, role }) {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ title:'', description:'', price:'', stock:'', image:null });
  const [cart, setCart] = useState(JSON.parse(localStorage.getItem('cart')||'[]'));
  const fileRef = useRef();

  useEffect(()=>{ fetch('http://localhost:5000/api/products').then(r=>r.json()).then(setProducts); },[]);
  useEffect(()=>{ localStorage.setItem('cart', JSON.stringify(cart)); const el = document.getElementById('cartCount'); if(el) el.innerText = cart.reduce((s,i)=>s+i.qty,0); },[cart]);

  useEffect(()=>{
    const input = document.getElementById('searchInput');
    if(!input) return;
    const handler = () => {
      const q = input.value.toLowerCase();
      if(!q) { fetch('http://localhost:5000/api/products').then(r=>r.json()).then(setProducts); return; }
      setProducts((prev)=> prev.filter(p=> (p.title||'').toLowerCase().includes(q) ));
    };
    input.addEventListener('input', handler);
    return ()=> input.removeEventListener('input', handler);
  },[]);

  const updateField = (k,v)=> setForm(prev=>({...prev,[k]: v === '' ? '' : v }));

  const addProduct = async ()=>{
    if(!form.title || !form.price || !form.stock){ alert('Please fill title, price and stock'); return; }
    const fd = new FormData();
    fd.append('title', form.title); fd.append('description', form.description||''); fd.append('price', Number(form.price)); fd.append('stock', Number(form.stock));
    if(form.image) fd.append('image', form.image);
    const res = await fetch('http://localhost:5000/api/products', { method:'POST', headers: { 'Authorization': 'Bearer ' + token }, body: fd });
    const data = await res.json();
    if(data._id){ setProducts(p=>[data,...p]); setForm({ title:'', description:'', price:'', stock:'', image:null }); if(fileRef.current) fileRef.current.value=''; } else alert(data.error || 'Error');
  };

  const addToCart = (p)=>{
    if(role!=='buyer') return;
    setCart(c=>{ const ex = c.find(x=>x.productId===p._id); if(ex) return c.map(x=>x.productId===p._id?{...x,qty:x.qty+1}:x); return [{ productId: p._id, title: p.title, price: p.price, qty: 1 }, ...c]; });
  };

  // Buy now - instant checkout for a single product
  const buyNow = async (p)=>{
    if(role!=='buyer') return alert('Only buyers can purchase');
    const res = await fetch('http://localhost:5000/api/orders', { method:'POST', headers:{ 'Content-Type':'application/json', 'Authorization':'Bearer '+token }, body: JSON.stringify({ items:[{ productId: p._id, qty:1, price: p.price }], total: p.price }) });
    const data = await res.json();
    if(data._id){ alert('Order placed (Buy now)'); setProducts(ps=>ps.map(x=> x._id===p._id ? {...x, stock: Math.max(0, x.stock-1)} : x)); }
    else alert(data.error || 'Error');
  };

  const checkout = async ()=>{
    if(!token) return alert('Login as buyer');
    const total = cart.reduce((s,i)=>s+i.price*i.qty,0);
    const res = await fetch('http://localhost:5000/api/orders', { method:'POST', headers:{ 'Content-Type':'application/json', 'Authorization':'Bearer '+token }, body: JSON.stringify({ items: cart.map(i=>({ productId: i.productId, qty: i.qty, price: i.price })), total }) });
    const data = await res.json();
    if(data._id){ alert('Order placed'); setCart([]); setProducts(p=>p.map(x=>{ const it = cart.find(ci=>ci.productId===x._id); if(it) x.stock = Math.max(0, x.stock - it.qty); return x; })); } else alert(data.error || 'Error');
  };

  return <div className="products">
    <h3>Products</h3>
    {role==='seller' && <div className="add-form panel">
      <input placeholder="Title" value={form.title} onChange={e=>updateField('title', e.target.value)} />
      <input placeholder="Price" type="number" value={form.price} onChange={e=>updateField('price', e.target.value)} />
      <input placeholder="Stock" type="number" value={form.stock} onChange={e=>updateField('stock', e.target.value)} />
      <input type="file" ref={fileRef} onChange={e=>setForm(prev=>({...prev,image:e.target.files[0]}))} />
      <button onClick={addProduct}>Add Product</button>
    </div>}
    <div className="list">{products.map(p=>(
      <div key={p._id} className="card">
        <img src={p.image ? `http://localhost:5000${p.image}` : '/logo.png'} alt={p.title} style={{width:140, height:140, objectFit:'cover', borderRadius:8}} />
        <h4>{p.title}</h4>
        <p>₹{p.price}</p>
        <p>Stock: {p.stock}</p>
        <p>Seller: {p.seller? p.seller.username : '—'}</p>
        {role==='buyer' && <div style={{display:'flex',gap:8,justifyContent:'center'}}><button onClick={()=>addToCart(p)}>Add to cart</button><button onClick={()=>buyNow(p)}>Buy now</button></div>}
      </div>
    ))}</div>

    {role==='buyer' && <div className="cart panel">
      <h4>Cart</h4>
      {cart.length===0? <p>No items</p> : <div>{cart.map((c,i)=>(<div key={i}>{c.title} x {c.qty} - ₹{c.price*c.qty}</div>))}
      <p>Total: ₹{cart.reduce((s,i)=>s+i.price*i.qty,0)}</p>
      <button onClick={checkout}>Checkout</button></div>}
    </div>}
  </div>;
}
