import { motion } from "framer-motion";
import { Clock, Flame } from "lucide-react";

interface ModeSelectionProps {
  onSelectMode: (mode: "backlog" | "favorites") => void;
  onHallOfFame: () => void;
}

const modes = [
  {
    id: "backlog" as const,
    title: "Backlog Battle",
    subtitle: "Games with less than 3 hours of playtime",
    icon: Clock,
    emoji: "📦",
  },
  {
    id: "favorites" as const,
    title: "Favorites Battle",
    subtitle: "Your most played games",
    icon: Flame,
    emoji: "🔥",
  },
];

const ModeSelection = ({ onSelectMode, onHallOfFame }: ModeSelectionProps) => { // <--- Adicionado aqui
  return (
      <div className="flex min-h-screen items-center justify-center px-6">
        <div className="w-full max-w-3xl">
          <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-10 text-center"
          >
            <h2 className="font-display mb-2 text-3xl font-bold text-foreground sm:text-4xl">
              Choose Your <span className="text-gradient-blue">Arena</span>
            </h2>
            <p className="text-muted-foreground">
              Pick a mode to start the battle
            </p>
          </motion.div>

          {/* Grid com os modos Batalha */}
          <div className="grid gap-6 sm:grid-cols-2">
            {modes.map((mode, i) => (
                <motion.div
                    key={mode.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 * i, duration: 0.5 }}
                >
                  <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => onSelectMode(mode.id as 'backlog' | 'favorites')}
                      className="group glass relative w-full overflow-hidden rounded-xl p-8 text-left transition-all duration-300 hover:border-primary hover:glow-blue"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/0 transition-all duration-300 group-hover:from-primary/5 group-hover:to-primary/10" />

                    <div className="relative z-10">
                      <span className="mb-4 block text-4xl">{mode.emoji}</span>
                      <h3 className="font-display mb-2 text-xl font-bold text-foreground">
                        {mode.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {mode.subtitle}
                      </p>
                    </div>
                  </motion.button>
                </motion.div>
            ))}
          </div> {/* Fim da grid */}

          {/* --- BOTÃO HALL OF FAME --- */}
          <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
          >
            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onHallOfFame}
                className="mx-auto block mt-6 w-full max-w-2xl rounded-xl border border-border bg-card/30 p-4 text-center font-display text-lg font-bold text-muted-foreground transition-all duration-300 hover:border-yellow-500/50 hover:bg-yellow-500/10 hover:text-yellow-500 hover:glow-gold"
            >
              🏆 Hall of Fame - See the Legends!
            </motion.button>
          </motion.div>

        </div>
      </div>
  );
};

export default ModeSelection;
