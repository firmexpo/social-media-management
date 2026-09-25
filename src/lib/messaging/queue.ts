/**
 * Firm Expo — Scheduled Messaging Queue & Execution Engine
 * Queue abstraction for BullMQ / Redis and Client-side dispatch orchestration.
 */

import { ScheduledMessageItem } from '../../types';

export interface QueueJob<T> {
  id: string;
  data: T;
  scheduledTime: Date;
  status: 'waiting' | 'active' | 'completed' | 'failed' | 'paused';
  attempts: number;
}

export class MessagingQueueService {
  private static isPaused: boolean = false;

  public static setPaused(paused: boolean): void {
    this.isPaused = paused;
  }

  public static getIsPaused(): boolean {
    return this.isPaused;
  }

  /**
   * Sort queue by earliest scheduled dispatch time
   */
  public static prioritizeQueue(items: ScheduledMessageItem[]): ScheduledMessageItem[] {
    return [...items].sort((a, b) => new Date(a.scheduledFor).getTime() - new Date(b.scheduledFor).getTime());
  }
}
