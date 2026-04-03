import { SEGMENT_ANGLE, TARGET_PRIZE_INDEX, FULL_ROTATIONS, SPIN_DURATION } from "./constants";

/**
 * Calculate the exact rotation angle to land on the target prize (₹500)
 *
 * Canvas coordinate system:
 * - 0°   = 3 o'clock (right)
 * - 90°  = 6 o'clock (bottom)
 * - 180° = 9 o'clock (left)
 * - 270° = 12 o'clock (top) ← pointer is here
 *
 * Formula: rotation = pointerPosition - targetSegmentCenter
 * Because: targetSegmentCenter + rotation = 270 (top)
 */
export function calculateTargetRotation(): number {
  const targetSegmentCenter =
    TARGET_PRIZE_INDEX * SEGMENT_ANGLE + SEGMENT_ANGLE / 2;

  // Pointer is at the TOP = 270° in canvas coordinates
  const pointerPosition = 270;
  let baseRotation = pointerPosition - targetSegmentCenter;

  // Normalize to positive so wheel always spins forward
  if (baseRotation < 0) baseRotation += 360;

  // Add full rotations for a dramatic spin effect
  return FULL_ROTATIONS * 360 + baseRotation;
}

/**
 * Cubic-bezier easing function for realistic wheel deceleration
 * Fast start, gradual slowdown - mimics physics
 */
export function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

/**
 * Animation controller for smooth wheel spin
 * Uses requestAnimationFrame for 60fps performance
 */
export function animateWheel(
  startTime: number,
  targetRotation: number,
  onProgress: (rotation: number) => void,
  onComplete: () => void
): void {
  const currentTime = performance.now();
  const elapsed = currentTime - startTime;
  const progress = Math.min(elapsed / SPIN_DURATION, 1);

  // Apply easing for realistic deceleration
  const easedProgress = easeOutCubic(progress);

  // Calculate current rotation
  const currentRotation = easedProgress * targetRotation;

  // Update wheel
  onProgress(currentRotation);

  // Continue animation or complete
  if (progress < 1) {
    requestAnimationFrame(() =>
      animateWheel(startTime, targetRotation, onProgress, onComplete)
    );
  } else {
    onComplete();
  }
}

/**
 * Get the prize at a specific angle (for validation/testing)
 */
export function getPrizeAtAngle(angle: number): number {
  const normalizedAngle = angle % 360;
  const segmentIndex = Math.floor(normalizedAngle / SEGMENT_ANGLE);
  return segmentIndex;
}