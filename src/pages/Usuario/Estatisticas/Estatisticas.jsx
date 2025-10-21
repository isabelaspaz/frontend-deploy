import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import InformacoesFilmes from "../../../components/InformacoesFilmes/InformacoesFilmes";

import GraficoFilmes from "../../../components/GraficoFilmes/index"; // ajuste o caminho conforme sua estrutura
import { listarFilmesGraf } from "../../../service/filmes";
import "./Estatisticas.css";



const Estatisticas = () => {
    const [filmes, setFilmes] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const usuarioString = localStorage.getItem("usuarioLogado");

        if (!usuarioString) {
            navigate("/login");
            return;
        }

        try {
            const usuario = JSON.parse(usuarioString);
            if (!usuario?.idUsuario) {
                navigate("/login");
                return;
            }

            async function fetchFilmes() {
                try {
                    setLoading(true);
                    const dados = await listarFilmesGraf(usuario.idUsuario);
                    setFilmes(Array.isArray(dados) ? dados : []);
                } catch (error) {
                    console.error("Erro ao buscar filmes:", error);
                } finally {
                    setLoading(false);
                }
            }

            fetchFilmes();
        } catch (err) {
            console.error("Erro ao processar usuário:", err);
            navigate("/login");
        }
    }, [navigate]);

    return (
        <div className="container_Estatisticas">
            <h2 className="titulo-estatisticas">Estatísticas</h2>

            {!loading && filmes.length > 0 && (
                <>
                    <InformacoesFilmes filmes={filmes} />
                    <GraficoFilmes filmes={filmes} />
                </>
            )}

            {loading && <p className="info-msg">Carregando dados...</p>}
            {!loading && filmes.length === 0 && (
                <p className="info-msg">Nenhum filme encontrado.</p>
            )}
        </div>
    );
};

export default Estatisticas;
