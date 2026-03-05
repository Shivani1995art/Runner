// src/services/socket/SocketService.ts

import { io, Socket } from 'socket.io-client';
import { SOCKET_EVENTS } from './SocketEvents';
import { logger } from '../../utils/logger';


const SOCKET_URL = 'https://cabana.api.kepsmart.com';

type EventCallback = (data: any) => void;

class SocketService {
    private socket: Socket | null = null;
    private listeners: Map<string, Set<EventCallback>> = new Map();
    private currentOutletId: string | null = null;
    private currentRunnerId: string | null = null;

    // ── Connect ────────────────────────────────────────────────────────
    connect(token: string, outletId: string ,runnerId: string) {
        if (this.socket?.connected) return;
logger.log("[Socket] Connecting...",outletId,runnerId);
        this.currentOutletId = outletId;
        this.currentRunnerId = runnerId;

        this.socket = io(SOCKET_URL, {
            auth: { token },
            transports: ['websocket'],
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
            timeout: 10000,
        });

        this.socket.on(SOCKET_EVENTS.CONNECT, () => {
            console.log('[Socket] Connected:', this.socket?.id);
            // Rejoin user room on every connect/reconnect
            this.joinOutletRoom(this.currentOutletId!);
             this.joinRunnerRoom(this.currentRunnerId!);
        });

        this.socket.on(SOCKET_EVENTS.DISCONNECT, (reason) => {
            console.log('[Socket] Disconnected:', reason);
        });

        this.socket.on(SOCKET_EVENTS.ERROR, (err) => {
            console.warn('[Socket] Error:', err.message);
        });

        // Re-attach saved listeners after reconnect
        this.listeners.forEach((callbacks, event) => {
            callbacks.forEach((cb) => this.socket?.on(event, cb));
        });
        this.socket.onAny((event, data) => {
  //console.log("📡 Received Event:", event, data);
});
    }

    // ── Disconnect ─────────────────────────────────────────────────────
    disconnect() {
       
        if(this.currentOutletId){
            this.leaveOutletRoom(this.currentOutletId!);
        }
        if(this.currentRunnerId){
            this.leaveRunnerRoom(this.currentRunnerId!);
        }
        this.socket?.disconnect();
        this.socket = null;
        this.currentOutletId = null;
        this.currentRunnerId = null;
    }

    // ── Room: User ─────────────────────────────────────────────────────
    joinOutletRoom(outletId: string) {
        console.log('[Socket] Joining Outlet room:', outletId);
        this.socket?.emit(SOCKET_EVENTS.JOIN_OUTLET_RUNNERS, outletId);
    }
    
    joinRunnerRoom(runnerId: string) {
        console.log('[Socket] Joining Runner room:', runnerId);
        this.socket?.emit(SOCKET_EVENTS.JOIN_RUNNER, runnerId); 
    }
    leaveRunnerRoom(runnerId: string) {
        console.log('[Socket] Leaving Runner room:', runnerId);
        this.socket?.emit(SOCKET_EVENTS.LEAVE_RUNNER, runnerId);
    }
    leaveOutletRoom(outletId: string) {
        console.log('[Socket] Leaving Outlet room:', outletId);
        this.socket?.emit(SOCKET_EVENTS.LEAVE_OUTLET_RUNNERS, outletId);
    }

    // ── Subscribe ──────────────────────────────────────────────────────
    on(event: string, callback: EventCallback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, new Set());
        }
        this.listeners.get(event)!.add(callback);
        this.socket?.on(event, callback);
        
    }

    // ── Unsubscribe ────────────────────────────────────────────────────
    off(event: string, callback: EventCallback) {
        this.listeners.get(event)?.delete(callback);
        this.socket?.off(event, callback);
    }

    isConnected() {
        return this.socket?.connected ?? false;
    }
}

export const socketService = new SocketService();