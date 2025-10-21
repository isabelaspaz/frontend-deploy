import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditarConta = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nome: "",
        email: "",
        senha: "",
    });

    const [dadosOriginais, setDadosOriginais] = useState(null);

    useEffect(() => {
        const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));
        if (usuario) {
            const initData = {
                nome: usuario.nomeUsuario || "",
                email: usuario.emailUsuario || "",
                senha: "",
            };
            setFormData(initData);
            setDadosOriginais(initData);
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const validarEmail = (email) => {
        const re = /\S+@\S+\.\S+/;
        return re.test(email);
    };

    const validarNome = (nome) => {
        if (nome.length < 3) return false;
        if (!/^[A-ZÀ-Ú]/.test(nome)) return false; // inicia com letra maiúscula (com acentos)
        return true;
    };

    const validarSenha = (senha) => {
        const re = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
        return re.test(senha);
    };

    const emailJaExiste = async (email) => {
        if (email === dadosOriginais.email) return false;

        try {
            const response = await fetch(
                `http://localhost:8080/usuarios/email/${encodeURIComponent(email)}`,
                { method: "GET" }
            );
            return response.ok;
        } catch {
            return false;
        }
    };

    const handleSalvar = async (e) => {
        e.preventDefault();

        if (!formData.nome.trim()) {
            toast.error("Por favor, preencha o nome.");
            return;
        }
        if (!validarNome(formData.nome.trim())) {
            toast.error(
                "Nome deve ter ao menos 3 caracteres e iniciar com letra maiúscula."
            );
            return;
        }

        if (!formData.email.trim()) {
            toast.error("Por favor, preencha o email.");
            return;
        }
        if (!validarEmail(formData.email.trim())) {
            toast.error("Por favor, insira um email válido.");
            return;
        }

        const existeEmail = await emailJaExiste(formData.email.trim());
        if (existeEmail) {
            toast.error("Este email já está cadastrado no sistema.");
            return;
        }

        if (formData.senha) {
            if (!validarSenha(formData.senha)) {
                toast.error(
                    "Senha deve ter no mínimo 8 caracteres, incluindo 1 letra maiúscula, 1 número e 1 caractere especial."
                );
                return;
            }
        }

        const mudou =
            formData.nome !== dadosOriginais?.nome ||
            formData.email !== dadosOriginais?.email ||
            formData.senha !== "";

        if (!mudou) {
            toast.info("Nenhuma alteração detectada.");
            return;
        }

        const usuarioSalvo = JSON.parse(localStorage.getItem("usuarioLogado"));
        if (!usuarioSalvo?.idUsuario) {
            toast.error("Usuário não encontrado.");
            return;
        }

        const corpoAtualizado = {
            nomeUsuario: formData.nome.trim(),
            emailUsuario: formData.email.trim(),
            ...(formData.senha ? { senhaUsuario: formData.senha } : {}),
        };

        try {
            const response = await fetch(
                `http://localhost:8080/usuarios/${usuarioSalvo.idUsuario}`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(corpoAtualizado),
                }
            );

            if (response.ok) {
                const dadosAtualizados = await response.json();
                localStorage.setItem("usuarioLogado", JSON.stringify(dadosAtualizados));
                toast.success("Dados alterados com sucesso!");

                setTimeout(() => {
                    navigate("/inicial");
                }, 1500);
            } else {
                const erro = await response.text();
                toast.error(`Erro ao atualizar: ${erro}`);
            }
        } catch (error) {
            console.error(error);
            toast.error("Erro ao atualizar. Tente novamente.");
        }
    };

    const handleExcluirConta = async () => {
        const usuarioObj = JSON.parse(localStorage.getItem("usuarioLogado"));
        if (!usuarioObj?.idUsuario) return;

        const toastId = toast(
            ({ closeToast }) => (
                <div>
                    <p>Tem certeza que deseja excluir sua conta?</p>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "flex-end",
                            gap: "1rem",
                            marginTop: "0.5rem",
                        }}
                    >
                        <button
                            onClick={async () => {
                                try {
                                    const response = await fetch(
                                        `http://localhost:8080/usuarios/${usuarioObj.idUsuario}`,
                                        {
                                            method: "DELETE",
                                            headers: {
                                                "Content-Type": "application/json",
                                            },
                                        }
                                    );

                                    if (response.ok) {
                                        localStorage.removeItem("usuarioLogado");
                                        toast.success("Conta excluída com sucesso!");
                                        navigate("/login");
                                    } else {
                                        toast.error("Erro ao excluir conta.");
                                    }
                                } catch (error) {
                                    console.error(error);
                                    toast.error("Erro ao excluir. Tente novamente.");
                                } finally {
                                    toast.dismiss(toastId);
                                }
                            }}
                            style={{
                                backgroundColor: "#e50914",
                                color: "white",
                                border: "none",
                                padding: "8px 20px",
                                borderRadius: "20px", // <- arredondado maior
                                cursor: "pointer",
                                fontSize: "0.9rem",
                            }}
                        >
                            Sim
                        </button>
                        <button
                            onClick={() => toast.dismiss(toastId)}
                            style={{
                                backgroundColor: "#e50914",
                                color: "white",
                                border: "none",
                                padding: "8px 20px",
                                borderRadius: "20px", // <- arredondado maior
                                cursor: "pointer",
                                fontSize: "0.9rem",
                            }}
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            ),
            {
                position: "top-center",
                autoClose: false,
                closeOnClick: false,
                draggable: false,
                closeButton: false,
                style: {
                    background: "#1a1a1a",
                    borderRadius: "12px",
                    padding: "1rem 1.2rem",
                    color: "#fff",
                },
            }
        );
    };

    const handleFechar = () => {
        navigate("/inicial");
    };

    return (
        <div className="paginaCentralizada">
            <ToastContainer
                position="top-center"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={true}
                closeOnClick={true}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
                style={{
                    borderRadius: "12px",
                    padding: "1rem 1.2rem",
                }}
            />
            <div className="conteinerRegistro" style={{ position: "relative" }}>
                <button
                    onClick={handleFechar}
                    aria-label="Fechar"
                    style={{
                        position: "absolute",
                        top: "10px",
                        right: "10px",
                        background: "transparent",
                        border: "none",
                        fontSize: "1.5rem",
                        cursor: "pointer",
                        color: "var(--primary-bright-color)",
                    }}
                >
                    &times;
                </button>

                <h2>Editar Conta</h2>
                <form onSubmit={handleSalvar} noValidate>
                    <input
                        type="text"
                        name="nome"
                        placeholder="Nome"
                        value={formData.nome}
                        onChange={handleChange}
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                    <input
                        type="password"
                        name="senha"
                        placeholder="Senha (deixe vazio para manter):"
                        value={formData.senha}
                        onChange={handleChange}
                    />

                    <div className="botoesEditarConta">
                        <button
                            type="submit"
                            className="botaoAcao"
                            style={{ borderRadius: "20px" }} // arredondado maior
                        >
                            Salvar
                        </button>
                        <button
                            type="button"
                            onClick={handleExcluirConta}
                            className="botaoAcao"
                            style={{ borderRadius: "20px" }} // arredondado maior
                        >
                            Excluir conta
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditarConta;
