export interface Player {
  id: number;
  name: string;
  position: string;
  age: number;
  club: string;
}

export interface Team {
  id: number;
  name: string;
  group: string;
  players: Player[];
}

export interface WorldCup {
  year: number;
  host: string;
  teams: Team[];
}

export interface WorldCupData {
  WorldCups: WorldCup[];
}
