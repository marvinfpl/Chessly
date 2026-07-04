import { Chessboard, chessColumnToColumnIndex, defaultPieces, type PieceDropHandlerArgs, type PieceRenderObject  } from "react-chessboard";
import {Chess, type PieceSymbol, type Square} from 'chess.js';
import { useEffect, useMemo, useRef, useState } from "react";
import Interface from "./Interface";

type PromotionMove = {
    sourceSquare: Square,
    targetSquare: Square
}

export default function Board() {
    const chessGameRef = useRef(new Chess("8/P7/7K/8/8/8/8/k7 w - - 0 1"));
    const chessGame = chessGameRef.current;

    const [chessPosition, setChessPosition] = useState(chessGame.fen());
    const [gameStarted, setGameStarted] = useState(false);
    const [result, setResult] = useState<string | null>(null);
    const [promotionMove, setPromotionMove] = useState<PromotionMove | null>(null);
    const [squareSize, setSquareSize] = useState(0);

    useEffect(() => {
        const measure = () => {
            const el = document.querySelector(`[data-column="a"][data-row="1"]`) as HTMLElement | null;
            if (!el) return;
            const size = el.getBoundingClientRect().width;
            setSquareSize(size);
        };
        measure();
        window.addEventListener("resize", measure);
        return () => window.removeEventListener("resize", measure);
    }, []);

    function play() {
        setGameStarted(true);
        setResult(null);
    }

    function resign() {
        setGameStarted(false);
        setResult("Game over! You resigned");
    }

    function resetGame() {
        chessGame.reset();
        setChessPosition(chessGame.fen());
        setPromotionMove(null);
        setResult(null);
        setGameStarted(true);
    }

    function computeResult() {
        if (chessGame.isCheckmate()) {
            const winner = chessGame.turn() === "w" ? "black" : "white";
            return `Checkmate! ${winner} wins!`;
        }
        if (chessGame.isStalemate()) return "Draw by Stalemate";
        if (chessGame.isDrawByFiftyMoves()) return "Draw By 50 moves";
        if (chessGame.isThreefoldRepetition()) return "Draw by repetition";
        if (chessGame.isInsufficientMaterial()) return "Draw by insufficient material";
        return "Game Over!";
    }

    function makeRandomMove() {
        if (!gameStarted) return;
        if (chessGame.isGameOver()) {
            setResult(computeResult());
            return;
        }
        const moves = chessGame.moves();
        const move = moves[Math.floor(Math.random() * moves.length)];
        chessGame.move(move);
        setChessPosition(chessGame.fen());
        if (chessGame.isGameOver()) {
            setResult(computeResult());
        }
    }

    function handlePromotion(piece: PieceSymbol) {
        if (!promotionMove) return;
        try {
            chessGame.move({
                from: promotionMove.sourceSquare,
                to: promotionMove.targetSquare,
                promotion: piece,
            });
            setChessPosition(chessGame.fen());
            setPromotionMove(null);

            if (chessGame.isGameOver()) {
                setResult(computeResult());
                return;
            }

            setTimeout(makeRandomMove, 300);
        } catch (err) {
            console.error("Promotion error: ", err);
            setPromotionMove(null);
        }
    }

    function onPieceDrop({sourceSquare, targetSquare}: PieceDropHandlerArgs): boolean {
        if (!gameStarted) return false;
        if (!targetSquare || !sourceSquare) return false;

        const from = sourceSquare as Square;
        const to = targetSquare as Square;

        const promotionRank = chessGame.turn() === "w" ? "8" : "1";
        const isPromotionSquare = targetSquare.endsWith(promotionRank);

        if (isPromotionSquare) {
            const moves = chessGame.moves({square: from, verbose: true});
            const canPromote = moves.some((m) => m.to === targetSquare && m.isPromotion?.());

            if (canPromote) {
                setPromotionMove({
                    sourceSquare: from,
                    targetSquare: to,
                });
                return true;
            }
        }

        try {
            chessGame.move({
                from: sourceSquare,
                to: targetSquare,
                promotion: 'q',
            });
            setChessPosition(chessGame.fen());
            if (chessGame.isGameOver()) {
                setResult(computeResult());
                return true;
            }
            setTimeout(makeRandomMove, 300);
            return true;
        } catch (err) {
            console.error("Move error: ", err);
            return false;
        }
    }

    const chessboardOptions = useMemo(() => ({
        onPieceDrop,
        position: chessPosition,
        id: "",
    }), [chessPosition, gameStarted]);

    const file = promotionMove?.targetSquare?.[0] ?? 'a';
    const promotionSquareLeft = squareSize > 0 ? squareSize * chessColumnToColumnIndex(file, 8, 'white') : 0;
    const pieceColor = promotionMove ? chessGame.get(promotionMove.sourceSquare)?.color ?? 'w' : 'w';

    return (
        <div className="h-screen w-full flex items-center justify-center bg-slate-950 text-white">
            <div className="flex gap-10 p-8 rounded-3xl bg-white/5 border border-white/10 shadow-2xl backdrop-blur-md">
            <div className="relative w-[800px] h-[800px] rounded-xl overflow-hidden shadow-xl">
                {promotionMove && squareSize > 0 ? (
                    <div className="absolute inset-0 bg-black/20 z-40" onClick={() => setPromotionMove(null)}></div>
                ): null}
                {promotionMove && squareSize > 0 ? (
                    <div className="absolute top-0 z-50 flex flex-col bg-white shadow-2xl" style={{left: promotionSquareLeft, width: squareSize}}>
                        {(["q", "r", "b", "n"] as PieceSymbol[]).map(
                            (p) => (
                                <button key={p} onClick={() => handlePromotion(p)} className="aspect-square flex items-center justify-center hover:bg-slate-200">
                                    {defaultPieces[`${pieceColor}${p.toUpperCase()}` as keyof PieceRenderObject]()}
                                </button>
                            )
                        )}
                    </div>
                ): null}
                <Chessboard options={chessboardOptions}/>
            </div>
            <Interface result={result} gameStarted={gameStarted} play={play} resign={resign} resetGame={resetGame}/>
            </div>
        </div>
    );
}