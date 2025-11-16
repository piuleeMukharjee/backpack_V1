import React, { useState } from 'react';
import Login from './Login';
import Dashboard from './Dashboard';
import Products from './Products';
import AdminPanel from './AdminPanel';

export default function App(){
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [role, setRole] = useState(localStorage.getItem('role'));
  const [username, setUsername] = useState(localStorage.getItem('username') || '');

  if(!token) return <Login onLogin={(t,r,uname)=>{ localStorage.setItem('token',t); localStorage.setItem('role',r); localStorage.setItem('username',uname); setToken(t); setRole(r); setUsername(uname); }} />;

  return <div>
    <nav className="topbar">
      <div className="left"><img src="/logo.png" alt="logo" /><span className="brand">Genie Backpack</span></div>
      <div className="center"><input className="search" placeholder="Search products..." id="searchInput" /></div>
      <div className="right"><div className="cartIcon">🛒 <span id="cartCount">0</span></div><button className="logout" onClick={()=>{ localStorage.clear(); window.location.reload(); }}>Logout</button></div>
    </nav>
    <div className="container">
      <Dashboard role={role} username={username} />
      {role==='admin' && <AdminPanel token={token} />}
      <Products token={token} role={role} />
    </div>
  </div>;
}
