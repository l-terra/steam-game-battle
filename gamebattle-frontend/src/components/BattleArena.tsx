import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Game } from "@/data/mockGames";

interface BattleArenaProps {
  games: Game[];
  onChampion: (game: Game) => void;
  onBack: () => void;
}

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const BattleArena = ({ games, onChampion, onBack }: BattleArenaProps) => {
  const [bracket, setBracket] = useState<Game[]>([]);
  const [nextRound, setNextRound] = useState<Game[]>([]);
  const [pairIndex, setPairIndex] = useState(0);
  const [round, setRound] = useState(1);
  const [animKey, setAnimKey] = useState(0);

  useEffect(() => {
    // Pad to nearest power of 2
    const shuffled = shuffleArray(games);
    const size = Math.pow(2, Math.ceil(Math.log2(shuffled.length)));
    // Fill with byes (auto-advance)
    const padded = [...shuffled];
    while (padded.length < size) {
      padded.push(padded[padded.length % shuffled.length]);
    }
    setBracket(padded.slice(0, size));
    setNextRound([]);
    setPairIndex(0);
    setRound(1);
  }, [games]);

  const gameA = bracket[pairIndex * 2];
  const gameB = bracket[pairIndex * 2 + 1];
  const totalPairs = Math.floor(bracket.length / 2);
  const remaining = bracket.length;

  const handlePick = useCallback(
    (winner: Game) => {
      const updatedNext = [...nextRound, winner];

      if (pairIndex + 1 < totalPairs) {
        setNextRound(updatedNext);
        setPairIndex(pairIndex + 1);
        setAnimKey((k) => k + 1);
      } else {
        // Round complete
        if (updatedNext.length === 1) {
          onChampion(updatedNext[0]);
        } else {
          setBracket(updatedNext);
          setNextRound([]);
          setPairIndex(0);
          setRound((r) => r + 1);
          setAnimKey((k) => k + 1);
        }
      }
    },
    [nextRound, pairIndex, totalPairs, onChampion]
  );

  if (!gameA || !gameB) return null;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 pt-20 pb-10">
      {/* Progress */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-center"
      >
        <p className="font-display text-sm font-bold uppercase tracking-widest text-primary">
          Round {round}
        </p>
        <p className="text-xs text-muted-foreground">
          {remaining} games remaining &middot; Match {pairIndex + 1} of{" "}
          {totalPairs}
        </p>
        {/* Progress bar */}
        <div className="mx-auto mt-3 h-1 w-48 overflow-hidden rounded-full bg-muted">
          <motion.div
            className="h-full rounded-full bg-primary"
            animate={{ width: `${((pairIndex + 1) / totalPairs) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </motion.div>

      {/* Arena */}
      <AnimatePresence mode="wait">
        <motion.div
          key={animKey}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="flex w-full max-w-4xl flex-col items-center gap-6 sm:flex-row sm:gap-4"
        >
          {/* Game A */}
          <GameCard game={gameA} onPick={() => handlePick(gameA)} />

          {/* VS */}
          <div className="flex shrink-0 items-center justify-center">
            <span className="font-display text-4xl font-black italic text-primary drop-shadow-[0_0_20px_hsl(201,87%,67%,0.5)] sm:text-5xl">
              VS
            </span>
          </div>

          {/* Game B */}
          <GameCard game={gameB} onPick={() => handlePick(gameB)} />
        </motion.div>
      </AnimatePresence>

      <button
        onClick={onBack}
        className="mt-10 text-sm text-muted-foreground transition-colors hover:text-primary"
      >
        ← Back to Mode Selection
      </button>
    </div>
  );
};

function GameCard({ game, onPick }: { game: Game; onPick: () => void }) {
  return (
    <motion.button
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      onClick={onPick}
      className="group relative w-full overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:border-primary/70 hover:glow-blue-strong sm:w-1/2"
    >
      <div className="aspect-[460/215] w-full overflow-hidden">
        <img
          src={game.imageUrl}
          alt={game.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
      </div>
      <div className="p-4">
        <h3 className="font-display text-sm font-bold tracking-wide text-foreground sm:text-base">
          {game.name}
        </h3>
      </div>
      {/* Hover overlay */}
      <div className="absolute inset-0 rounded-xl border-2 border-transparent transition-all duration-300 group-hover:border-primary/50" />
    </motion.button>
  );
}

export default BattleArena;
