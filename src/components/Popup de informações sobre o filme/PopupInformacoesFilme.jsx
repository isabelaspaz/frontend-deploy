import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./PopupInformacoesFilme.css";

const PopupInformacoesFilme = ({ filme, onClose, onSave, onDelete }) => {
    const [modoEdicao, setModoEdicao] = useState(false);
    const [dados, setDados] = useState(filme);
    const [posterFile, setPosterFile] = useState(null);

    useEffect(() => {
        setDados(filme);
        setModoEdicao(false);
        setPosterFile(null);
    }, [filme]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDados((prev) => ({ ...prev, [name]: value }));
    };


    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const validExtensions = ["image/jpeg", "image/jpg", "image/png"];
        if (!validExtensions.includes(file.type)) {
            toast.error("Formato do pôster inválido. Use arquivos .jpg ou .png.");
            e.target.value = null;
            return;
        }

        setPosterFile(file);

        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result.split(",")[1];
            setDados((prev) => ({ ...prev, posterFilme: base64String }));
        };
        reader.readAsDataURL(file);
    };

    const validarDados = () => {
        if (!dados.tituloFilme || dados.tituloFilme.trim() === "") {
            toast.error("O título do filme é obrigatório.");
            return false;
        }

        if (!dados.diretorFilme || !/^(\S+\s+\S+)/.test(dados.diretorFilme.trim())) {
            toast.error("O diretor deve conter nome e sobrenome.");
            return false;
        }

        const anoAtual = new Date().getFullYear();
        const ano = parseInt(dados.anoFilme, 10);
        if (!ano || isNaN(ano) || ano < 1850 || ano > anoAtual) {
            toast.error(`O ano deve estar a partir de 1850`);
            return false;
        }

        if (!dados.posterFilme || dados.posterFilme.trim() === "") {
            toast.error("O pôster do filme é obrigatório.");
            return false;
        }

        const statusPermitidos = ["assistido", "assistindo", "queroassistir"];
        if (!dados.statusFilme || !statusPermitidos.includes(dados.statusFilme.toLowerCase())) {
            toast.error("O status do filme é obrigatório e deve ser: assistido, assistindo ou quero assistir.");
            return false;
        }

        if (dados.notaFilme !== undefined && dados.notaFilme !== null && dados.notaFilme !== "") {
            const nota = parseFloat(dados.notaFilme);
            if (isNaN(nota) || nota < 0 || nota > 10) {
                toast.error("A nota deve ser um número entre 0 e 10.");
                return false;
            }
        }

        return true;
    };


    useEffect(() => {
        if (!modoEdicao) {
            setDados(filme);
            setPosterFile(null);
        }
    }, [filme, modoEdicao]);

    const salvar = async () => {
        if (!validarDados()) return;



        try {
            const response = await fetch(`http://localhost:8080/filmes/${dados.idFilme}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dados),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || "Erro ao atualizar filme");
            }

            const filmeAtualizado = await response.json();
            onSave(filmeAtualizado);
            setDados(filmeAtualizado);
            setModoEdicao(false);
            toast.success("Filme atualizado com sucesso!");
        } catch (error) {
            toast.error("Erro ao salvar o filme. Tente novamente.");
        }
    };



    const excluir = async () => {
        const toastId = toast(
            ({ closeToast }) => (
                <div style={{ color: "#fff" }}>
                    <p style={{ marginBottom: "0.5rem" }}>Tem certeza que deseja excluir este filme?</p>
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
                        <button
                            onClick={async () => {
                                try {
                                    await onDelete(dados.idFilme);
                                    toast.success("Filme excluído com sucesso!");
                                    onClose();
                                    toast.dismiss(toastId);
                                } catch (error) {
                                    toast.error("Erro ao excluir o filme. Tente novamente.");
                                    toast.dismiss(toastId);
                                }
                            }}
                            style={{
                                backgroundColor: "#e50914",
                                color: "white",
                                border: "none",
                                padding: "8px 20px",
                                borderRadius: "999px", 
                                fontWeight: "bold",
                                cursor: "pointer",
                                fontSize: "0.9rem"
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
                                borderRadius: "999px",
                                fontWeight: "bold",
                                cursor: "pointer",
                                fontSize: "0.9rem"
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
                }
            }
        );
    };


    return (
        <>
            <div
                onClick={onClose}
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: "rgba(0,0,0,0.6)",
                    zIndex: 999,
                }}
            />

            <div onClick={(e) => e.stopPropagation()} className="popup-container">
                <button onClick={onClose} aria-label="Fechar">
                    ×
                </button>

                {dados.posterFilme && (
                    <img
                        src={`data:image/jpeg;base64,${dados.posterFilme}`}
                        alt={dados.tituloFilme}
                    />
                )}

                {!modoEdicao ? (
                    <>
                        <h2>{dados.tituloFilme}</h2>
                        <p>
                            <b>Diretor:</b> {dados.diretorFilme}
                        </p>
                        <p>
                            <b>Ano:</b> {dados.anoFilme}
                        </p>
                        <p>
                            <b>Gênero:</b> {dados.generoFilme}
                        </p>
                        <p>
                            <b>Avaliação:</b> {dados.avaliacaoFilme}
                        </p>
                        <p>
                            <b>Nota:</b> {dados.notaFilme}
                        </p>
                        <p>
                            <b>Status:</b>{" "}
                            {(() => {
                                switch (dados.statusFilme?.toLowerCase()) {
                                    case "assistindo":
                                        return "Assistindo agora";
                                    case "queroassistir":
                                        return "Quero assistir";
                                    case "assistido":
                                        return "Assistido";
                                    default:
                                        return "Não definido";
                                }
                            })()}
                        </p>

                        <button className="popup-btn salvar" onClick={() => setModoEdicao(true)}>
                            Editar
                        </button>
                        <button className="popup-btn excluir" onClick={excluir} style={{ marginLeft: "10px" }}>
                            Excluir
                        </button>
                    </>
                ) : (
                    <>
                        <label>
                            Poster:
                            <input type="file" accept=".jpg,.jpeg,.png" onChange={handleFileChange} />
                        </label>

                        <label>
                            Título:
                            <input
                                type="text"
                                name="tituloFilme"
                                value={dados.tituloFilme || ""}
                                onChange={handleChange}
                            />
                        </label>

                        <label>
                            Status:
                            <select name="statusFilme" value={dados.statusFilme || ""} onChange={handleChange}>
                                <option value="">-- Selecione o status --</option>
                                <option value="assistindo">Estou assistindo agora</option>
                                <option value="queroassistir">Quero assistir</option>
                                <option value="assistido">Assistido</option>
                            </select>
                        </label>

                        <label>
                            Diretor:
                            <input
                                type="text"
                                name="diretorFilme"
                                value={dados.diretorFilme || ""}
                                onChange={handleChange}
                            />
                        </label>

                        <label>
                            Ano:
                            <input type="number" name="anoFilme" value={dados.anoFilme || ""} onChange={handleChange} />
                        </label>

                        <label>
                            Gênero:
                            <input
                                type="text"
                                name="generoFilme"
                                value={dados.generoFilme || ""}
                                onChange={handleChange}
                            />
                        </label>

                        <label>
                            Avaliação:
                            <textarea
                                name="avaliacaoFilme"
                                value={dados.avaliacaoFilme || ""}
                                onChange={handleChange}
                                rows={4}
                            />
                        </label>

                        <label>
                            Nota:
                            <input
                                type="number"
                                step="0.1"
                                min="0"
                                max="10"
                                name="notaFilme"
                                value={dados.notaFilme || ""}
                                onChange={handleChange}
                            />
                        </label>

                        <div style={{ marginTop: "10px", display: "flex", flexWrap: "wrap", gap: "10px" }}>
                            <button className="popup-btn salvar" onClick={salvar}>
                                Salvar
                            </button>
                            <button className="popup-btn cancelar" onClick={() => setModoEdicao(false)}>
                                Cancelar
                            </button>
                            <button className="popup-btn excluir" onClick={excluir}>
                                Excluir
                            </button>
                        </div>
                    </>
                )}
            </div>

            {/* ToastContainer para renderizar os toasts */}
            <ToastContainer
                position="top-center"
                autoClose={4000}
                hideProgressBar
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
            />
        </>
    );
};

export default PopupInformacoesFilme;
