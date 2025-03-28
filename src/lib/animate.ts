
import { cn } from "./utils";

/**
 * Generates classes for staggered fade-in animations
 * @param index Position in sequence
 * @param baseDelay Base delay in milliseconds
 * @returns Tailwind classes for animation
 */
export function staggeredFadeIn(index: number, baseDelay: number = 100) {
  const delay = index * baseDelay;
  return `animate-fade-in opacity-0 [animation-delay:${delay}ms] [animation-fill-mode:forwards]`;
}

/**
 * Returns CSS class for a focused form field animation
 */
export function focusedFieldAnimation() {
  return cn(
    "transition-all duration-300 ease-out",
    "focus-within:shadow-md focus-within:border-finance-primary"
  );
}

/**
 * Returns CSS class for a button animation effect
 */
export function buttonAnimation(isLoading: boolean = false) {
  return cn(
    "transition-all duration-300",
    isLoading ? "animate-pulse" : "hover:shadow-md active:scale-95"
  );
}

/**
 * Returns CSS class for step transition animations
 */
export function stepTransition(isActive: boolean) {
  return cn(
    "transition-all duration-500 transform",
    isActive 
      ? "translate-x-0 opacity-100" 
      : "translate-x-8 opacity-0 absolute pointer-events-none"
  );
}
