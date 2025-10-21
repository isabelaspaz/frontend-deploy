import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PopupInformacoesFilme from "../../../components/Popup de informações sobre o filme/PopupInformacoesFilme";
import MenuUsuario from "../../../components/MenuUsuario/MenuUsuario";
import GraficoFilmes from "../../Usuario/Estatisticas/Estatisticas";
import "./TelaInicial.css";

const TelaInicial = () => {
    const navigate = useNavigate();
    const [filmes, setFilmes] = useState([]);
    const [filmeSelecionado, setFilmeSelecionado] = useState(null);
    const [usuarioLogado, setUsuarioLogado] = useState(null);
    const [loading, setLoading] = useState(true);

    const [mostrarInputBusca, setMostrarInputBusca] = useState(false);
    const [valorBusca, setValorBusca] = useState("");

    useEffect(() => {
        const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));
        if (!usuario) {
            navigate("/login");
            return;
        }
        setUsuarioLogado(usuario);

        fetch(`http://localhost:8080/filmes?idUsuario=${usuario.idUsuario}`)
            .then((res) => res.json())
            .then((data) => setFilmes(data))
            .catch((err) => console.error(err))
            .finally(() => setLoading(false));
    }, [navigate]);

    const handleCadastrar = () => {
        navigate("/cadastro-opcoes");
    };

    const abrirPopup = (filme) => {
        setFilmeSelecionado(filme);
    };

    const fecharPopup = () => {
        setFilmeSelecionado(null);
    };

    const salvarEdicao = (filmeEditado) => {
        setFilmes((prevFilmes) =>
            prevFilmes.map((f) => (f.idFilme === filmeEditado.idFilme ? filmeEditado : f))
        );
        setFilmeSelecionado(null);
    };

    const excluirFilme = async (id) => {
        const res = await fetch(`http://localhost:8080/filmes/id/${id}`, {
            method: "DELETE",
        });

        if (res.ok) {
            setFilmes((prevFilmes) => prevFilmes.filter((filme) => filme.idFilme !== id));
        }
    };

    const alternarBusca = () => {
        setMostrarInputBusca((prev) => !prev);
        if (mostrarInputBusca) setValorBusca("");
    };

    if (loading) return <p>Carregando filmes...</p>;

    const filmesFiltrados = filmes.filter((f) =>
        f.tituloFilme?.toLowerCase().includes(valorBusca.toLowerCase())
    );

    const filmesAssistindo = filmesFiltrados.filter(
        (f) => f.statusFilme?.toLowerCase() === "assistindo"
    );
    const filmesQueroAssistir = filmesFiltrados.filter(
        (f) => f.statusFilme?.toLowerCase() === "queroassistir"
    );
    const filmesAssistidos = filmesFiltrados.filter(
        (f) => f.statusFilme?.toLowerCase() === "assistido"
    );

    const nenhumaCategoria =
        filmesAssistindo.length === 0 && filmesAssistidos.length === 0 && filmesQueroAssistir.length === 0;

    return (
        <div className="tela-inicial">
            <div className="menu-usuario-wrapper">
                <MenuUsuario
                    onLogout={() => {
                        localStorage.removeItem("usuarioLogado");
                        navigate("/login");
                    }}
                    onEditAccount={() => {
                        navigate("/editar-conta");
                    }}
                />
            </div>

            <div className="header-filmes">
                <div className="Meusfilmes">
                    <h2>Meus filmes</h2>
                </div>

                <div className="botoes-menu">
                    {mostrarInputBusca && (
                        <input
                            type="text"
                            placeholder="Buscar..."
                            value={valorBusca}
                            onChange={(e) => setValorBusca(e.target.value)}
                            autoFocus
                            className="input-busca"
                        />
                    )}

                    <div className="lupaemais">
                        <button
                            className="botao-lupa"
                            onClick={alternarBusca}
                            aria-label="Buscar filmes"
                            type="button"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                width="20"
                                height="20"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                                />
                            </svg>
                        </button>

                        <button
                            className="btn-adicionar"
                            onClick={handleCadastrar}
                            aria-label="Adicionar filme"
                            type="button"
                        >
                            +
                        </button>
                    </div>

                </div>
            </div>


            {valorBusca.trim() === "" ? (
                nenhumaCategoria ? (
                    <div className="mensagem-vazia">
                        <h2>Você ainda não avaliou nenhum filme :(</h2>
                        <button className="btn-comecar" onClick={handleCadastrar}>
                            Começar!
                        </button>
                    </div>
                ) : (
                    <>

                        {filmes.filter((f) => f.statusFilme?.toLowerCase() === "assistindo").length > 0 && (
                            <>
                                <h3>Assistindo agora</h3>
                                <div className="lista-filmes">
                                    {filmes
                                        .filter((f) => f.statusFilme?.toLowerCase() === "assistindo")
                                        .map((filme) => (
                                            <div
                                                key={filme.idFilme}
                                                className="card-filme"
                                                onClick={() => abrirPopup(filme)}
                                            >
                                                <img
                                                    src={`data:image/jpeg;base64,${filme.posterFilme}`}
                                                    alt={filme.tituloFilme}
                                                    className="poster-filme"
                                                />
                                                <p className="titulo-filme">{filme.tituloFilme}</p>
                                            </div>
                                        ))}
                                </div>
                            </>
                        )}

                        {filmes.filter((f) => f.statusFilme?.toLowerCase() === "queroassistir").length > 0 && (
                            <>
                                <h3>Quero assistir</h3>
                                <div className="lista-filmes">
                                    {filmes
                                        .filter((f) => f.statusFilme?.toLowerCase() === "queroassistir")
                                        .map((filme) => (
                                            <div
                                                key={filme.idFilme}
                                                className="card-filme"
                                                onClick={() => abrirPopup(filme)}
                                            >
                                                <img
                                                    src={`data:image/jpeg;base64,${filme.posterFilme}`}
                                                    alt={filme.tituloFilme}
                                                    className="poster-filme"
                                                />
                                                <p className="titulo-filme">{filme.tituloFilme}</p>
                                            </div>
                                        ))}
                                </div>
                            </>
                        )}

                        {filmes.filter((f) => f.statusFilme?.toLowerCase() === "assistido").length > 0 && (
                            <>
                                <h3>Filmes assistidos</h3>
                                <div className="lista-filmes">
                                    {filmes
                                        .filter((f) => f.statusFilme?.toLowerCase() === "assistido")
                                        .map((filme) => (
                                            <div
                                                key={filme.idFilme}
                                                className="card-filme"
                                                onClick={() => abrirPopup(filme)}
                                            >
                                                <img
                                                    src={`data:image/jpeg;base64,${filme.posterFilme}`}
                                                    alt={filme.tituloFilme}
                                                    className="poster-filme"
                                                />
                                                <p className="titulo-filme">{filme.tituloFilme}</p>
                                            </div>
                                        ))}
                                </div>
                            </>
                        )}
                    </>
                )
            ) : filmesFiltrados.length === 0 ? (
                <div className="mensagem-vazia">
                    <h2>Busca não encontrada :(</h2>
                </div>
            ) : (
                <>
                    {filmesAssistindo.length > 0 && (
                        <>
                            <h3>Assistindo agora</h3>
                            <div className="lista-filmes">
                                {filmesAssistindo.map((filme) => (
                                    <div
                                        key={filme.idFilme}
                                        className="card-filme"
                                        onClick={() => abrirPopup(filme)}
                                    >
                                        <img
                                            src={`data:image/jpeg;base64,${filme.posterFilme}`}
                                            alt={filme.tituloFilme}
                                            className="poster-filme"
                                        />
                                        <p className="titulo-filme">{filme.tituloFilme}</p>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    {filmesQueroAssistir.length > 0 && (
                        <>
                            <h3>Quero assistir</h3>
                            <div className="lista-filmes">
                                {filmesQueroAssistir.map((filme) => (
                                    <div
                                        key={filme.idFilme}
                                        className="card-filme"
                                        onClick={() => abrirPopup(filme)}
                                    >
                                        <img
                                            src={`data:image/jpeg;base64,${filme.posterFilme}`}
                                            alt={filme.tituloFilme}
                                            className="poster-filme"
                                        />
                                        <p className="titulo-filme">{filme.tituloFilme}</p>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    {filmesAssistidos.length > 0 && (
                        <>
                            <h3>Filmes assistidos</h3>
                            <div className="lista-filmes">
                                {filmesAssistidos.map((filme) => (
                                    <div
                                        key={filme.idFilme}
                                        className="card-filme"
                                        onClick={() => abrirPopup(filme)}
                                    >
                                        <img
                                            src={`data:image/jpeg;base64,${filme.posterFilme}`}
                                            alt={filme.tituloFilme}
                                            className="poster-filme"
                                        />
                                        <p className="titulo-filme">{filme.tituloFilme}</p>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </>
            )}

            {filmeSelecionado && (
                <PopupInformacoesFilme
                    filme={filmeSelecionado}
                    onClose={fecharPopup}
                    onSave={salvarEdicao}
                    onDelete={excluirFilme}
                />
            )}
        </div>
    );
};

export default TelaInicial;
