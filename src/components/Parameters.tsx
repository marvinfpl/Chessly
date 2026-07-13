import { X } from "lucide-react"
import type { settings } from "./types";

type Props = {
    onClose: () => void;
    settings: settings
    updateSettings: (newSettings: settings) => void
}

export default function Parameters({onClose, settings, updateSettings}: Props) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">

            <div className="w-[420px] rounded-2xl bg-white p-6 shadow-2xl">
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-2xl font-semibold text-slate-800">Settings</h2>
                    <button onClick={onClose} className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800">
                        <X size={20} />
                    </button>
                </div>
                <div className="space-y-5">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">Puzzle Difficulty</label>
                        <select value={settings.difficulty} onChange={(e) => updateSettings({...settings, difficulty: e.target.value})} defaultValue="normal" className="text-black w-full rounded-lg border border-slate-300 px-3 py-2 outline-none transition focus:border-blue-500">
                            <option value="easiest">Easiest</option>
                            <option value="easier">Easier</option>
                            <option value="normal">Normal</option>
                            <option value="harder">Harder</option>
                            <option value="hardest">Hardest</option>
                        </select>
                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">Player Name</label>
                        <input value={settings.playerName} onChange={(e) => {updateSettings({...settings, playerName: e.target.value})}} type="text" placeholder="" className="text-black w-full rounded-lg border border-slate-300 px-3 py-2 outline-none transition focus:border-blue-500"/>
                    </div>
                    <div>
                    </div>
                    <div className="flex items-center justify-between rounded-lg bg-slate-100 px-4 py-3">
                        <span className="text-slate-700">Show move hints</span>
                        <input type="checkbox" checked={settings.showHints} onChange={(e) => updateSettings({...settings, showHints: e.target.checked})} className="h-5 w-5 accent-blue-600"/>
                    </div>
                    </div>
                <div className="mt-8 flex justify-end gap-3">

                    <button onClick={onClose} className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-500">Save</button>
                </div>
            </div>
        </div>
    </div>
    );
}