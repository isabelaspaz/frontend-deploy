import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './MenuUsuario.css';

const MenuUsuario = ({ onLogout }) => {
    const [open, setOpen] = useState(false);
    const menuRef = useRef();
    const navigate = useNavigate();
    const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));


    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setOpen(false);

            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);


    if (!usuarioLogado) return null;

    const handleEditAccount = () => {
        setOpen(false);
        navigate('/editar-conta');
    };

    return (
        <div className="menu-usuario" ref={menuRef}>
            <button
                className="botao-seta"
                onClick={() => {
                    setOpen(!open);

                }}
            >
                ▼
            </button>
            {open && (
                <div className="menu-dropdown">
                    <button onClick={handleEditAccount}>
                        Editar conta
                    </button>
                    <button
                        onClick={() => {
                            setOpen(false);
                            navigate('/estatisticas');  
                        }}
                    >
                        Estatísticas
                    </button>


                    <button
                        onClick={() => {
                            onLogout();
                            setOpen(false);
                            navigate('/home');
                        }}
                    >
                        Sair
                    </button>

                </div>
            )}
        </div>
    );
};

export default MenuUsuario;
