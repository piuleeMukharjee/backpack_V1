import React from 'react';
export default function Dashboard({ role, username }){
  if(role==='admin') return <div className="panel admin"><h2>Admin Dashboard</h2><small>Manage platform</small></div>;
  if(role==='seller') return <div className="panel seller"><h2>Seller Dashboard</h2><small>Inventory & orders</small></div>;
  return <div className="panel buyer"><h2>Buyer Dashboard</h2><small>Shop & orders</small></div>;
}
