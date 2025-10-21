import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Login() {
    const [emailUsuario, setEmailUsuario] = useState('');
    const [senhaUsuario, setSenhaUsuario] = useState('');
    const navigate = useNavigate();

    const validarEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    async function handleLogin(e) {
        e.preventDefault();

        if (!emailUsuario || !senhaUsuario) {
            toast.error('Preencha todos os campos.');
            return;
        }

        if (!validarEmail(emailUsuario)) {
            toast.error('E-mail inválido.');
            return;
        }

        const res = await fetch('http://localhost:8080/usuarios/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ emailUsuario, senhaUsuario }),
        });

        if (res.ok) {
            const data = await res.json();
            localStorage.setItem('usuarioLogado', JSON.stringify(data));
            toast.success('Login realizado com sucesso!');
            setTimeout(() => navigate('/inicial'), 1500);
        } else {
            toast.error('Login inválido!');
        }
    }

    return (
        <div className="paginaCentralizada">
            <form className="conteinerRegistro" onSubmit={handleLogin}>
                <h2>Entrar</h2>
                <input
                    type="text" 
                    placeholder="E-mail:"
                    value={emailUsuario}
                    onChange={(e) => setEmailUsuario(e.target.value)}
                    className="inputRegistro"
                
                />
                <input
                    type="password"
                    placeholder="Senha:"
                    value={senhaUsuario}
                    onChange={(e) => setSenhaUsuario(e.target.value)}
                    className="inputRegistro"
                
                />
                <button type="submit">Entrar</button>
                <p className="chamadaRegistro">
                    Não possui conta?{' '}
                    <Link to="/cadastro" style={{ color: "var(--primary-bright-color)" }}>
                        Cadastre-se
                    </Link>
                </p>
            </form>

            <ToastContainer
                position="top-center"
                autoClose={5000}
                hideProgressBar
                theme="dark"
            />
        </div>
    );
}
