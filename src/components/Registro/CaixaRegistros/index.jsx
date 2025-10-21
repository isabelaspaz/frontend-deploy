import { useState } from 'react';
import CampoRegistro from '../CampoRegistro';
import BotaoRegistro from '../BotaoRegistro';
import { Link, useNavigate } from 'react-router-dom';
import { loginUsuario, cadastrarUsuario } from '../../../service/usuario';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './style.css';

const CaixaRegistros = ({ tipoCadastro }) => {
    const isLogin = tipoCadastro === 'Login';
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        senha: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const validarNome = (nome) => {
        return nome.length >= 3 && /^[A-ZÁÉÍÓÚÂÊÎÔÛÃÕÇ]/.test(nome);
    };

    const validarEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const validarSenha = (senha) => {
        const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
        return regex.test(senha);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();


        if (!formData.email || !formData.senha) {
            return toast.error('Preencha todos os campos obrigatórios.');
        }

        if (!validarEmail(formData.email)) {
            return toast.error('E-mail inválido.');
        }

        if (isLogin) {
            try {
                const data = await loginUsuario({
                    emailUsuario: formData.email,
                    senhaUsuario: formData.senha,
                });

                if (data && data.idUsuario) {
                    localStorage.setItem('usuarioLogado', JSON.stringify(data));
                    toast.success('Login realizado com sucesso!');


                    setTimeout(() => navigate('/inicial'), 1500);
                } else {
                    toast.error('Usuário não encontrado ou senha incorreta.');
                }
            } catch (error) {
                toast.error('Erro no login. Tente novamente.');
            }
        } else {

            if (!validarNome(formData.nome)) {
                return toast.error(
                    'Nome deve ter no mínimo 3 caracteres e começar com letra maiúscula.'
                );
            }

            if (!validarSenha(formData.senha)) {
                return toast.error(
                    'A senha deve ter no mínimo 8 caracteres, incluindo uma letra maiúscula, um número e um caractere especial.'
                );
            }

            try {
                const data = await cadastrarUsuario({
                    nomeUsuario: formData.nome,
                    emailUsuario: formData.email,
                    senhaUsuario: formData.senha,
                });

                toast.success('Cadastro realizado com sucesso!');

                setTimeout(() => navigate('/login'), 1500);
            } catch (error) {
                if (error.response?.status === 400) {
                    toast.error('E-mail já cadastrado.');
                } else {

                    toast.error(`Erro no cadastro: ${error.message}`);
                }
            }
        }
    };

    return (
        <div className="telaRegistro paginaCentralizada">
            <form
                className={`conteinerRegistro ${isLogin ? 'formLogin' : 'formCadastro'}`}
                onSubmit={handleSubmit}
                noValidate
            >
                <h2>{tipoCadastro}</h2>

                {!isLogin && (
                    <CampoRegistro
                        name="nome"
                        type="text"
                        value={formData.nome}
                        onChange={handleChange}
                        placeholder="Nome:"
                    />
                )}

                <CampoRegistro
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="E-mail:"
                />

                <CampoRegistro
                    name="senha"
                    type="password"
                    value={formData.senha}
                    onChange={handleChange}
                    placeholder="Senha:"
                />

                <BotaoRegistro tipoRegistro={tipoCadastro} />

                {isLogin ? (
                    <p className="chamadaRegistro">
                        Não possui conta?
                        <Link to="/cadastro"> Cadastre-se</Link>
                    </p>
                ) : (
                    <p className="chamadaRegistro">
                        Já possui uma conta?
                        <Link to="/login">Login</Link>
                    </p>
                )}
            </form>

            <ToastContainer
                position="top-center"
                autoClose={5000}
                hideProgressBar
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
            />
        </div>
    );
};

export default CaixaRegistros;
