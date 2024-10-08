import React from "react";
import { useAuth } from '../../AuthContext'; // Import useAuth hook
import {
    Nav,
    NavLink,
    Bars,
    NavMenu,
} from "./NavbarElements";

const Navbar = () => {
    const { isAuthenticated, logout} =useAuth();
    return (
        <>
            <Nav>
                <Bars />

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
                    <button onClick={logout}>Logout</button>
                    </>
                )}
                </NavMenu>
            </Nav>
        </>
    );
};

export default Navbar;