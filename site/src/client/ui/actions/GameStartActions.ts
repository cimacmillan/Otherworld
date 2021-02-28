export interface GameStartActions {
    fadeBackground: () => void;
    fadeMenu: () => void;
    setGameFPS: (fps: number) => void;
    setGameLoadPercentage: (percentage: number) => void;
    startGame: () => void;
}
