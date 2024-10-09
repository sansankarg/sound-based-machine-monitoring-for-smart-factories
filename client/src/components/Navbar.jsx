import React from "react";
import '../CSS/Navbar.css'
import { Link, Outlet } from "react-router-dom";
var Navbar = () => {
    return (
        <div>
            <nav className='navbar navbar-expand-sm bg-dark justify-content-end'>
                <ul className='navbar-nav'>
                    <li className='nav-item m-3'><Link className='nav-link text-light' to='/home/'>Home</Link></li>
                    <li className='nav-item m-3'><Link className='nav-link text-light'  to='/home/industry'>Industry</Link></li>
                    <li className='nav-item m-3'><Link className='nav-link text-light' to='/home/dashboard'>Dashboard</Link></li>
                    <li className='nav-item m-3'><Link className='nav-link text-light' to='/home/notification'>Notification</Link></li>
                    <li className='nav-item m-3'><Link className='nav-link text-light' to='/home/profile'>Profile</Link></li>

                </ul>
            </nav>
            <Outlet/>
        </div>  
    )
}
export default Navbar 