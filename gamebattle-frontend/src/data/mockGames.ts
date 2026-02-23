export interface Game {
  id: number;
  appId: number;
  name: string;
  imageUrl: string;
  playtimeHours: number;
}

// Steam header images via CDN
const img = (appId: number) =>
  `https://cdn.akamai.steamstatic.com/steam/apps/${appId}/header.jpg`;

export const mockGames: Game[] = [
  { id: 1, appId: 730, name: "Counter-Strike 2", imageUrl: img(730), playtimeHours: 1200 },
  { id: 2, appId: 570, name: "Dota 2", imageUrl: img(570), playtimeHours: 850 },
  { id: 3, appId: 440, name: "Team Fortress 2", imageUrl: img(440), playtimeHours: 320 },
  { id: 4, appId: 1245620, name: "Elden Ring", imageUrl: img(1245620), playtimeHours: 180 },
  { id: 5, appId: 1091500, name: "Cyberpunk 2077", imageUrl: img(1091500), playtimeHours: 95 },
  { id: 6, appId: 892970, name: "Valheim", imageUrl: img(892970), playtimeHours: 2.5 },
  { id: 7, appId: 1174180, name: "Red Dead Redemption 2", imageUrl: img(1174180), playtimeHours: 0.8 },
  { id: 8, appId: 105600, name: "Terraria", imageUrl: img(105600), playtimeHours: 450 },
  { id: 9, appId: 413150, name: "Stardew Valley", imageUrl: img(413150), playtimeHours: 1.2 },
  { id: 10, appId: 367520, name: "Hollow Knight", imageUrl: img(367520), playtimeHours: 0.5 },
  { id: 11, appId: 814380, name: "Sekiro", imageUrl: img(814380), playtimeHours: 2.1 },
  { id: 12, appId: 1086940, name: "Baldur's Gate 3", imageUrl: img(1086940), playtimeHours: 200 },
  { id: 13, appId: 250900, name: "The Binding of Isaac: Rebirth", imageUrl: img(250900), playtimeHours: 600 },
  { id: 14, appId: 238960, name: "Path of Exile", imageUrl: img(238960), playtimeHours: 1500 },
  { id: 15, appId: 1172470, name: "Apex Legends", imageUrl: img(1172470), playtimeHours: 400 },
  { id: 16, appId: 1238810, name: "Battlefield V", imageUrl: img(1238810), playtimeHours: 1.8 },
];

export const mockUser = {
  username: "ShadowBlade_42",
  avatarUrl: "https://avatars.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_medium.jpg",
};
