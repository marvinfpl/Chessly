import { Settings } from "lucide-react"
import { useState } from "react";
import Parameters from "./Parameters.tsx";
import { type settings } from "./types.tsx";

type Props = {
    result: string | null;
    gameStarted: boolean,
    play: () => void,
    resign: () => void,
    resetGame: () => void,
    settings: settings,
    updateSettings: (newSettings: settings) => void,
}

export default function Interface({result, gameStarted, play, resign, resetGame, settings, updateSettings}: Props) {
    const [open, setOpen] = useState(false);

    return (
        <div className="w-56 flex flex-col gap-4 justify-center items-center">
                <h1 className="text-2xl font-semibold tracking-thight">
                    ChessLy
                </h1>
                <p>Your Endgame Chess Trainer</p>
                {!gameStarted && !result && (<button onClick={play} className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 active:scale-95 transition font-medium">Play</button>)}
                {gameStarted && (<button onClick={resign} className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 active:scale-95 transition font-medium">Resign</button>)}
                {result && (<button onClick={resetGame} className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 active:scale-95 transition font-medium">New Game</button>)}
                {result && (<div className="p-3 rounded-lg bg-white/10 border border-white/10 text-sm text-slate-200">{result}</div>)}
                <button className="hover:bg-blue-500" onClick={() => setOpen(!open)}><Settings/></button>
                {open && <Parameters onClose={() => setOpen(false)} settings={settings} updateSettings={updateSettings}/>}
            </div>
    )
}