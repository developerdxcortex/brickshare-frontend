// Rich, hand-authored detail-page content for specific plans.
// Matched against the plan's `name` field (case-insensitive, partial match).
// If a plan's name doesn't match any entry here, the detail page just
// shows the normal fields from the database (no extra sections).

export type SnapshotItem = { label: string; value: string };
export type FlowStep = { label: string };
export type OptionCard = { title: string; value: string };
export type PhaseStep = { label: string; detail: string };
export type MetricCard = { label: string; value: string };

export type PlanDetailExtra = {
  match: string[]; // substrings to match against plan.name (lowercase)
  snapshot: SnapshotItem[];
  howItWorks?: FlowStep[];
  options?: OptionCard[];
  phases?: PhaseStep[];
  financials?: MetricCard[];
  returns?: MetricCard[];
  advantages?: string[];
};

export const planDetailsExtra: PlanDetailExtra[] = [
  {
    match: ["duplex"],
    snapshot: [
      { label: "Properties", value: "5" },
      { label: "Total Project Investment", value: "$1M" },
      { label: "Estimated Project Profit", value: "$500K" },
      { label: "ROI Target*", value: "30%" },
      { label: "Investment Structure", value: "12 Months" },
      { label: "Minimum Investment", value: "$25K" },
    ],
    howItWorks: [
      { label: "6 Months → 15% ROI" },
      { label: "6-Month Checkpoint" },
      { label: "6 Months → 15% ROI" },
      { label: "12-Month Completion" },
    ],
    options: [
      { title: "Fixed ROI", value: "15% + 15%" },
      { title: "Profit Partnership", value: "50 / 50" },
    ],
  },
  {
    match: ["higgins"],
    snapshot: [
      { label: "Townhomes", value: "4" },
      { label: "Size (Each)", value: "~1,840 SF" },
      { label: "Initial Project Investment", value: "$1.35M" },
      { label: "Projected Value After 5 Years", value: "$2.28M" },
    ],
    phases: [
      { label: "Site", detail: "" },
      { label: "Construction", detail: "" },
      { label: "Stabilization", detail: "" },
      { label: "Hold", detail: "" },
      { label: "Exit", detail: "" },
    ],
    financials: [
      { label: "Gross Annual Rental Income", value: "$100,800" },
      { label: "Net Cash Flow (Annual)", value: "$70,560" },
      { label: "Projected Equity Growth (5-Yr)", value: "$930,000" },
    ],
    advantages: [
      "Stable cash flow",
      "Long-term appreciation",
      "Multiple exit strategies",
      "Conservative underwriting",
      "Potential Opportunity Zone benefits",
    ],
  },
  {
    match: ["reserves", "missouri city"],
    snapshot: [
      { label: "Homes", value: "32" },
      { label: "Development", value: "$11.42M" },
      { label: "Development Timeline", value: "18–24 Months" },
      { label: "Hold Period", value: "5 Years" },
      { label: "Est. 5-Year Sale Value", value: "$21.25M" },
      { label: "Target IRR", value: "16–20%" },
    ],
    phases: [
      { label: "Phase 1", detail: "4 Pilot Homes" },
      { label: "Phase 2", detail: "4 Homes" },
      { label: "Phase 3", detail: "8 Homes" },
      { label: "Phase 4", detail: "8 Homes" },
      { label: "Phase 5", detail: "8 Homes" },
    ],
    financials: [
      { label: "Projected Gross Rental Revenue", value: "$960K" },
      { label: "Effective Gross Revenue", value: "$912K" },
      { label: "Projected NOI", value: "$586.2K" },
    ],
    returns: [
      { label: "Preferred Return", value: "8%" },
      { label: "Target IRR", value: "16–20%" },
      { label: "Equity Multiple", value: "1.8–2.3×" },
      { label: "Hold Period", value: "5 Years" },
    ],
  },
];

export function findPlanDetailExtra(planName?: string): PlanDetailExtra | undefined {
  if (!planName) return undefined;
  const n = planName.toLowerCase();
  return planDetailsExtra.find((p) => p.match.some((m) => n.includes(m)));
}
