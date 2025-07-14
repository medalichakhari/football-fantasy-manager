import { Position, TEAM_REQUIREMENTS } from '../types/index';

export const FOOTBALL_TEAMS = [
  'Arsenal',
  'Chelsea',
  'Liverpool',
  'Manchester City',
  'Manchester United',
  'Tottenham',
  'Newcastle',
  'Brighton',
  'West Ham',
  'Aston Villa',
  'Crystal Palace',
  'Brentford',
  'Fulham',
  'Wolves',
  'Everton',
  'Leeds United',
  'Leicester City',
  'Southampton',
  'Bournemouth',
  'Nottingham Forest',
];

export const FIRST_NAMES = [
  'James',
  'Robert',
  'John',
  'Michael',
  'David',
  'William',
  'Richard',
  'Joseph',
  'Thomas',
  'Christopher',
  'Charles',
  'Daniel',
  'Matthew',
  'Anthony',
  'Mark',
  'Donald',
  'Steven',
  'Paul',
  'Andrew',
  'Joshua',
  'Kenneth',
  'Kevin',
  'Brian',
  'George',
  'Timothy',
  'Ronald',
  'Jason',
  'Edward',
  'Jeffrey',
  'Ryan',
  'Jacob',
  'Gary',
  'Nicholas',
  'Eric',
  'Jonathan',
  'Stephen',
  'Larry',
  'Justin',
  'Scott',
  'Brandon',
  'Benjamin',
  'Samuel',
  'Gregory',
  'Alexander',
  'Patrick',
  'Liam',
  'Noah',
  'Oliver',
  'Elijah',
  'Lucas',
  'Mason',
  'Logan',
  'Alexander',
  'Ethan',
  'Jacob',
  'Michael',
  'Daniel',
  'Henry',
  'Jackson',
  'Sebastian',
];

export const LAST_NAMES = [
  'Smith',
  'Johnson',
  'Williams',
  'Brown',
  'Jones',
  'Garcia',
  'Miller',
  'Davis',
  'Rodriguez',
  'Martinez',
  'Hernandez',
  'Lopez',
  'Gonzalez',
  'Wilson',
  'Anderson',
  'Thomas',
  'Taylor',
  'Moore',
  'Jackson',
  'Martin',
  'Lee',
  'Perez',
  'Thompson',
  'White',
  'Harris',
  'Sanchez',
  'Clark',
  'Ramirez',
  'Lewis',
  'Robinson',
  'Walker',
  'Young',
  'Allen',
  'King',
  'Wright',
  'Scott',
  'Torres',
  'Nguyen',
  'Hill',
  'Flores',
  'Green',
  'Adams',
  'Nelson',
  'Baker',
  'Hall',
  'Rivera',
  'Campbell',
  'Mitchell',
  'Carter',
  'Roberts',
  'Gomez',
  'Phillips',
  'Evans',
  'Turner',
  'Diaz',
  'Parker',
  'Cruz',
  'Edwards',
  'Collins',
  'Reyes',
];

export const generatePlayerName = (): string => {
  const firstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
  const lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
  return `${firstName} ${lastName}`;
};

export const generateRandomTeam = (): string => {
  return FOOTBALL_TEAMS[Math.floor(Math.random() * FOOTBALL_TEAMS.length)];
};

export const generatePlayerPrice = (position: Position): number => {
  const basePrices = {
    [Position.GK]: { min: 50000, max: 300000 },
    [Position.DEF]: { min: 80000, max: 500000 },
    [Position.MID]: { min: 100000, max: 800000 },
    [Position.ATT]: { min: 150000, max: 1200000 },
  };

  const range = basePrices[position];
  return Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
};

export const generateTeamComposition = (): Array<{
  name: string;
  position: Position;
  team: string;
  price: number;
}> => {
  const players = [];

  for (let i = 0; i < TEAM_REQUIREMENTS.GOALKEEPERS; i++) {
    players.push({
      name: generatePlayerName(),
      position: Position.GK,
      team: generateRandomTeam(),
      price: generatePlayerPrice(Position.GK),
    });
  }

  for (let i = 0; i < TEAM_REQUIREMENTS.DEFENDERS; i++) {
    players.push({
      name: generatePlayerName(),
      position: Position.DEF,
      team: generateRandomTeam(),
      price: generatePlayerPrice(Position.DEF),
    });
  }

  for (let i = 0; i < TEAM_REQUIREMENTS.MIDFIELDERS; i++) {
    players.push({
      name: generatePlayerName(),
      position: Position.MID,
      team: generateRandomTeam(),
      price: generatePlayerPrice(Position.MID),
    });
  }

  for (let i = 0; i < TEAM_REQUIREMENTS.ATTACKERS; i++) {
    players.push({
      name: generatePlayerName(),
      position: Position.ATT,
      team: generateRandomTeam(),
      price: generatePlayerPrice(Position.ATT),
    });
  }

  return players;
};

export const calculateTeamValue = (players: { price: number }[]): number => {
  return players.reduce((total, player) => total + player.price, 0);
};

export const validateTeamComposition = (players: { position: Position }[]): boolean => {
  const counts = players.reduce(
    (acc, player) => {
      acc[player.position] = (acc[player.position] || 0) + 1;
      return acc;
    },
    {} as Record<Position, number>
  );

  return (
    counts[Position.GK] === TEAM_REQUIREMENTS.GOALKEEPERS &&
    counts[Position.DEF] === TEAM_REQUIREMENTS.DEFENDERS &&
    counts[Position.MID] === TEAM_REQUIREMENTS.MIDFIELDERS &&
    counts[Position.ATT] === TEAM_REQUIREMENTS.ATTACKERS
  );
};
