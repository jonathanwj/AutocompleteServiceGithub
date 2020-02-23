import { currentTimeInSeconds } from "./utils";
export default class RateLimiter {
  static RATE_LIMIT_ERROR: string = "RateLimitReached";
  private static nextAllowedQueryTime: number = 0;

  static setNextAllowedQueryTime(
    rateLimitRemaining: number,
    rateLimitResetTime: number
  ) {
    let currTime: number = currentTimeInSeconds();

    if (currTime >= rateLimitResetTime) {
      // reset limit has passed
      RateLimiter.nextAllowedQueryTime = currTime;
    } else {
      // divide remaining time left by number of rateLimitRemaining
      // this prevents lockout by github API
      let secondsToNextAllowedQuery = Math.round(
        (rateLimitResetTime - currTime) / rateLimitRemaining
      );
      RateLimiter.nextAllowedQueryTime = currTime + secondsToNextAllowedQuery;
    }
  }

  static isAllowedNextQuery() {
    if (currentTimeInSeconds() > RateLimiter.nextAllowedQueryTime) {
      return true;
    } else {
      return false;
    }
  }
}
