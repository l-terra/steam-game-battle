import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { Game } from "@/data/mockGames";
import { Trophy, ArrowLeft, Medal } from "lucide-react";

interface HallOfFameProps {
    onBack: () => void;
}

const HallOfFame = ({ onBack }: HallOfFameProps) => {
    const [games, setGames] = useState<Game[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Atualize o final desta URL para bater com o seu Controller
        axios.get("http://localhost:8080/api/hall-of-fame/top-champions")
            .then((res) => setGames(res.data))
            .catch((err) => console.error("Erro ao carregar Hall of Fame:", err))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="min-h-screen px-6 pt-24 pb-10">
            <div className="mx-auto max-w-4xl">

                {/* Cabeçalho */}
                <div className="mb-10 text-center">
                    <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-500/20 text-yellow-500"
                    >
                        <Trophy className="h-8 w-8" />
                    </motion.div>
                    <h2 className="font-display text-4xl font-bold text-foreground">
                        Hall of Fame
                    </h2>
                    <p className="mt-2 text-muted-foreground">
                        The absolute champions of all tournaments
                    </p>
                </div>

                {/* Lista de Jogos */}
                <div className="space-y-4">
                    {loading ? (
                        <p className="text-center text-muted-foreground">Carregando lendas...</p>
                    ) : games.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-border p-8 text-center text-muted-foreground">
                            No champions yet. Go battle!
                        </div>
                    ) : (
                        games.map((game, index) => (
                            <motion.div
                                key={game.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="group relative flex items-center gap-4 overflow-hidden rounded-xl border border-border bg-card/50 p-4 transition-all hover:bg-card hover:glow-blue"
                            >
                                {/* Ranking Number */}
                                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full font-display text-xl font-bold ${
                                    index === 0 ? "bg-yellow-500/20 text-yellow-500" :
                                        index === 1 ? "bg-slate-400/20 text-slate-400" :
                                            index === 2 ? "bg-amber-700/20 text-amber-700" :
                                                "bg-muted text-muted-foreground"
                                }`}>
                                    {index + 1}º
                                </div>

                                {/* Imagem do Jogo */}
                                <div className="h-16 w-28 shrink-0 overflow-hidden rounded-md bg-muted">
                                    <img
                                        src={game.imageUrl}
                                        alt={game.name}
                                        className="h-full w-full object-cover transition-transform group-hover:scale-110"
                                        onError={(e) => {
                                            e.currentTarget.src = `https://placehold.co/460x215/171a21/66c0f4?text=${encodeURIComponent(game.name)}`;
                                        }}
                                    />
                                </div>

                                {/* Nome */}
                                <div className="grow">
                                    <h3 className="font-display text-lg font-bold text-foreground">
                                        {game.name}
                                    </h3>
                                    {index === 0 && (
                                        <span className="flex items-center gap-1 text-xs font-medium text-yellow-500">
                      <Medal className="h-3 w-3" /> The Ultimate Champion!
                    </span>
                                    )}
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>

                {/* Botão Voltar */}
                <div className="mt-10 text-center">
                    <button
                        onClick={onBack}
                        className="flex items-center justify-center gap-2 rounded-lg px-6 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground mx-auto"
                    >
                        <ArrowLeft className="h-4 w-4" /> Go back
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HallOfFame;