/* eslint-disable jsx-a11y/alt-text */
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import MenuUsuario from "../MenuUsuario/MenuUsuario";
import './Navbar.css';

const Navbar = ({ isLoggedIn, onLogout }) => {
    const navigate = useNavigate();



    const handleClick = (e) => {
        if (!isLoggedIn) {
            e.preventDefault();

        }
    };

    const handleLogout = () => {

        onLogout();
        navigate("/");
    };

    const handleEditAccount = () => {

    };

    return (
        <nav className="navbar">
            <div className="navbar-left">
                <Link
                    to={isLoggedIn ? "/inicial" : "#"}
                    onClick={handleClick}
                    className="navbar-logo"
                    aria-label="Ir para a página inicial"
                >
                    <video
                        className="navbar-logo-video"
                        autoPlay
                        loop
                        muted
                        playsInline
                        style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                    >
                        <source src="/cameraRodando.mp4" type="video/mp4" />
                        Seu navegador não suporta vídeo.
                    </video>
                </Link>

                <Link
                    to={isLoggedIn ? "/inicial" : "#"}
                    onClick={handleClick}
                    className="navbar-app-name"
                >
                    SceneRate
                </Link>
            </div>

            {isLoggedIn ? (
                <div className="menu-usuario-wrapper">
                    <MenuUsuario onLogout={handleLogout} onEditAccount={handleEditAccount} />
                </div>
            ) : (
                <p style={{ color: 'white' }}></p>
            )}
        </nav>
    );
};

export default Navbar;
