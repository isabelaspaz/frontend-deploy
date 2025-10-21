import React, { useRef } from "react";
import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => {
    const videoRef = useRef(null);

    return (
        <div className="homeContainer">
            <h1 className="homeTitle">SceneRate</h1>
            <p className="homeSlogan">Seu portal para avaliação de filmes e séries.</p>


            <video
                ref={videoRef}
                src="/cameraRodando.mp4"
                autoPlay
                muted
                playsInline
                loop
                className="homeVideo"
                aria-label="Vídeo da câmera rodando"
            >
                Seu navegador não suporta o elemento de vídeo.
            </video>

            <div className="homeActions">
                <Link to="/login" className="loginMainButton">
                    Entrar
                </Link>
            </div>
        </div>
    );
};

export default Home;
