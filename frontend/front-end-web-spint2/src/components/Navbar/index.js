import React from "react";
import { useAuth } from '../../AuthContext'; // Import useAuth hook
import {
    Nav,
    NavLink,
    NavMenu,
} from "./NavbarElements";

const Navbar = () => {
    const { isAuthenticated, logout} =useAuth();
    return (
        <>
            <Nav>

                <NavMenu>
                {!isAuthenticated && (
                    <NavLink to="/">Login
                    </NavLink>
                )}
                {isAuthenticated && (
                    <>
                    <NavLink to="/home" >
                        Home
                    </NavLink>
                    <NavLink to="/about" >
                        About
                    </NavLink>
                    <NavLink to="/planners" >
                        Travel Planners
                    </NavLink>
                    <button onClick={logout}>Logout</button>
                    </>
                )}
                </NavMenu>
            </Nav>
        </>
    );
};

export default Navbar;