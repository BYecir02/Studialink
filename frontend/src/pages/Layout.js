import React from 'react';
import Navbar from '../components/Navbar/Navbar';
import { Outlet } from 'react-router-dom';

export default function Layout({ user, onLogout }) {
  return (
    <>
      <Navbar user={user} onLogout={onLogout} />
      <main>
        <Outlet />
      </main>
    </>
  );
}