import { gamificationModels } from "../../gamification/shared/gamification.model";

/**
 * Gamification engine — the single source of truth that turns a raw XP
 * total into a level + rank for a player.
 *
 * The ladder is built entirely from the **Ranks** configured in the CRM
 * (Gamification → Ranks). Each rank's `data.levels[]` defines the levels
 * inside it, every level carrying an XP window (`xp_start` → `xp_end`)
 * and an optional per-level reward. XP earned in the gamify backend is
 * synced here and re-resolved against this ladder so the CRM-defined
 * ranges always drive progression.
 */

export interface LevelRung {
  rank_name: string;
  level: number;
  xp_start: number;
  xp_end: number;
  reward_type?: string | null;
  reward_value?: number | null;
}

export interface Progress {
  level: number;
  rank_name: string;
  xp_points: number;
  xp_to_next: number;
  max_level: number;
}

const num = (v: unknown, fallback = 0): number => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};

/**
 * Build the ordered level ladder from every ACTIVE, non-archived rank.
 * Rungs are sorted by `xp_start` (then level) so resolution is a simple
 * scan. Returns `[]` when no ranks/levels are configured yet.
 */
export const loadLadder = async (): Promise<LevelRung[]> => {
  const ranks = await gamificationModels.ranks.findAll({
    where: { status: "ACTIVE", archived: false } as never,
    order: [["priority", "DESC"]],
  });

  const rungs: LevelRung[] = [];
  for (const rank of ranks) {
    const data = (rank.data ?? {}) as Record<string, unknown>;
    const levels = Array.isArray(data.levels)
      ? (data.levels as Record<string, unknown>[])
      : [];
    for (const lvl of levels) {
      const xp_start = num(lvl.xp_start);
      const xp_end = num(lvl.xp_end, xp_start);
      rungs.push({
        rank_name: rank.name,
        level: num(lvl.level, rungs.length + 1),
        xp_start,
        xp_end,
        reward_type: (lvl.reward_type as string) || null,
        reward_value:
          lvl.reward_value === undefined || lvl.reward_value === null
            ? null
            : num(lvl.reward_value),
      });
    }
  }

  rungs.sort((a, b) =>
    a.xp_start === b.xp_start ? a.level - b.level : a.xp_start - b.xp_start
  );
  return rungs;
};

/** The lowest rung — used to initialise a brand-new player. */
export const firstRung = (ladder: LevelRung[]): LevelRung | null =>
  ladder.length ? ladder[0] : null;

/**
 * Resolve an XP total to a level/rank against the ladder. Returns `null`
 * when no ladder is configured so callers can fall back to model defaults.
 */
export const resolveProgress = (
  xpTotal: number,
  ladder: LevelRung[]
): Progress | null => {
  if (!ladder.length) return null;

  const xp = Math.max(0, num(xpTotal));
  const maxLevel = ladder.reduce((m, r) => Math.max(m, r.level), 0);

  let idx = 0;
  for (let i = 0; i < ladder.length; i += 1) {
    if (xp >= ladder[i].xp_start) idx = i;
    else break;
  }
  const current = ladder[idx];
  const next = ladder[idx + 1];

  return {
    level: current.level,
    rank_name: current.rank_name,
    xp_points: xp,
    xp_to_next: next ? Math.max(0, next.xp_start - xp) : 0,
    max_level: maxLevel,
  };
};

/**
 * Rungs newly crossed when XP moves from `prevXp` → `nextXp` that carry a
 * configured reward — used to auto-grant per-level rewards on level-up.
 */
export const newlyRewardedRungs = (
  prevXp: number,
  nextXp: number,
  ladder: LevelRung[]
): LevelRung[] =>
  ladder.filter(
    (r) =>
      r.xp_start > prevXp &&
      r.xp_start <= nextXp &&
      r.reward_type &&
      r.reward_value != null &&
      r.reward_value > 0
  );
