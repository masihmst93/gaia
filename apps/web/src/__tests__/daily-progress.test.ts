import { describe, expect, it } from "vitest";
import { calculateDailyProgress } from "@/features/progress/calculateDailyProgress";

describe("calculateDailyProgress", () => {
  it("returns zero for an empty day", () => {
    expect(calculateDailyProgress([])).toEqual({
      percent: 0,
      completedWeight: 0,
      totalWeight: 0,
    });
  });

  it("weights high-priority work more heavily", () => {
    expect(
      calculateDailyProgress([
        { completed: true, priority: "high" },
        { completed: false, priority: "low" },
      ]),
    ).toEqual({ percent: 75, completedWeight: 3, totalWeight: 4 });
  });

  it("treats missing priority as normal weight", () => {
    expect(
      calculateDailyProgress([
        { completed: true },
        { completed: false, priority: "medium" },
      ]),
    ).toEqual({ percent: 33, completedWeight: 1, totalWeight: 3 });
  });
});
