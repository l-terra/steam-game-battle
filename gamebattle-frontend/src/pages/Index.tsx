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

type AppState = "login" | "loading" | "mode-select" | "battle" | "champion" | "hall-of-fame";

const Index = () => {
  const [state, setState] = useState<AppState>("login");
  const [steamId, setSteamId] = useState<string | null>(null);
  const [champion, setChampion] = useState<Game | null>(null);
  const [battleGames, setBattleGames] = useState<Game[]>([]);
  const [username, setUsername] = useState<string>("");
  const [avatarUrl, setAvatarUrl] = useState<string>("");

  // 1. Verifica se a URL tem o steamId (vindo do redirecionamento do Java)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("steamId");

    if (id) {
      setSteamId(id);
      // Limpa a URL para ficar limpinha (sem o ?steamId=123)
      window.history.replaceState({}, document.title, "/");
      // Manda o Java baixar/atualizar seus jogos
      sincronizarBiblioteca(id);
    }
  }, []);

  const sincronizarBiblioteca = async (id: string) => {
    setState("loading");
    try {
      await axios.post(`http://localhost:8080/api/games/sync?steamId=${id}`);

      // --- NOVO: BUSCA O USUÁRIO SALVO ---
      const userResp = await axios.get(`http://localhost:8080/api/users?steamId=${id}`);
      setUsername(userResp.data.username);
      setAvatarUrl(userResp.data.avatarUrl);

      setState("mode-select");
    } catch (error) {
      console.error("Erro ao sincronizar:", error);
      alert("Erro ao conectar com o backend Java.");
      setState("login");
    }
  };

  const isLoggedIn = !!steamId;

  // 3. Botão de Login manda pro AuthController do Java
  const handleLogin = useCallback(() => {
    window.location.href = "http://localhost:8080/api/auth/steam";
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
      const resposta = await axios.get(`http://localhost:8080/api/games/${endpoint}?steamId=${steamId}`);

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
      alert("Erro ao buscar os jogos para o torneio. O Java está rodando?");
      setState("mode-select");
    }
  };

  const handleChampion = (game: Game) => {
    setChampion(game);
    setState("champion");
    if (steamId) {
      axios.post(`http://localhost:8080/api/hall-of-fame?steamId=${steamId}&gameId=${game.id}`)
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