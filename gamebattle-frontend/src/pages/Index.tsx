import { useState, useCallback, useEffect } from "react";
import axios from "axios";
import Header from "@/components/Header";
import LoginScreen from "@/components/LoginScreen";
import LoadingScreen from "@/components/LoadingScreen";
import ModeSelection from "@/components/ModeSelection";
import BattleArena from "@/components/BattleArena";
import ChampionScreen from "@/components/ChampionScreen";
import { Game } from "@/data/mockGames";
import HallOfFame from "@/components/HallOfFame";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
const STEAM_ID_REGEX = /^\d{1,20}$/;

type AppState = "login" | "loading" | "mode-select" | "battle" | "champion" | "hall-of-fame";

const Index = () => {
  const [state, setState] = useState<AppState>("login");
  const [steamId, setSteamId] = useState<string | null>(null);
  const [champion, setChampion] = useState<Game | null>(null);
  const [battleGames, setBattleGames] = useState<Game[]>([]);
  const [username, setUsername] = useState<string>("");
  const [avatarUrl, setAvatarUrl] = useState<string>("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("steamId");

    if (id && STEAM_ID_REGEX.test(id)) {
      setSteamId(id);
      window.history.replaceState({}, document.title, "/");
      sincronizarBiblioteca(id);
    }
  }, []);

  const sincronizarBiblioteca = async (id: string) => {
    setState("loading");
    try {
      await axios.post(`${API_URL}/api/games/sync?steamId=${id}`);

      const userResp = await axios.get(`${API_URL}/api/users?steamId=${id}`);
      setUsername(userResp.data.username);
      setAvatarUrl(userResp.data.avatarUrl);

      setState("mode-select");
    } catch (error) {
      console.error("Erro ao sincronizar:", error);
      alert("Erro ao conectar com o servidor.");
      setState("login");
    }
  };

  const isLoggedIn = !!steamId;

  // 3. Botão de Login manda pro AuthController do Java
  const handleLogin = useCallback(() => {
    window.location.href = `${API_URL}/api/auth/steam`;
  }, []);

  const handleLogout = useCallback(() => {
    setSteamId(null);
    setState("login");
    setChampion(null);
  }, []);

  // 4. Inicia o Torneio usando os dados reais do Banco de Dados!
  const handleSelectMode = async (mode: "backlog" | "favorites") => {
    if (!steamId) return;

    setState("loading");
    try {
      const endpoint = mode === "backlog" ? "least" : "most";
      const resposta = await axios.get(`${API_URL}/api/games/${endpoint}?steamId=${steamId}`);

      if (resposta.data.length < 2) {
        alert("Você precisa de pelo menos 2 jogos nessa categoria para batalhar!");
        setState("mode-select");
        return;
      }

      // Passa a lista que veio do Java para a Arena
      setBattleGames(resposta.data);
      setState("battle");
    } catch (erro) {
      console.error("Erro ao buscar jogos", erro);
      alert("Erro ao buscar os jogos para o torneio.");
      setState("mode-select");
    }
  };

  const handleChampion = (game: Game) => {
    setChampion(game);
    setState("champion");
    if (steamId) {
      axios.post(`${API_URL}/api/hall-of-fame?steamId=${steamId}&gameId=${game.id}`)
          .catch(err => console.error("Erro ao salvar campeão:", err));
    }
  };

  const handlePlayAgain = useCallback(() => {
    setState("mode-select");
    setChampion(null);
  }, []);

  return (
      <div className="min-h-screen bg-steam-gradient">
        <Header
            isLoggedIn={isLoggedIn}
            onLogout={handleLogout}
            username={username}
            avatarUrl={avatarUrl}
        />

        {state === "login" && <LoginScreen onLogin={handleLogin} />}
        {state === "loading" && <LoadingScreen />}
        {state === "mode-select" && (
            <ModeSelection
                onSelectMode={handleSelectMode}
                onHallOfFame={() => setState("hall-of-fame")}
            />
        )}
        {state === "battle" && (
            <BattleArena
                games={battleGames}
                onChampion={handleChampion}
                onBack={handlePlayAgain}
            />
        )}
        {state === "champion" && champion && (
            <ChampionScreen champion={champion} onPlayAgain={handlePlayAgain} />
        )}
        {state === "hall-of-fame" && (
            <HallOfFame onBack={() => setState("mode-select")} />
        )}
      </div>
  );
};

export default Index;