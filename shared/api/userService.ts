import axios from 'axios';
import { User } from '../types/User';

const API = 'https://jsonplaceholder.typicode.com/users';
const LS_KEY = 'mf_users_v1';

// fetch from API (and merge with local edits)
export async function fetchUsers(): Promise<User[]> {
  const res = await axios.get<User[]>(API);
  const apiUsers = res.data;
  const local = loadFromLocal();
  if (!local) return apiUsers;
  // merge: replace users that exist in local by id
  const localMap = new Map(local.map(u => [u.id, u]));
  return apiUsers.map(u => localMap.get(u.id) ?? u);
}

export async function fetchUserById(id: number): Promise<User | undefined> {
  const users = await fetchUsers();
  return users.find(u => u.id === id);
}

export function saveUserLocal(user: User) {
  const cur = loadFromLocal() ?? [];
  const idx = cur.findIndex(u => u.id === user.id);
  if (idx >= 0) cur[idx] = user;
  else cur.push(user);
  localStorage.setItem(LS_KEY, JSON.stringify(cur));
}

export function loadFromLocal(): User[] | null {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as User[];
  } catch {
    return null;
  }
}
