import React, { useEffect, useState } from 'react';
export default function AdminPanel({ token }){
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);

  useEffect(()=>{
    fetch('http://localhost:5000/api/admin/stats', { headers:{ 'Authorization':'Bearer '+token } }).then(r=>r.json()).then(setStats);
    fetch('http://localhost:5000/api/admin/users', { headers:{ 'Authorization':'Bearer '+token } }).then(r=>r.json()).then(setUsers);
  },[]);

  const removeUser = async (id)=>{
    if(!confirm('Remove user?')) return;
    const res = await fetch('http://localhost:5000/api/admin/users/'+id, { method:'DELETE', headers:{ 'Authorization':'Bearer '+token } });
    if(res.ok){ setUsers(u=>u.filter(x=>x._id!==id)); alert('Removed'); } else alert('Failed');
  };

  return <div className="panel admin-panel">
    <h3>Admin Panel</h3>
    {stats ? <div className="stats">Products: {stats.totalProducts} • Sellers: {stats.totalSellers} • Orders: {stats.totalOrders}</div> : <p>Loading...</p>}
    <h4>Users</h4>
    <div className="user-list">{users.map(u=>(<div key={u._id} className="user-row">{u.username} ({u.role}) <button onClick={()=>removeUser(u._id)}>Remove</button></div>))}</div>
  </div>;
}
