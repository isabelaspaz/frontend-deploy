import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { listarFilmesGraf } from "../../service/filmes";
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from "recharts";
import { Slide, toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./style.css";

const GraficoFilmes = () => {
    const navigate = useNavigate();
    const [filmes, setFilmes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tipoGrafico, setTipoGrafico] = useState("barra");
    const [categoria, setCategoria] = useState("generoFilme");
    const [filtroAno, setFiltroAno] = useState("ano");
    const [usuarioLogado, setUsuarioLogado] = useState(null);

    useEffect(() => {
        const usuarioString = localStorage.getItem("usuarioLogado");

        if (!usuarioString) {
            navigate("/login");
            return;
        }

        let usuario;
        try {
            usuario = JSON.parse(usuarioString);
            if (!usuario?.idUsuario) {
                navigate("/login");
                return;
            }
        } catch (err) {
            console.error("Erro ao ler usuário do localStorage:", err);
            navigate("/login");
            return;
        }

        setUsuarioLogado(usuario);

        async function fetchFilmes() {
            try {
                setLoading(true);
                const dados = await listarFilmesGraf(usuario.idUsuario);
                setFilmes(Array.isArray(dados) ? dados : []);
            } catch (error) {
                console.error("Erro ao buscar filmes:", error);
                toast.error("Não existem filmes cadastrados!");
            } finally {
                setLoading(false);
            }
        }

        fetchFilmes();
    }, [navigate]);

    const dadosProcessados = useMemo(() => {
        if (!Array.isArray(filmes) || filmes.length === 0) return [];

        const contagem = {};

        filmes.forEach(filme => {
            let chave;

            if (categoria === "anoFilme") {
                const ano = parseInt(filme.anoFilme);
                if (filtroAno === "decada") {
                    chave = isNaN(ano) ? "Ano desconhecido" : `${Math.floor(ano / 10) * 10}`;
                } else {
                    chave = filme.anoFilme || "Ano desconhecido";
                }
            } else if (categoria === "diretorFilme") {
                chave = filme.diretorFilme || "Autor desconhecido";
            } else if (categoria === "generoFilme") {
                chave = filme.generoFilme || "Gênero desconhecido";
            }

            contagem[chave] = (contagem[chave] || 0) + 1;
        });

        const total = filmes.length;

        return Object.entries(contagem).map(([chave, valor]) => ({
            nome: chave,
            valor: Number(valor) || 0,
            porcentagem: ((Number(valor) / total) * 100).toFixed(1)
        })).filter(item => typeof item.valor === "number" && !isNaN(item.valor));
    }, [filmes, categoria, filtroAno]);

    const cores = [
        "#E50914", "#B71C1C", "#F44336", "#D32F2F", "#FF6659",
        "#8B0000", "#FFCDD2", "#C62828", "#E53935", "#D50000",
        "#EF5350", "#B22222", "#FF1744", "#FF8A80", "#9B0000"
    ];

    return (
        <div className="grafico-page">
            <ToastContainer
                position="top-center"
                autoClose={4000}
                hideProgressBar={true}
                newestOnTop={true}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                transition={Slide} // importado do react-toastify
                toastClassName="netflix-toast"
            />

            <div className="grafico-container">
                <div className="filtros">
                    <select value={categoria} onChange={e => setCategoria(e.target.value)}>
                        <option value="anoFilme">Ano</option>
                        <option value="diretorFilme">Autor</option>
                        <option value="generoFilme">Gênero</option>
                    </select>

                    {categoria === "anoFilme" && (
                        <select value={filtroAno} onChange={e => setFiltroAno(e.target.value)}>
                            <option value="ano">Ano</option>
                            <option value="decada">Década</option>
                        </select>
                    )}

                    <select value={tipoGrafico} onChange={e => setTipoGrafico(e.target.value)}>
                        <option value="barra">Gráfico de Barras</option>
                        <option value="pizza">Gráfico de Pizza</option>
                    </select>
                </div>

                {loading && <div className="info-msg">Carregando filmes...</div>}

                {!loading && Array.isArray(dadosProcessados) && dadosProcessados.length > 0 && (
                    tipoGrafico === "barra" ? (
                        <ResponsiveContainer key={tipoGrafico} width="100%" height={400}>
                            <BarChart
                                data={dadosProcessados}
                                layout="vertical"
                                margin={{ top: 20, right: 20, bottom: 20, left: 100 }}
                            >
                                <XAxis type="number" domain={[0, 'dataMax']} />
                                <YAxis dataKey="nome" type="category" width={150} />
                                <Tooltip />
                                <Bar dataKey="valor">
                                    {dadosProcessados.map((_, index) => (
                                        <Cell key={index} fill={cores[index % cores.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <ResponsiveContainer key={tipoGrafico} width="100%" height={400}>
                            <PieChart>
                                <Pie
                                    data={dadosProcessados}
                                    dataKey="valor"
                                    nameKey="nome"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={120}
                                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                                >
                                    {dadosProcessados.map((_, index) => (
                                        <Cell key={index} fill={cores[index % cores.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    )
                )}
            </div>
        </div>
    );
};

export default GraficoFilmes;
