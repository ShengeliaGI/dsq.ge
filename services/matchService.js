// MVP-friendly, scalable match system for candidate-vacancy skill matching

/**
 * Normalize an array of skills: lowercase, trimmed, unique
 * @param {string[]} skillsArray
 * @returns {string[]}
 */
export function normalizeSkills(skillsArray) {
  if (!Array.isArray(skillsArray)) return [];
  const normalized = skillsArray
    .map(skill => skill.toLowerCase().trim())
    .filter(skill => skill.length > 0);
  return Array.from(new Set(normalized));
}

/**
 * Calculate match score between candidate and vacancy skills
 * @param {string[]} candidateSkills
 * @param {string[]} requiredSkills
 * @returns {number|null} Whole number percentage or null if vacancy has no required skills
 */
export function calculateMatchScore(candidateSkills, requiredSkills) {
  const normCandidate = normalizeSkills(candidateSkills);
  const normRequired = normalizeSkills(requiredSkills);
  if (normRequired.length === 0) return null;
  const matched = normRequired.filter(skill => normCandidate.includes(skill));
  const score = (matched.length / normRequired.length) * 100;
  return Math.round(score);
}