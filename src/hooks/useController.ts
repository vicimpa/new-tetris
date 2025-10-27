import { Controller } from "&core/Controller";
import type { Game } from "&core/Game";
import { useEffect, useMemo } from "react";
import { useLooper } from "./useLooper";


export function useController(game: Game) {
	const ctrl = useMemo(() => new Controller(), []);

	useEffect(() => { game.pause(); }, []);
	useLooper(() => ctrl.controll(game), false);

	return ctrl;
}