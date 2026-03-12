/**
 * ═══════════════════════════════════════════════════════════════════════════
 * SPLASH SCREEN MANAGER
 * 
 * Manages splash screen display with proper timing and state management
 * Ensures smooth app startup experience
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { logger } from "../../utils/logger";


// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

export enum SplashState {
  INITIAL = 'initial',           // App just started
  CHECKING_AUTH = 'checking_auth', // Verifying login status
  BOOTSTRAPPING = 'bootstrapping', // Loading initial data
  CHECKING_PERMISSIONS = 'checking_permissions', // Verifying permissions
  READY = 'ready',               // Ready to show main app
}

export interface SplashConfig {
  /**
   * Minimum time splash should show (ms)
   * Prevents flash, gives smooth feel
   * Default: 1500ms (1.5 seconds)
   */
  minDisplayTime: number;

  /**
   * Maximum time to wait before showing app anyway
   * Prevents stuck splash
   * Default: 10000ms (10 seconds)
   */
  maxWaitTime: number;

  /**
   * Show detailed loading messages
   * Default: true
   */
  showMessages: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// SPLASH SCREEN MANAGER CLASS
// ─────────────────────────────────────────────────────────────────────────────

class SplashScreenManager {
  private state: SplashState = SplashState.INITIAL;
  private startTime: number = 0;
  private readyTime: number = 0;
  private config: SplashConfig;
  private displayPromise: Promise<void> | null = null;
  private resolveDisplay: (() => void) | null = null;

  constructor(config: Partial<SplashConfig> = {}) {
    this.config = {
      minDisplayTime: 1500,
      maxWaitTime: 10000,
      showMessages: true,
      ...config,
    };

    logger.log('🎬 SplashScreenManager initialized with config:', this.config);
  }

  /**
   * Start splash screen display
   * Call this when app launches
   */
  public start(): void {
    this.startTime = Date.now();
    this.state = SplashState.INITIAL;

    // Create promise that resolves when min display time passes
    this.displayPromise = new Promise((resolve) => {
      this.resolveDisplay = resolve;
    });

    logger.log('🎬 Splash screen START');
  }

  /**
   * Update splash state and message
   */
  public setState(state: SplashState, message?: string): void {
    this.state = state;

    if (this.config.showMessages && message) {
      logger.log(`🎬 [${state}] ${message}`);
    } else {
      logger.log(`🎬 [${state}]`);
    }
  }

  /**
   * Mark app as ready
   * Shows splash for minimum time before revealing app
   */
  public async markReady(): Promise<void> {
    this.readyTime = Date.now();
    const elapsedTime = this.readyTime - this.startTime;

    logger.log(`🎬 App marked ready (elapsed: ${elapsedTime}ms)`);

    // Calculate remaining display time
    const remainingTime = this.config.minDisplayTime - elapsedTime;

    if (remainingTime > 0) {
      logger.log(`⏳ Splash will show for ${remainingTime}ms more`);
      await this.delay(remainingTime);
    } else {
      logger.log(`✅ Minimum display time already passed`);
    }

    this.state = SplashState.READY;
    logger.log('🎬 Splash screen HIDE');

    // Resolve the display promise
    if (this.resolveDisplay) {
      this.resolveDisplay();
    }
  }

  /**
   * Wait for splash to finish displaying
   */
  public async waitForSplashToHide(): Promise<void> {
    if (this.displayPromise) {
      await this.displayPromise;
    }
  }

  /**
   * Get current state
   */
  public getState(): SplashState {
    return this.state;
  }

  /**
   * Check if splash should still be visible
   */
  public shouldShowSplash(): boolean {
    return this.state !== SplashState.READY;
  }

  /**
   * Get elapsed time since splash started
   */
  public getElapsedTime(): number {
    return Date.now() - this.startTime;
  }

  /**
   * Get splash display duration
   */
  public getDisplayDuration(): number {
    return this.readyTime - this.startTime;
  }

  /**
   * Reset splash manager
   */
  public reset(): void {
    this.state = SplashState.INITIAL;
    this.startTime = 0;
    this.readyTime = 0;
    this.displayPromise = null;
    this.resolveDisplay = null;
    logger.log('🎬 SplashScreenManager reset');
  }

  /**
   * Update config
   */
  public updateConfig(config: Partial<SplashConfig>): void {
    this.config = { ...this.config, ...config };
    logger.log('🎬 SplashScreenManager config updated:', this.config);
  }

  /**
   * Helper: delay function
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Get current config
   */
  public getConfig(): SplashConfig {
    return { ...this.config };
  }

  /**
   * Get debug info
   */
  public getDebugInfo(): {
    state: SplashState;
    elapsedTime: number;
    displayDuration: number;
    config: SplashConfig;
  } {
    return {
      state: this.state,
      elapsedTime: this.getElapsedTime(),
      displayDuration: this.getDisplayDuration(),
      config: this.config,
    };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// SINGLETON INSTANCE
// ─────────────────────────────────────────────────────────────────────────────

export const splashScreenManager = new SplashScreenManager({
  minDisplayTime: 1500, // Splash shows for at least 1.5 seconds
  maxWaitTime: 10000,   // Max 10 seconds to prevent stuck splash
  showMessages: true,
});