import { STORAGE_KEY } from '../constants';
import type { DiaryEntry } from '../types';

export function saveEntry(entry: DiaryEntry): void {
  const entries = getAllEntries();
  entries.push(entry);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function getAllEntries(): DiaryEntry[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    const entries: DiaryEntry[] = JSON.parse(raw);
    return entries.sort((a, b) => b.createdAt - a.createdAt);
  } catch {
    return [];
  }
}

export function getEntryById(id: string): DiaryEntry | null {
  const entries = getAllEntries();
  return entries.find((e) => e.id === id) ?? null;
}

export function getEntriesByMonth(year: number, month: number): DiaryEntry[] {
  const prefix = `${year}-${String(month).padStart(2, '0')}`;
  return getAllEntries().filter((e) => e.date.startsWith(prefix));
}
