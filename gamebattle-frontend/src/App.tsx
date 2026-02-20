import { useState } from 'react';
import axios from 'axios';
import './App.css';
import type { Game } from './types/Game';

function App() {
    // --- ESTADOS DO TORNEIO ---
    const [fila, setFila] = useState<Game[]>([]); // Jogos aguardando para batalhar neste round
    const [vencedores, setVencedores] = useState<Game[]>([]); // Jogos que já ganharam neste round
    const [campeao, setCampeao] = useState<Game | null>(null); // O grande vencedor!
    const [carregando, setCarregando] = useState(false);

    // Embaralha a lista (para os confrontos serem aleatórios)
    const shuffleArray = (array: Game[]) => {
        return array.sort(() => Math.random() - 0.5);
    };

    const iniciarTorneio = async () => {
        setCarregando(true);
        setCampeao(null);
        setVencedores([]);
        try {
            const steamId = "76561198116210457";
            const resposta = await axios.get(`http://localhost:8080/api/games/least?steamId=${steamId}`);

            // Pega os dados, embaralha e coloca na fila
            const jogosEmbaralhados = shuffleArray(resposta.data);
            setFila(jogosEmbaralhados);
        } catch (erro) {
            console.error("Erro ao buscar jogos", erro);
            alert("Erro ao conectar no Java!");
        } finally {
            setCarregando(false);
        }
    };

    // Função principal da batalha
    const votar = (vencedorDaBatalha: Game) => {
        const novaFila = [...fila];
        // Remove os 2 jogos que acabaram de batalhar
        novaFila.shift();
        novaFila.shift();

        const novosVencedores = [...vencedores, vencedorDaBatalha];

        // Regras de progressão do torneio
        if (novaFila.length >= 2) {
            // Ainda tem gente para batalhar neste round
            setFila(novaFila);
            setVencedores(novosVencedores);
        } else if (novaFila.length === 1) {
            // Sobrou 1 jogo ímpar no fim da fila. Ele ganha "W.O." e avança direto.
            const proximoRound = [...novosVencedores, novaFila[0]];
            setFila(shuffleArray(proximoRound));
            setVencedores([]);
        } else {
            // A fila acabou. Fim do Round!
            if (novosVencedores.length === 1) {
                // Se só tem 1 vencedor total, TEMOS UM CAMPEÃO!
                setFila([]);
                setCampeao(novosVencedores[0]);
            } else {
                // Se tem mais de 1, inicia o próximo round com os vencedores
                setFila(shuffleArray(novosVencedores));
                setVencedores([]);
            }
        }
    };

    return (
        <div className="container">
            <header>
                <h1>⚔️ Steam Battle ⚔️</h1>
                {fila.length === 0 && !campeao && (
                    <button onClick={iniciarTorneio} disabled={carregando}>
                        {carregando ? "Carregando..." : "Iniciar Torneio do Backlog"}
                    </button>
                )}
            </header>

            <main>
                {/* TELA DE BATALHA */}
                {fila.length >= 2 && !campeao && (
                    <div>
                        <h2>Qual você prefere?</h2>
                        <p className="status-torneio">
                            Jogos restantes neste round: {fila.length} | Na próxima fase: {vencedores.length}
                        </p>

                        <div className="arena">
                            <div className="card-jogo lutador" onClick={() => votar(fila[0])}>
                                <img src={fila[0].imageUrl} alt={fila[0].name} />
                                <h3>{fila[0].name}</h3>
                            </div>

                            <div className="versus">VS</div>

                            <div className="card-jogo lutador" onClick={() => votar(fila[1])}>
                                <img src={fila[1].imageUrl} alt={fila[1].name} />
                                <h3>{fila[1].name}</h3>
                            </div>
                        </div>
                    </div>
                )}

                {/* TELA DO CAMPEÃO */}
                {campeao && (
                    <div className="campeao-container">
                        <h2>🏆 O Jogo Escolhido é:</h2>
                        <div className="card-jogo campeao-card">
                            <img src={campeao.imageUrl} alt={campeao.name} />
                            <h3>{campeao.name}</h3>
                        </div>
                        <button onClick={iniciarTorneio} style={{ marginTop: '20px' }}>Jogar Novamente</button>
                    </div>
                )}
            </main>
        </div>
    );
}

export default App;