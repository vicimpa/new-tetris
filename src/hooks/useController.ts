import { Controller } from "&core/Controller";
import type { Game } from "&core/Game";
import { useEffect, useMemo } from "react";
import { useLooper } from "./useLooper";
import { useSignalEffect } from "@preact/signals-react";

export function useController(game: Game) {
	const ctrl = useMemo(() => new Controller(), []);

	useEffect(() => { game.pause(); }, []);
	useLooper(() => ctrl.controll(game), false);
	useSignalEffect(() => ctrl.save());

	return ctrl;
}