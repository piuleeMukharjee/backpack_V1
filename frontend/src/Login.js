import React, { useState } from 'react';
export default function Login({ onLogin }){
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ username:'', password:'', email:'', role:'buyer' });

  const api = (path, data) => fetch('http://localhost:5000/api/auth/'+path, { method:'POST', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify(data) }).then(r=>r.json());

  const submit = async (e) => {
    e.preventDefault();
    if(mode==='login'){
      const res = await api('login', { username: form.username, password: form.password });
      if(res.token) onLogin(res.token, res.role, res.username || form.username); else alert(res.error || 'Login failed');
    } else {
      const res = await api('register', form);
      if(res.id) { alert('Registered. Please login.'); setMode('login'); } else alert(res.error || 'Registration failed');
    }
  };

  return <div className="auth-box">
    <h2>{mode==='login' ? 'Login' : 'Sign up'}</h2>
    <form onSubmit={submit}>
      {mode==='signup' && <input placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} />}
      <input placeholder="Username" value={form.username} onChange={e=>setForm({...form,username:e.target.value})} />
      <input placeholder="Password" type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} />
      {mode==='signup' && <select value={form.role} onChange={e=>setForm({...form,role:e.target.value})}><option value="buyer">Buyer</option><option value="seller">Seller</option></select>}
      <button type="submit">{mode==='login' ? 'Login' : 'Register'}</button>
    </form>
    <p><button type="button" onClick={()=>setMode(mode==='login'?'signup':'login')}>Switch to {mode==='login'?'Signup':'Login'}</button></p>
  </div>;
}
