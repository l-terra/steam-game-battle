import { motion } from "framer-motion";

const SteamIcon = () => (
    <img
        src="https://upload.wikimedia.org/wikipedia/commons/8/83/Steam_icon_logo.svg"
        alt="Steam Logo"
        className="h-6 w-6"
    />
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
