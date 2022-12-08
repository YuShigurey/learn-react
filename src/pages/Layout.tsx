import React from "react";
import {Link, Outlet} from "react-router-dom";

function Navbar() {
    return (
        <nav>
            <ul>
                <li>
                    <Link to="/">Home</Link>
                </li>
                <li>
                    <Link to="/three">Three</Link>
                </li>
                {/*<li>*/}
                {/*    <Link to="/blogs">Blogs</Link>*/}
                {/*</li>*/}
                {/*<li>*/}
                {/*    <Link to="/contact">Contact</Link>*/}
                {/*</li>*/}
            </ul>
        </nav>
    );
}

const Layout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

export default Layout;