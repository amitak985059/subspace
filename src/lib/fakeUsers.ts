export interface FakeUser {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'offline' | 'away';
  lastSeen?: string;
  isBot: boolean;
}

export const fakeUsers: FakeUser[] = [
  {
    id: '1',
    name: 'Bob Smith',
    avatar: '👨‍💼',
    status: 'online',
    lastSeen: 'recently',
    isBot: true
  },
  {
    id: '2',
    name: 'Alice Johnson',
    avatar: '👩‍🦰',
    status: 'online',
    lastSeen: 'recently',
    isBot: true
  },
  {
    id: '3',
    name: 'Carol Wilson',
    avatar: '👩‍🦱',
    status: 'online',
    lastSeen: 'recently',
    isBot: true
  },
  {
    id: '4',
    name: 'David Brown',
    avatar: '👨‍🦱',
    status: 'online',
    lastSeen: 'recently',
    isBot: true
  }
];

export const getRandomUser = (): FakeUser => {
  return fakeUsers[Math.floor(Math.random() * fakeUsers.length)];
};

export const getUsersByStatus = (status: 'online' | 'offline' | 'away'): FakeUser[] => {
  return fakeUsers.filter(user => user.status === status);
};
