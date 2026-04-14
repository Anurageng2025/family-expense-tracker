import Dexie, { Table } from 'dexie';

export interface QueuedRequest {
  id?: number;
  url: string;
  method: 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  data: any;
  headers: any;
  timestamp: number;
  status: 'pending' | 'failed' | 'processing';
  error?: string;
  retryCount: number;
}

export interface CachedData {
  key: string;
  data: any;
  timestamp: number;
}

export class ExpansisDB extends Dexie {
  queued_requests!: Table<QueuedRequest>;
  cache!: Table<CachedData>;

  constructor() {
    super('ExpansisDB');
    this.version(1).stores({
      queued_requests: '++id, status, timestamp',
      cache: 'key'
    });
  }
}

export const db = new ExpansisDB();
