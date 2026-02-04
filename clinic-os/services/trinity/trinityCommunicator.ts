
import { TrinityMode } from '../../types';
import { LANClient } from './lanClient';
import { WhisperClient } from './whisperClient';

export class TrinityCommunicator {
  private mode: TrinityMode = 'offline';
  private lanClient: LANClient;
  private whisperClient: WhisperClient;
  private userId: string;

  constructor(userId: string) {
    this.userId = userId;
    this.lanClient = new LANClient();
    this.whisperClient = new WhisperClient();
  }

  async initialize(): Promise<TrinityMode> {
    console.log('Trinity: Initializing Smart Routing...');
    
    // 1. Try LAN Discovery
    try {
      await this.lanClient.discover();
      await this.lanClient.authenticate(this.userId);
      this.mode = 'lan';
      return 'lan';
    } catch (error) {
      console.warn('Trinity: LAN Discovery failed, falling back to WhisperNet');
    }

    // 2. Try WhisperNet Fallback
    try {
      await this.whisperClient.connectToPeer('ghostvault-authority-peer');
      this.mode = 'whisper';
      return 'whisper';
    } catch (error) {
      console.error('Trinity: WhisperNet failed. Entering Offline Mode.');
      this.mode = 'offline';
      return 'offline';
    }
  }

  getMode(): TrinityMode {
    return this.mode;
  }

  async syncOfflineTasks(): Promise<void> {
    if (this.mode === 'offline') return;
    console.log('Trinity: Synchronizing queued tasks from offline buffer...');
    // Simulated sync
  }

  async routeAIRequest(payload: any): Promise<any> {
    const timestamp = Date.now();
    if (this.mode === 'lan') {
      return this.lanClient.request('/ai/route', {
        method: 'POST',
        body: JSON.stringify({ ...payload, timestamp })
      });
    } else if (this.mode === 'whisper') {
      return this.whisperClient.send({
        type: 'ai_request',
        payload,
        timestamp
      });
    } else {
      throw new Error('Action queued for offline sync');
    }
  }
}
