/**
 * Convert MM:SS format to seconds
 * @param mmss - Duration in MM:SS format (e.g., "05:30" for 5 minutes 30 seconds)
 * @returns Duration in seconds
 */
export function mmssToSeconds(mmss: string): number {
  if (!mmss || !mmss.includes(':')) return 0;
  
  const [minutes, seconds] = mmss.split(':').map(num => parseInt(num, 10));
  if (isNaN(minutes) || isNaN(seconds)) return 0;
  
  return (minutes * 60) + seconds;
}

/**
 * Convert seconds to MM:SS format
 * @param seconds - Duration in seconds
 * @returns Duration in MM:SS format
 */
export function secondsToMmss(seconds: number): string {
  if (!seconds || seconds < 0) return "00:00";
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

/**
 * Convert seconds to human readable format (e.g., "1h 30m", "45m", "2m 30s")
 * @param seconds - Duration in seconds
 * @returns Human readable duration
 */
export function secondsToHumanReadable(seconds: number): string {
  if (!seconds || seconds < 0) return "0s";
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  
  const parts: string[] = [];
  
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (remainingSeconds > 0 && hours === 0) parts.push(`${remainingSeconds}s`);
  
  return parts.join(' ') || "0s";
}

/**
 * Calculate total duration from an array of lesson durations
 * @param lessons - Array of lessons with duration in seconds
 * @returns Total duration in seconds
 */
export function calculateTotalDuration(lessons: { duration?: number }[]): number {
  return lessons.reduce((total, lesson) => {
    return total + (lesson.duration || 0);
  }, 0);
}

/**
 * Validate MM:SS format
 * @param mmss - Duration string to validate
 * @returns true if valid MM:SS format
 */
export function isValidMmssFormat(mmss: string): boolean {
  const regex = /^([0-9]{1,2}):([0-5][0-9])$/;
  const match = mmss.match(regex);
  
  if (!match) return false;
  
  const [, minutes, seconds] = match;
  const min = parseInt(minutes, 10);
  const sec = parseInt(seconds, 10);
  
  return min >= 0 && min <= 99 && sec >= 0 && sec <= 59;
} 