/**
 * AI Engine for Reel Intelligence
 * Calculates quality scores, viral detection, and content classification
 */

class AIEngine {
  /**
   * Calculate Reel Quality Score (0-100)
   * Based on: View growth (40%), Engagement consistency (30%), 
   * Posting frequency (20%), Content variety (10%)
   */
  static calculateQualityScore(reel, userReels) {
    let score = 0;

    // 1. View Growth Rate (40 points)
    const avgViews = userReels.reduce((sum, r) => sum + r.viewCount, 0) / userReels.length;
    const growthRate = ((reel.viewCount - avgViews) / avgViews) * 100;
    
    if (growthRate > 100) score += 40;
    else if (growthRate > 50) score += 30;
    else if (growthRate > 0) score += 20;
    else score += 10;

    // 2. Engagement Consistency (30 points)
    if (reel.viewHistory && reel.viewHistory.length > 1) {
      const viewChanges = [];
      for (let i = 1; i < reel.viewHistory.length; i++) {
        const change = reel.viewHistory[i].views - reel.viewHistory[i - 1].views;
        viewChanges.push(change);
      }
      
      const avgChange = viewChanges.reduce((a, b) => a + b, 0) / viewChanges.length;
      const variance = viewChanges.reduce((sum, change) => sum + Math.pow(change - avgChange, 2), 0) / viewChanges.length;
      const stdDev = Math.sqrt(variance);
      
      // Lower standard deviation = more consistent = higher score
      if (stdDev < avgChange * 0.2) score += 30;
      else if (stdDev < avgChange * 0.5) score += 20;
      else score += 10;
    } else {
      score += 15; // Default for new reels
    }

    // 3. Posting Frequency (20 points)
    const recentReels = userReels.filter(r => {
      const daysDiff = (Date.now() - new Date(r.scannedAt)) / (1000 * 60 * 60 * 24);
      return daysDiff <= 7;
    });
    
    if (recentReels.length >= 7) score += 20;
    else if (recentReels.length >= 4) score += 15;
    else if (recentReels.length >= 2) score += 10;
    else score += 5;

    // 4. Content Variety (10 points)
    const categories = new Set(userReels.map(r => r.category));
    if (categories.size >= 4) score += 10;
    else if (categories.size >= 3) score += 7;
    else if (categories.size >= 2) score += 5;
    else score += 2;

    return Math.min(Math.round(score), 100);
  }

  /**
   * Detect if a reel is going viral
   * Returns: { isViral, viralScore, message }
   */
  static detectViral(reel, userReels) {
    const avgViews = userReels.reduce((sum, r) => sum + r.viewCount, 0) / userReels.length;
    
    // Viral score calculation
    const viralScore = ((reel.viewCount - avgViews) / avgViews) * 100;

    let isViral = false;
    let message = '';

    if (viralScore > 500) {
      isViral = true;
      message = '🔥 MEGA VIRAL! This reel is exploding!';
    } else if (viralScore > 300) {
      isViral = true;
      message = '⚡ Going VIRAL! Exceptional performance!';
    } else if (viralScore > 200) {
      isViral = true;
      message = '🚀 Viral Alert! This reel is trending!';
    } else if (viralScore > 100) {
      message = '📈 High Performer! Above average engagement';
    } else if (viralScore > 0) {
      message = '✅ Good Performance';
    } else {
      message = '📊 Below Average';
    }

    return {
      isViral,
      viralScore: Math.round(viralScore),
      message
    };
  }

  /**
   * Classify reel content category
   * Uses keyword matching and pattern recognition
   */
  static classifyContent(reelUrl, reelId) {
    // This is a simplified version
    // In production, you'd use ML models or more sophisticated analysis
    
    const movieKeywords = ['movie', 'film', 'cinema', 'scene', 'clip'];
    const comedyKeywords = ['funny', 'comedy', 'laugh', 'joke', 'meme'];
    const motivationKeywords = ['motivation', 'inspire', 'success', 'mindset', 'goals'];
    const trendingKeywords = ['trending', 'viral', 'trend', 'audio'];

    const urlLower = reelUrl.toLowerCase();
    const idLower = reelId.toLowerCase();
    const combined = urlLower + ' ' + idLower;

    if (movieKeywords.some(kw => combined.includes(kw))) return 'Movie';
    if (comedyKeywords.some(kw => combined.includes(kw))) return 'Comedy';
    if (motivationKeywords.some(kw => combined.includes(kw))) return 'Motivation';
    if (trendingKeywords.some(kw => combined.includes(kw))) return 'Trending Audio';

    return 'Other';
  }

  /**
   * Calculate growth rate over time
   */
  static calculateGrowthRate(reels) {
    if (reels.length < 2) return 0;

    const sortedReels = reels.sort((a, b) => new Date(a.scannedAt) - new Date(b.scannedAt));
    const oldestViews = sortedReels[0].viewCount;
    const newestViews = sortedReels[sortedReels.length - 1].viewCount;

    const growthRate = ((newestViews - oldestViews) / oldestViews) * 100;
    return Math.round(growthRate);
  }

  /**
   * Calculate consistency score
   */
  static calculateConsistencyScore(reels) {
    if (reels.length < 3) return 50; // Default for insufficient data

    const views = reels.map(r => r.viewCount);
    const avgViews = views.reduce((a, b) => a + b, 0) / views.length;
    
    const variance = views.reduce((sum, view) => sum + Math.pow(view - avgViews, 2), 0) / views.length;
    const stdDev = Math.sqrt(variance);
    const coefficientOfVariation = (stdDev / avgViews) * 100;

    // Lower CV = higher consistency
    if (coefficientOfVariation < 20) return 100;
    if (coefficientOfVariation < 40) return 80;
    if (coefficientOfVariation < 60) return 60;
    if (coefficientOfVariation < 80) return 40;
    return 20;
  }

  /**
   * Brand Match Score for agencies
   * Calculates suitability for brand collaborations
   */
  static calculateBrandMatchScore(analytics, targetAudience = 'general') {
    let score = 0;

    // Consistency (30 points)
    score += (analytics.consistencyScore / 100) * 30;

    // Viral Ratio (25 points)
    score += (analytics.viralRatio / 100) * 25;

    // Average Views (25 points)
    if (analytics.averageViews > 100000) score += 25;
    else if (analytics.averageViews > 50000) score += 20;
    else if (analytics.averageViews > 10000) score += 15;
    else score += 10;

    // Total Reels (20 points) - More content = more reliable
    if (analytics.totalReels > 50) score += 20;
    else if (analytics.totalReels > 20) score += 15;
    else if (analytics.totalReels > 10) score += 10;
    else score += 5;

    return Math.round(score);
  }

  /**
   * Pricing Recommendation for influencer collaborations
   */
  static recommendPricing(analytics) {
    const avgViews = analytics.averageViews;
    const qualityMultiplier = analytics.consistencyScore / 100;
    const viralBonus = analytics.viralRatio > 20 ? 1.5 : 1;

    // Base CPM (Cost Per Mille/Thousand views)
    let baseCPM = 5; // $5 per 1000 views

    if (avgViews > 100000) baseCPM = 10;
    else if (avgViews > 50000) baseCPM = 8;
    else if (avgViews > 10000) baseCPM = 6;

    const estimatedPrice = (avgViews / 1000) * baseCPM * qualityMultiplier * viralBonus;

    return {
      minPrice: Math.round(estimatedPrice * 0.8),
      maxPrice: Math.round(estimatedPrice * 1.2),
      recommendedPrice: Math.round(estimatedPrice),
      currency: 'USD',
      baseCPM
    };
  }
}

module.exports = AIEngine;