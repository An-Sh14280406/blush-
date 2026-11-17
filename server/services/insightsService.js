/**
 * Rules-Based Personal Wellness & Mood Insights Engine
 *
 * Strict Ethical & Clinical Guidelines:
 * - Always includes exact supporting observation counts.
 * - Only generates insights when verified logs exist (no speculative statements).
 * - Never infers consent, attraction, sexual availability, romantic intentions,
 *   or emotional stereotypes from cycle phase alone.
 */

function generatePersonalInsights({ moodLogs = [], symptomLogs = [], wellnessLogs = [], periods = [] }) {
  const insights = [];

  if (!moodLogs.length && !symptomLogs.length && !wellnessLogs.length) {
    return [
      {
        id: 'welcome-seed',
        category: 'Getting Started',
        title: 'Building Your Wellness Story',
        message: 'As you log your daily moods and physical feelings, blush. will discover gentle personal patterns for you.',
        supportingCount: 0,
        type: 'info',
        tag: '🌸 Welcome',
      },
    ];
  }

  // 1. Mood Frequency & Repetition Analysis
  const moodCounts = {};
  moodLogs.forEach((log) => {
    (log.moods || []).forEach((m) => {
      moodCounts[m] = (moodCounts[m] || 0) + 1;
    });
  });

  // Check affectionate / playful / romantic moods (strictly self-reported count without speculation)
  ['Affectionate', 'Playful', 'Romantic', 'Happy', 'Calm', 'Confident'].forEach((mood) => {
    const count = moodCounts[mood];
    if (count && count >= 2) {
      insights.push({
        id: `mood-freq-${mood.toLowerCase()}`,
        category: 'Emotional Reflection',
        title: `Self-Reported ${mood} Days`,
        message: `You recorded feeling ${mood.toLowerCase()} on ${count} recorded day${count > 1 ? 's' : ''} in your journal history.`,
        supportingCount: count,
        type: 'positive',
        tag: '♡ Feelings',
      });
    }
  });

  // Check stress / anxious / overwhelmed
  ['Stressed', 'Anxious', 'Overwhelmed', 'Emotionally sensitive'].forEach((mood) => {
    const count = moodCounts[mood];
    if (count && count >= 2) {
      insights.push({
        id: `mood-sens-${mood.toLowerCase()}`,
        category: 'Gentle Support',
        title: `Taking Care on ${mood} Days`,
        message: `You logged feeling ${mood.toLowerCase()} on ${count} occasion${count > 1 ? 's' : ''}. Remember to give yourself patience and restful space during these moments.`,
        supportingCount: count,
        type: 'gentle',
        tag: '🌿 Self-Care',
      });
    }
  });

  // 2. Physical Symptom Correlation
  const symptomCounts = {};
  symptomLogs.forEach((log) => {
    (log.symptoms || []).forEach((s) => {
      const name = typeof s === 'string' ? s : s.name;
      symptomCounts[name] = (symptomCounts[name] || 0) + 1;
    });
  });

  Object.entries(symptomCounts).forEach(([symptom, count]) => {
    if (count >= 2) {
      insights.push({
        id: `symptom-${symptom.toLowerCase().replace(/\s+/g, '-')}`,
        category: 'Physical Body',
        title: `${symptom} Observations`,
        message: `You have noted ${symptom.toLowerCase()} across ${count} separate check-in${count > 1 ? 's' : ''}. Tracking this helps you anticipate when your body asks for comfort.`,
        supportingCount: count,
        type: 'neutral',
        tag: '✨ Physical',
      });
    }
  });

  // 3. Energy & Sleep Analysis
  let lowEnergyCount = 0;
  let highEnergyCount = 0;
  wellnessLogs.forEach((w) => {
    if (w.energy === 'low' || w.energy === 'very_low') lowEnergyCount++;
    if (w.energy === 'high' || w.energy === 'very_high') highEnergyCount++;
  });

  if (lowEnergyCount >= 2) {
    insights.push({
      id: 'energy-low-pattern',
      category: 'Energy Rhythm',
      title: 'Rest & Recovery Days',
      message: `You reported low energy on ${lowEnergyCount} recorded check-ins. Honoring lower-battery days is an essential part of cyclic wellness.`,
      supportingCount: lowEnergyCount,
      type: 'gentle',
      tag: '🌙 Energy',
    });
  }

  if (highEnergyCount >= 2) {
    insights.push({
      id: 'energy-high-pattern',
      category: 'Vibrant Rhythm',
      title: 'High Vitality Days',
      message: `You noted high or very high energy across ${highEnergyCount} recorded days!`,
      supportingCount: highEnergyCount,
      type: 'positive',
      tag: '⚡ Vitality',
    });
  }

  // 4. Sleep duration average
  const validSleepHours = wellnessLogs.map((w) => w.sleepHours).filter((h) => typeof h === 'number' && h > 0);
  if (validSleepHours.length >= 3) {
    const avgSleep = Math.round((validSleepHours.reduce((a, b) => a + b, 0) / validSleepHours.length) * 10) / 10;
    insights.push({
      id: 'sleep-average',
      category: 'Rest Quality',
      title: 'Sleep Average',
      message: `Across ${validSleepHours.length} recorded nights, your average sleep duration is ${avgSleep} hours.`,
      supportingCount: validSleepHours.length,
      type: 'neutral',
      tag: '☁️ Sleep',
    });
  }

  // Return top prioritized insights
  return insights.slice(0, 8);
}

module.exports = {
  generatePersonalInsights,
};
