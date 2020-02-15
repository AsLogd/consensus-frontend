import React from 'react';
import './style/chinpoko.scss';
import { Type, TypeList } from './type';
import bisonte from './images/bisonte.png'
import lagarto from './images/lagarto.png'
import nutria from './images/nutria.png'
import gato from './images/gato.png'
import ardilla from './images/ardilla.png'
import morsa from './images/morsa.png'

export interface ChinpokoStoredData {
	name: string
	species: BaseChinpokoData
	lvl: number
	evHP: number
	evATK: number
	evDEF: number
	evSPE: number
}

export const BaseChinpokoList = {
	"BISONTE": {
		speciesName: "BISONTE",
		sprite: bisonte,
		baseHP: 100,
		baseATK: 60,
		baseDEF: 100,
		baseSPE: 60,
		type: TypeList["GRASS"]
	},
	"LAGARTO": {
		speciesName: "LAGARTO",
		sprite: lagarto,
		baseHP: 70,
		baseATK: 100,
		baseDEF: 70,
		baseSPE: 80,
		type: TypeList["FIRE"]
	},
	"NUTRIA": {
		speciesName: "NUTRIA",
		sprite: nutria,
		baseHP: 60,
		baseATK: 100,
		baseDEF: 60,
		baseSPE: 100,
		type: TypeList["WATER"]
	},
	"GATO": {
		speciesName: "GATO",
		sprite: gato,
		baseHP: 50,
		baseATK: 80,
		baseDEF: 50,
		baseSPE: 140,
		type: TypeList["MISTERY"]
	},
  "ARDILLA": {
    speciesName: "ARDILLA",
    sprite: ardilla,
    baseHP: 80,
    baseATK: 60,
    baseDEF: 60,
    baseSPE: 120,
    type: TypeList["ELECTRIC"]
  },
  "MORSA": {
    speciesName: "MORSA",
    sprite: morsa,
    baseHP: 100,
    baseATK: 100,
    baseDEF: 70,
    baseSPE: 50,
    type: TypeList["ICE"]
  }
};

export const ChinpokoList: Array<ChinpokoStoredData> = [{
	name: "Imanol",
	species: BaseChinpokoList["BISONTE"],
	lvl: 10, evHP: 0, evATK: 0, evDEF: 0, evSPE: 0
}, {
	name: "Gerard",
	species: BaseChinpokoList["LAGARTO"],
	lvl: 10, evHP: 0, evATK: 0, evDEF: 0, evSPE: 0
}, {
	name: "Mojano",
	species: BaseChinpokoList["NUTRIA"],
	lvl: 10, evHP: 0, evATK: 0, evDEF: 0, evSPE: 0
}, {
	name: "Aida",
	species: BaseChinpokoList["GATO"],
	lvl:10, evHP: 0, evATK: 0, evDEF: 0, evSPE: 0
}, {
  name: "Erico",
  species: BaseChinpokoList["ARDILLA"],
  lvl:10, evHP: 0, evATK: 0, evDEF: 0, evSPE: 0
}, {
  name: "Alejandro",
  species: BaseChinpokoList["MORSA"],
  lvl:10, evHP: 0, evATK: 0, evDEF: 0, evSPE: 0
}];

export interface BaseChinpokoData {
	speciesName: string
	sprite: string
	baseHP: number
	baseATK: number
	baseDEF: number
	baseSPE: number
	type: Type
}

export interface ChinpokoData {
	storedData: ChinpokoStoredData
	maxhp: number
	hp: number
	atk: number
	def: number
	spe: number
}

export function getRandomChinpoko(): ChinpokoData {
	let index = Math.floor(Math.random() * ChinpokoList.length);
	return getChinpokoData(ChinpokoList[index]);
}

export function getChinpokoData(storedData: ChinpokoStoredData): ChinpokoData {
	let startingHP = calcHP(storedData.species.baseHP, storedData.evHP, storedData.lvl);
	let chinpoko: ChinpokoData = {
		storedData: storedData,
		maxhp: startingHP,
		hp: startingHP,
		atk: calcStat(storedData.species.baseATK, storedData.evATK, storedData.lvl),
		def: calcStat(storedData.species.baseDEF, storedData.evDEF, storedData.lvl),
		spe: calcStat(storedData.species.baseSPE, storedData.evSPE, storedData.lvl)
	}
	return chinpoko;
}

function calcStat(baseStat: number, evStat: number, lvl: number): number {
	return Math.floor(((2 * baseStat + evStat) * lvl / 100) + 5)
}

function calcHP(baseHP: number, evHP: number, lvl: number): number {
	return Math.floor(((2 * baseHP + evHP) * lvl / 100) + lvl + 10)
}

interface ChinpokoProps {
	chinpoko: ChinpokoData
	ally: boolean
}

export class Chinpoko extends React.Component<ChinpokoProps> {

	renderChinpokoSprite() {
		const species = this.props.chinpoko.storedData.species
		return (
			<div className={`chinpoko-component__sprite`}>
				<img src={species.sprite} alt={species.speciesName} />
			</div>
		)
	}

	// <img src={ "/images/" + this.state.species.speciesName.toLowerCase() + ".png" }  alt={ this.state.species.speciesName } />

	renderChinpokoDataBox() {
		const {chinpoko} = this.props
		const storedData = chinpoko.storedData
		const healthStyle = { width: (chinpoko.hp * 96 / chinpoko.maxhp) }
		const cpc = "chinpoko-component"
		return (
			<div className={`${cpc}__databox`}>
				<div className={`${cpc}__hpbox hpbox`}>
					<div className="hpbox__title">
						<div className="hpbox__name">
							{storedData.name}
						</div>
						<div className="hpbox__lvl">
							<b>lvl {storedData.lvl}</b>
						</div>
					</div>
					<div className="hpbox__healthbar" style={healthStyle}>
					</div>
					<div className="hpbox__hp">
						<b>HP </b>{chinpoko.hp} / {chinpoko.maxhp}
					</div>
				</div>
				<div className={`${cpc}__statbox`}>
					<table>
						<thead>
							<tr>
								<th>ATK</th>
								<th>DEF</th>
								<th>SPE</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>{chinpoko.atk}</td>
								<td>{chinpoko.def}</td>
								<td>{chinpoko.spe}</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		)
	}

	render() {
		const allyClass = this.props.ally ? "is-ally" : "is-enemy"
		return (
			<div className={`chinpoko-component chinpoko-component--${allyClass}`}>
				{this.renderChinpokoDataBox()}
				{this.renderChinpokoSprite()}
			</div>
		);
	}
}