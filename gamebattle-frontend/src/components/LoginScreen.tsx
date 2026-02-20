import { motion } from "framer-motion";

const SteamIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
    <path d="M12 2C6.48 2 2 6.03 2 11.05c0 3.2 1.87 6.04 4.73 7.57l2.94-1.18a2.48 2.48 0 0 1 1.83.04l2.17.87a1.87 1.87 0 0 0 2.58-1.1l.04-.13a1.87 1.87 0 0 0-1.1-2.25l-2.42-.97a2.49 2.49 0 0 1-1.5-2.88 2.49 2.49 0 0 1 2.44-1.87h.24a2.49 2.49 0 0 1 2.42 1.92c.14.53.08 1.09-.16 1.58l-.08.16a1.87 1.87 0 0 0 .77 2.39l.13.07A6.97 6.97 0 0 0 19 11.05C19 6.03 15.52 2 12 2z"/>
  </svg>
);

interface LoginScreenProps {
  onLogin: () => void;
}

const LoginScreen = ({ onLogin }: LoginScreenProps) => {
  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-center"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-6 text-7xl"
        >
          ⚔️
        </motion.div>

        <h2 className="font-display mb-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          <span className="text-gradient-blue">Steam</span> Battle
        </h2>

        <p className="mx-auto mb-10 max-w-md text-lg text-muted-foreground">
          Discover which game from your library you should play today.
        </p>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onLogin}
          className="group relative inline-flex items-center gap-3 rounded-lg border border-border bg-secondary px-8 py-4 font-body text-base font-semibold text-foreground transition-all duration-300 hover:border-primary hover:glow-blue"
        >
          <SteamIcon />
          SIGN IN WITH STEAM
        </motion.button>
      </motion.div>
    </div>
  );
};

export default LoginScreen;
