import React from 'react';
import '../../old_style/engine.css';
import { ChinpokoData } from '../chinpoko/chinpoko';
import { Type, } from '../type/type';
import { findEffectiveness, findStab } from '../type/biome';

interface EngineProps {
}

export function calcDamage(power: number | undefined, type: Type, user: ChinpokoData, target: ChinpokoData):number {
	if (power === undefined) {
		return 0;
	}
	const stabPower = power * findStab(type, user.storedData.species.biome);
	let damage = (((((2 * user.storedData.lvl) / 5) + 2) * stabPower * (user.atk / target.def)) / 50 ) + 2;
	damage = Math.round(damage * findEffectiveness(type, target.storedData.species.biome));
	return damage;
}

export function calcAbsorb(percentage: number | undefined, type: Type, user: ChinpokoData, damage: number):number {
	if (percentage === undefined) {
		return 0;
	}
	let absorb = damage * percentage * findStab(type, user.storedData.species.biome);
	absorb = Math.round(absorb);
	return absorb;
}

export function calcHeal(percentage: number | undefined, type: Type, user: ChinpokoData): number {
	if (percentage === undefined) {
		return 0;
	}
	let heal = user.maxhp * percentage * findStab(type, user.storedData.species.biome);
	heal = Math.round(heal);
	return heal;
}

export class Engine extends React.Component<EngineProps> {
	render() {
		return (
			<div></div>
		);
	}
}