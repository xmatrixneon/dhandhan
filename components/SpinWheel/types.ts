import { Prize } from "@/lib/constants";

export interface SpinWheelState {
  isSpinning: boolean;
  rotation: number;
  currentPrize: Prize | null;
  hasWon: boolean;
}

export interface SpinWheelProps {
  onWin?: (prize: Prize) => void;
}

export interface WheelCanvasProps {
  rotation: number;
  prizes: Prize[];
  size: number;
}
