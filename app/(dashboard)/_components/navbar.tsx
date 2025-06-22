import React from 'react';
import { MobileSidebar } from './mobile-side-bar';
import { NavbarRoutes } from './navbar-routes';

export const Navbar = () => {
  return (
    <div className='p-4 border-b h-full flex items-center bg-white shadow-md'>
        {/* mobile routes */}
        <MobileSidebar/>
        {/* sidebar routes */}
        <NavbarRoutes/>
    </div>
  );
};
