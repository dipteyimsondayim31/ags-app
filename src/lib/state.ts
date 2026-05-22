"use client";

export interface CandidateState {
  xp: number;
  level: number;
  streak: number;
  lastActive: string | null;
  learnedCardIds: string[];
  reviewCardIds: string[];
  studySecondsToday: number;
}

const STATE_KEY = "ags_candidate_progress_state";

const DEFAULT_STATE: CandidateState = {
  xp: 0,
  level: 1,
  streak: 12, // Starting streak based on mockup
  lastActive: null,
  learnedCardIds: [],
  reviewCardIds: [],
  studySecondsToday: 0,
};

export class ProgressManager {
  private static isClient(): boolean {
    return typeof window !== "undefined";
  }

  static getState(): CandidateState {
    if (!this.isClient()) return DEFAULT_STATE;

    try {
      const data = localStorage.getItem(STATE_KEY);
      if (!data) {
        // Initialize with default state
        const initial = { ...DEFAULT_STATE, lastActive: new Date().toISOString().split("T")[0] };
        this.saveState(initial);
        return initial;
      }
      const state = JSON.parse(data) as CandidateState;
      return {
        xp: typeof state.xp === "number" ? state.xp : 0,
        level: typeof state.level === "number" ? state.level : 1,
        streak: typeof state.streak === "number" ? state.streak : 12,
        lastActive: state.lastActive || null,
        learnedCardIds: Array.isArray(state.learnedCardIds) ? state.learnedCardIds : [],
        reviewCardIds: Array.isArray(state.reviewCardIds) ? state.reviewCardIds : [],
        studySecondsToday: typeof state.studySecondsToday === "number" ? state.studySecondsToday : 0,
      };
    } catch (e) {
      console.error("Error loading progress state:", e);
      return DEFAULT_STATE;
    }
  }

  static saveState(state: CandidateState): void {
    if (!this.isClient()) return;
    try {
      localStorage.setItem(STATE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error("Error saving progress state:", e);
    }
  }

  static addXp(amount: number): { leveledUp: boolean; newLevel: number; newXp: number } {
    const state = this.getState();
    state.xp += amount;
    let leveledUp = false;

    // Level up calculation: XP to next level = Level * 100
    while (state.xp >= state.level * 100) {
      state.xp -= state.level * 100;
      state.level += 1;
      leveledUp = true;
    }

    this.saveState(state);
    return { leveledUp, newLevel: state.level, newXp: state.xp };
  }

  static updateStreak(): void {
    const state = this.getState();
    const todayStr = new Date().toISOString().split("T")[0];

    if (!state.lastActive) {
      state.lastActive = todayStr;
      state.streak = 12; // Start with mockup default
    } else {
      const lastActiveDate = new Date(state.lastActive);
      const todayDate = new Date(todayStr);
      const diffTime = todayDate.getTime() - lastActiveDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        state.streak += 1;
        state.lastActive = todayStr;
      } else if (diffDays > 1) {
        state.streak = 1; // Reset streak
        state.lastActive = todayStr;
      } else if (diffDays === 0) {
        // Already active today, do nothing
      }
    }

    this.saveState(state);
  }

  static addStudySeconds(seconds: number): void {
    const state = this.getState();
    state.studySecondsToday += seconds;
    this.saveState(state);
  }

  static resetDailySecondsIfNewDay(): void {
    const state = this.getState();
    const todayStr = new Date().toISOString().split("T")[0];
    if (state.lastActive !== todayStr) {
      state.studySecondsToday = 0;
      state.lastActive = todayStr;
      this.saveState(state);
    }
  }

  static markCardAsLearned(cardId: string): { leveledUp: boolean; newLevel: number; newXp: number } {
    const state = this.getState();

    // Remove from review if it was there
    state.reviewCardIds = state.reviewCardIds.filter((id) => id !== cardId);

    // Add to learned if not already present
    if (!state.learnedCardIds.includes(cardId)) {
      state.learnedCardIds.push(cardId);
    }

    this.saveState(state);
    // Award +10 XP for learned (Kolay)
    return this.addXp(10);
  }

  static markCardForReview(cardId: string): { leveledUp: boolean; newLevel: number; newXp: number } {
    const state = this.getState();

    // Remove from learned if it was there
    state.learnedCardIds = state.learnedCardIds.filter((id) => id !== cardId);

    // Add to review if not already present
    if (!state.reviewCardIds.includes(cardId)) {
      state.reviewCardIds.push(cardId);
    }

    this.saveState(state);
    // Award +5 XP for review (Zor)
    return this.addXp(5);
  }

  /**
   * Prune obsolete card IDs from localStorage if they no longer exist in the DB
   */
  static pruneObsoleteCards(activeCardIds: string[]): void {
    const state = this.getState();
    const activeSet = new Set(activeCardIds);

    const initialLearnedCount = state.learnedCardIds.length;
    const initialReviewCount = state.reviewCardIds.length;

    state.learnedCardIds = state.learnedCardIds.filter((id) => activeSet.has(id));
    state.reviewCardIds = state.reviewCardIds.filter((id) => activeSet.has(id));

    if (
      state.learnedCardIds.length !== initialLearnedCount ||
      state.reviewCardIds.length !== initialReviewCount
    ) {
      console.log("Pruned obsolete card IDs from localStorage");
      this.saveState(state);
    }
  }
}
