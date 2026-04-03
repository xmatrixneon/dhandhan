export interface Prize {
  id: number;
  label: string;
  value: number;
  color: string;
  textColor: string;
}

export const PRIZES: Prize[] = [
  { id: 1, label: "₹100", value: 100, color: "#FF6B6B", textColor: "#FFFFFF" },
  { id: 2, label: "₹200", value: 200, color: "#4ECDC4", textColor: "#FFFFFF" },
  { id: 3, label: "₹500", value: 500, color: "#FFE66D", textColor: "#000000" }, // TARGET - Always wins!
  { id: 4, label: "₹1000", value: 1000, color: "#95E1D3", textColor: "#000000" },
  { id: 5, label: "₹2000", value: 2000, color: "#F38181", textColor: "#FFFFFF" },
  { id: 6, label: "₹3000", value: 3000, color: "#AA96DA", textColor: "#FFFFFF" },
  { id: 7, label: "₹4000", value: 4000, color: "#FCBAD3", textColor: "#000000" },
  { id: 8, label: "₹5000", value: 5000, color: "#FFFFD2", textColor: "#000000" },
];

export const TARGET_PRIZE_INDEX = 2; // Index of ₹500 in prizes array
export const TOTAL_SEGMENTS = PRIZES.length;
export const SEGMENT_ANGLE = 360 / TOTAL_SEGMENTS; // 45° per segment

// Mobile-optimized wheel size
export const WHEEL_SIZE = 260; // 260px for mobile (more compact)
export const CENTER_X = WHEEL_SIZE / 2;
export const CENTER_Y = WHEEL_SIZE / 2;
export const RADIUS = Math.min(CENTER_X, CENTER_Y) - 10;

// Animation settings
export const SPIN_DURATION = 5500; // 5.5 seconds for dramatic effect
export const FULL_ROTATIONS = 5; // Number of full rotations before stopping

// Mobile tap target size
export const MIN_TAP_TARGET = 44; // 44px minimum for accessibility
