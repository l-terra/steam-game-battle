import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
import type {Game} from './types/Game';

function App() {

    const [games, setGames] = useState<Game[]>([]);

    useEffect(() => {
        carregarJogos();
    }, []);

    const carregarJogos = async () => {
        try {
            const steamId = "76561198116210457";

            const resposta = await axios.get(`http://localhost:8080/api/games/least?steamId=${steamId}`);

            setGames(resposta.data);
            console.log("Jogos carregados!", resposta.data);

        } catch (erro) {
            console.error("Erro ao buscar jogos", erro);
            alert("Erro ao buscar jogos! Veja o console (F12)");
        }
    };

    return (
        <div className="container">
            <header>
                <h1>⚔️ Steam Battle</h1>
                <p>Jogos que você comprou e <b>esqueceu</b> na biblioteca.</p>
                <button onClick={carregarJogos}>Recarregar Lista</button>
            </header>

            <main className="lista-jogos">
                {games.map(game => (

                    <div key={game.id} className="card-jogo">
                        <img src={game.imageUrl} alt={game.name} />
                        <div className="info">
                            <h3>{game.name}</h3>
                            <span>ID: {game.appId}</span>
                        </div>
                    </div>

                ))}
            </main>
        </div>
    );
}

export default App;