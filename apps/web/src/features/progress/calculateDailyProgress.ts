export type ProgressPriority = "high" | "medium" | "low" | "none";

export interface ProgressItem {
  completed: boolean;
  priority?: ProgressPriority | null;
}

export interface DailyProgress {
  percent: number;
  completedWeight: number;
  totalWeight: number;
}

const PRIORITY_WEIGHT: Record<ProgressPriority, number> = {
  high: 3,
  medium: 2,
  low: 1,
  none: 1,
};

/**
 * Deterministic daily progress calculation.
 * AI may explain this value, but must never invent or overwrite it.
 */
export function calculateDailyProgress(items: ProgressItem[]): DailyProgress {
  if (items.length === 0) {
    return { percent: 0, completedWeight: 0, totalWeight: 0 };
  }

  let completedWeight = 0;
  let totalWeight = 0;

  for (const item of items) {
    const priority = item.priority ?? "none";
    const weight = PRIORITY_WEIGHT[priority] ?? PRIORITY_WEIGHT.none;
    totalWeight += weight;
    if (item.completed) completedWeight += weight;
  }

  return {
    percent:
      totalWeight === 0 ? 0 : Math.round((completedWeight / totalWeight) * 100),
    completedWeight,
    totalWeight,
  };
}
