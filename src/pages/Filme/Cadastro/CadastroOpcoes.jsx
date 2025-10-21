import React from "react";
import { useNavigate } from "react-router-dom";
import "./CadastroOpcoes.css";

const CadastroOpcoes = () => {
    const navigate = useNavigate();

    const handleSelecionar = (status) => {
        navigate("/cadastro-filme", { state: { statusSelecionado: status } });
    };

    const handleVoltar = () => {
        navigate("/inicial");
    };

    return (
        <div className="cadastro-opcoes">
            <div className="conteudo">
                <button className="btn-fechar" onClick={handleVoltar}>×</button>

                <h2>O que você quer fazer?</h2>

                <div className="botoes">
                    <button className="btn-lista" onClick={() => handleSelecionar("assistido")}>
                        Adicionar filme assistido
                    </button>
                    <button className="btn-lista" onClick={() => handleSelecionar("assistindo")}>
                        Adicionar filme que estou assistindo agora
                    </button>
                    <button className="btn-lista" onClick={() => handleSelecionar("queroAssistir")}>
                        Adicionar filme à lista Quero assistir
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CadastroOpcoes;
