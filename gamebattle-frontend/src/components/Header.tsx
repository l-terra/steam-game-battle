import { LogOut, Swords } from "lucide-react";

// Adicionamos username e avatarUrl nas props (propriedades)
interface HeaderProps {
  isLoggedIn: boolean;
  onLogout: () => void;
  username?: string;
  avatarUrl?: string;
}

const Header = ({ isLoggedIn, onLogout, username, avatarUrl }: HeaderProps) => {
  return (
      <header className="fixed top-0 left-0 right-0 z-50 glass-strong">
        <div className="container mx-auto flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <Swords className="h-7 w-7 text-primary" />
            <h1 className="font-display text-xl font-bold tracking-wider text-gradient-blue">
              Steam Battle
            </h1>
          </div>

          {isLoggedIn && (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  {/* Usa a foto de verdade ou uma imagem genérica caso falhe */}
                  <img
                      src={avatarUrl || "https://avatars.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_medium.jpg"}
                      alt="Avatar"
                      className="h-8 w-8 rounded-full border border-border"
                  />
                  <span className="hidden text-sm font-medium text-foreground sm:inline">
                {username || "Carregando..."}
              </span>
                </div>
                <button
                    onClick={onLogout}
                    className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
          )}
        </div>
      </header>
  );
};

export default Header;