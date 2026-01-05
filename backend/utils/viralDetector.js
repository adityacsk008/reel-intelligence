/**
 * Viral Detector Utility
 * Real-time viral detection and alerting
 */

class ViralDetector {
  /**
   * Check if reel has viral potential
   */
  static checkViralPotential(reel, timeWindow = 24) {
    if (!reel.viewHistory || reel.viewHistory.length < 2) {
      return {
        hasViralPotential: false,
        reason: 'Insufficient data'
      };
    }

    // Get views from last N hours
    const cutoffTime = Date.now() - (timeWindow * 60 * 60 * 1000);
    const recentViews = reel.viewHistory.filter(vh => 
      new Date(vh.timestamp) > cutoffTime
    );

    if (recentViews.length < 2) {
      return {
        hasViralPotential: false,
        reason: 'Not enough recent data'
      };
    }

    // Calculate velocity (views per hour)
    const oldestRecent = recentViews[0].views;
    const newestRecent = recentViews[recentViews.length - 1].views;
    const viewGain = newestRecent - oldestRecent;
    const hoursElapsed = (new Date(recentViews[recentViews.length - 1].timestamp) - 
                          new Date(recentViews[0].timestamp)) / (1000 * 60 * 60);
    
    const velocity = viewGain / hoursElapsed;

    // Viral thresholds
    const VIRAL_VELOCITY_THRESHOLD = 1000; // 1000 views per hour
    const HIGH_VELOCITY_THRESHOLD = 500;
    const MEDIUM_VELOCITY_THRESHOLD = 100;

    if (velocity > VIRAL_VELOCITY_THRESHOLD) {
      return {
        hasViralPotential: true,
        level: 'MEGA_VIRAL',
        velocity: Math.round(velocity),
        message: '🔥 MEGA VIRAL! Explosive growth detected!',
        projectedViews24h: Math.round(reel.viewCount + (velocity * 24))
      };
    } else if (velocity > HIGH_VELOCITY_THRESHOLD) {
      return {
        hasViralPotential: true,
        level: 'HIGH_VIRAL',
        velocity: Math.round(velocity),
        message: '⚡ Going VIRAL! Strong momentum!',
        projectedViews24h: Math.round(reel.viewCount + (velocity * 24))
      };
    } else if (velocity > MEDIUM_VELOCITY_THRESHOLD) {
      return {
        hasViralPotential: true,
        level: 'TRENDING',
        velocity: Math.round(velocity),
        message: '📈 Trending! Good growth rate',
        projectedViews24h: Math.round(reel.viewCount + (velocity * 24))
      };
    }

    return {
      hasViralPotential: false,
      velocity: Math.round(velocity),
      reason: 'Normal growth rate'
    };
  }

  /**
   * Detect sudden spikes in views
   */
  static detectSpike(reel) {
    if (!reel.viewHistory || reel.viewHistory.length < 3) {
      return { hasSpike: false };
    }

    const history = reel.viewHistory.sort((a, b) => 
      new Date(a.timestamp) - new Date(b.timestamp)
    );

    // Calculate average change between consecutive snapshots
    const changes = [];
    for (let i = 1; i < history.length; i++) {
      changes.push(history[i].views - history[i - 1].views);
    }

    const avgChange = changes.reduce((a, b) => a + b, 0) / changes.length;
    const lastChange = changes[changes.length - 1];

    // Spike detected if last change is 3x average
    if (lastChange > avgChange * 3) {
      return {
        hasSpike: true,
        spikeMultiplier: (lastChange / avgChange).toFixed(2),
        message: `🚀 Spike Alert! ${lastChange.toLocaleString()} new views!`
      };
    }

    return { hasSpike: false };
  }

  /**
   * Generate viral alert notification
   */
  static generateAlert(reel, viralData) {
    return {
      reelId: reel.reelId,
      reelUrl: reel.reelUrl,
      currentViews: reel.viewCount,
      alertType: viralData.level || 'SPIKE',
      message: viralData.message,
      velocity: viralData.velocity,
      projectedViews: viralData.projectedViews24h,
      timestamp: new Date(),
      priority: viralData.level === 'MEGA_VIRAL' ? 'HIGH' : 'MEDIUM'
    };
  }

  /**
   * Calculate viral score (0-100)
   */
  static calculateViralScore(reel, avgViews) {
    const viewRatio = reel.viewCount / avgViews;
    
    // Check growth velocity
    let velocityScore = 0;
    const viralCheck = this.checkViralPotential(reel);
    if (viralCheck.hasViralPotential) {
      velocityScore = viralCheck.velocity / 10; // Normalize
    }

    // Combine factors
    const score = Math.min(
      (viewRatio * 30) + (velocityScore * 0.7),
      100
    );

    return Math.round(score);
  }
}

module.exports = ViralDetector;