import React, { useMemo } from "react";
import "./InformacoesFilmes.css";

const InformacoesFilmes = ({ filmes }) => {
    const totalAssistidos = useMemo(() =>
        filmes.filter(f => f.statusFilme?.toLowerCase() === "assistido").length
        , [filmes]);

    const totalAvaliados = useMemo(() =>
        filmes.filter(f =>
            f.statusFilme?.toLowerCase() === "assistido" &&
            f.notaFilme != null && f.notaFilme !== "" &&
            f.avaliacaoFilme != null && f.avaliacaoFilme !== ""
        ).length
        , [filmes]);

    return (
        <div className="estatisticas-resumo">
            <p>Filmes assistidos: {totalAssistidos}</p>
            <p>Filmes avaliados: {totalAvaliados}</p>
        </div>
    );
};

export default InformacoesFilmes;
