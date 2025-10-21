import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./CadastroFilme.css";

const CadastroFilme = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const normalizarStatus = (status) => {
        if (!status) return "assistido";
        const s = status.toLowerCase();
        if (s === "assistido" || s === "assistidos") return "assistido";
        if (s === "assistindo" || s === "assistindo agora") return "assistindo";
        if (["quero_assistir", "queroassistir", "quero assistir"].includes(s))
            return "queroAssistir";
        if (["assistido", "assistindo", "queroAssistir"].includes(status)) return status;
        return "assistido";
    };

    const statusSelecionadoRaw = location.state?.statusSelecionado || "assistido";
    const statusSelecionado = normalizarStatus(statusSelecionadoRaw);

    const [formData, setFormData] = useState({
        tituloFilme: "",
        diretorFilme: "",
        anoFilme: "",
        generoFilme: "",
        posterFilme: null,
        avaliacaoFilme: "",
        notaFilme: "",
        statusFilme: statusSelecionado,
    });

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "posterFilme") {
            setFormData((prev) => ({ ...prev, posterFilme: files[0] || null }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const validar = () => {
        if (!formData.tituloFilme.trim()) {
            toast.error("Título é obrigatório");
            return false;
        }

        const diretor = formData.diretorFilme.trim();
        if (!diretor) {
            toast.error("Diretor é obrigatório");
            return false;
        }

        const partesDiretor = diretor.trim().split(/\s+/);
        if (partesDiretor.length < 2) {
            toast.error("Diretor deve conter nome e sobrenome.");
            return false;
        }


        if (!formData.anoFilme.trim()) {
            toast.error("Ano é obrigatório");
            return false;
        }

        const ano = Number(formData.anoFilme);
        if (isNaN(ano) || ano < 1850) {
            toast.error("Ano deve ser um número válido a partir de 1850");
            return false;
        }

        if (!formData.posterFilme) {
            toast.error("O poster é obrigatório");
            return false;
        }


        if (formData.notaFilme.trim()) {
            const nota = Number(formData.notaFilme);
            if (isNaN(nota) || nota < 0 || nota > 10) {
                toast.error("A nota deve estar entre 0 e 10");
                return false;
            }
        }

        return true;
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validar()) return;


        const statusFinal = normalizarStatus(formData.statusFilme);

        const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
        const idUsuarioLogado = usuarioLogado?.idUsuario;

        if (!idUsuarioLogado) {
            toast.error("Usuário não encontrado. Faça login novamente.");
            return;
        }

        const dadosParaEnvio = new FormData();
        dadosParaEnvio.append(
            "filme",
            JSON.stringify({
                tituloFilme: formData.tituloFilme,
                diretorFilme: formData.diretorFilme,
                anoFilme: formData.anoFilme,
                generoFilme: formData.generoFilme,
                avaliacaoFilme: formData.avaliacaoFilme,
                notaFilme: formData.notaFilme,
                statusFilme: statusFinal,
                idUsuario: idUsuarioLogado,
            })
        );

        if (formData.posterFilme) {
            dadosParaEnvio.append("poster", formData.posterFilme);
        }

        try {
            const res = await fetch("http://localhost:8080/filmes", {
                method: "POST",
                body: dadosParaEnvio,
            });

            if (!res.ok) throw new Error("Erro ao cadastrar filme");

            await res.json();
            toast.success("Filme cadastrado com sucesso!");

            setTimeout(() => {
                navigate("/inicial");
            }, 1500);
        } catch (err) {
            console.error(err);
            toast.error("Erro ao cadastrar filme. Tente novamente.");
        }
    };

    return (
        <div className="container-cadastro">
            <ToastContainer
                position="top-center"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={true}
                closeOnClick
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
                style={{
                    borderRadius: "12px",
                    padding: "1rem 1.2rem",
                }}
            />

            <button
                className="btn-fechar"
                onClick={() => navigate("/inicial")}
                aria-label="Fechar cadastro"
                title="Voltar para tela inicial"
                type="button"
            >
                ×
            </button>

            <h2>Cadastro de Filme - {formData.statusFilme}</h2>
            <form onSubmit={handleSubmit} noValidate>
                <div style={{ marginBottom: "1rem" }}>
                    <label>
                        Título*:
                        <input
                            type="text"
                            name="tituloFilme"
                            value={formData.tituloFilme}
                            onChange={handleChange}
                            required
                            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
                        />
                    </label>
                </div>

                <div style={{ marginBottom: "1rem" }}>
                    <label>
                        Diretor*:
                        <input
                            type="text"
                            name="diretorFilme"
                            value={formData.diretorFilme}
                            onChange={handleChange}
                            required
                            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
                        />
                    </label>
                </div>

                <div style={{ marginBottom: "1rem" }}>
                    <label>
                        Ano*:
                        <input
                            type="number"
                            name="anoFilme"
                            value={formData.anoFilme}
                            onChange={handleChange}
                            required
                            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
                        />
                    </label>
                </div>

                <div style={{ marginBottom: "1rem" }}>
                    <label>
                        Gênero:
                        <input
                            type="text"
                            name="generoFilme"
                            value={formData.generoFilme}
                            onChange={handleChange}
                            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
                        />
                    </label>
                </div>

                <div style={{ marginBottom: "1rem" }}>
                    <label>
                        Poster (imagem*):
                        <input
                            type="file"
                            name="posterFilme"
                            accept="image/*"
                            onChange={handleChange}
                            style={{ display: "block", marginTop: "0.3rem" }}
                        />
                    </label>
                    {formData.posterFilme && <p>Arquivo selecionado: {formData.posterFilme.name}</p>}
                </div>

                <div style={{ marginBottom: "1rem" }}>
                    <label>
                        Avaliação:
                        <textarea
                            name="avaliacaoFilme"
                            value={formData.avaliacaoFilme}
                            onChange={handleChange}
                            rows={4}
                            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
                        />
                    </label>
                </div>

                <div style={{ marginBottom: "1.5rem" }}>
                    <label>
                        Nota:
                        <input
                            type="number"
                            name="notaFilme"
                            value={formData.notaFilme}
                            onChange={handleChange}
                            min="0"
                            max="10"
                            step="0.1"
                            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
                        />
                    </label>
                </div>

                <button
                    type="submit"
                    style={{
                        backgroundColor: "#e50914",
                        color: "white",
                        border: "none",
                        padding: "12px 20px",
                        borderRadius: "20px",
                        fontWeight: "bold",
                        cursor: "pointer",
                        width: "100%",
                        fontSize: "1rem",
                    }}
                >
                    Salvar
                </button>
            </form>
        </div>
    );
};

export default CadastroFilme;
