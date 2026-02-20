import { motion } from "framer-motion";
import { Clock, Flame } from "lucide-react";

interface ModeSelectionProps {
  onSelectMode: (mode: "backlog" | "favorites") => void;
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

const ModeSelection = ({ onSelectMode }: ModeSelectionProps) => {
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

        <div className="grid gap-6 sm:grid-cols-2">
          {modes.map((mode, i) => (
            <motion.button
              key={mode.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 * i, duration: 0.5 }}
              whileHover={{ scale: 1.03, y: -4 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onSelectMode(mode.id)}
              className="group glass relative overflow-hidden rounded-xl p-8 text-left transition-all duration-300 hover:border-primary/60 hover:glow-blue"
            >
              {/* Subtle gradient overlay on hover */}
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
          ))}
        </div>
      </div>
    </div>
  );
};

export default ModeSelection;
