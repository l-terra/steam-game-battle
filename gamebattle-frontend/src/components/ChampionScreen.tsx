import { motion } from "framer-motion";
import { RotateCcw } from "lucide-react";
import { Game } from "@/data/mockGames";

interface ChampionScreenProps {
  champion: Game;
  onPlayAgain: () => void;
}

const ChampionScreen = ({ champion, onPlayAgain }: ChampionScreenProps) => {
  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md text-center"
      >
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6 text-5xl"
        >
          🏆
        </motion.p>

        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="font-display mb-8 text-2xl font-bold text-foreground sm:text-3xl"
        >
          Your Champion is:
        </motion.h2>

        {/* Champion Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="glow-gold relative mx-auto overflow-hidden rounded-2xl border-2 border-champion"
        >
          <div className="aspect-[460/215] w-full overflow-hidden">
            <img
              src={champion.imageUrl}
              alt={champion.name}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="bg-card p-5">
            <h3 className="font-display text-xl font-bold text-gradient-gold sm:text-2xl">
              {champion.name}
            </h3>
          </div>
        </motion.div>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onPlayAgain}
          className="mt-10 inline-flex items-center gap-2 rounded-lg border border-border bg-secondary px-6 py-3 font-body text-sm font-semibold text-foreground transition-all hover:border-primary hover:glow-blue"
        >
          <RotateCcw className="h-4 w-4" />
          Play Again
        </motion.button>
      </motion.div>
    </div>
  );
};

export default ChampionScreen;
