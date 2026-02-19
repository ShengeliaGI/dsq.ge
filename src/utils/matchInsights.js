const STOPWORDS = new Set([
  'the',
  'and',
  'for',
  'with',
  'from',
  'that',
  'this',
  'your',
  'you',
  'are',
  'not',
  'have',
  'has',
  'will',
  'job',
  'role',
  'work',
  'team',
  'full',
  'time',
  'part',
  'remote',
  'onsite',
  'hybrid',
  'experience',
  'required',
  'preferred',
])

const tokenize = (value) =>
  (value || '')
    .toLowerCase()
    .split(/[^a-z0-9+#.]+/g)
    .map((token) => token.trim())
    .filter((token) => token.length > 2 && !STOPWORDS.has(token))

const clamp = (value, min, max) => Math.max(min, Math.min(max, value))

const toPercent = (value) => Math.round(clamp(value, 0, 1) * 100)

export const buildMatchInsight = ({
  vacancy,
  currentUserEmail,
  cvSubmissions = [],
  applications = [],
  getStatusLabel,
  t,
}) => {
  if (!vacancy || !currentUserEmail) {
    return null
  }

  const normalizedEmail = currentUserEmail.toLowerCase()
  const latestCv = cvSubmissions
    .filter(
      (cv) =>
        cv?.createdBy?.email?.toLowerCase() === normalizedEmail ||
        cv?.personalInfo?.toLowerCase().includes(normalizedEmail),
    )
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))[0]

  const sections = latestCv
    ? [
        latestCv.personalInfo,
        latestCv.workExperience,
        latestCv.education,
        latestCv.languages,
        latestCv.skills,
        latestCv.certificates,
        latestCv.trainings,
        latestCv.socialNetworks,
      ]
    : []
  const completedSections = sections.filter((section) => section?.trim()).length
  const completenessRatio = sections.length ? completedSections / sections.length : 0

  const vacancyTokens = new Set(
    tokenize(
      [vacancy.title, vacancy.descriptionTitle, vacancy.description, vacancy.type].join(' '),
    ),
  )
  const candidateTokens = new Set(
    tokenize(
      latestCv
        ? [
            latestCv.summary,
            latestCv.personalInfo,
            latestCv.workExperience,
            latestCv.education,
            latestCv.languages,
            latestCv.skills,
            latestCv.certificates,
            latestCv.trainings,
          ].join(' ')
        : '',
    ),
  )

  const overlaps = [...vacancyTokens].filter((token) => candidateTokens.has(token))
  const overlapRatio =
    vacancyTokens.size > 0 ? overlaps.length / vacancyTokens.size : 0

  const userApplications = applications.filter(
    (entry) => entry?.id && entry?.jobId && entry?.score >= 0,
  )
  const avgScoreRatio = userApplications.length
    ? userApplications.reduce(
        (sum, entry) => sum + entry.score / Math.max(entry.total || 1, 1),
        0,
      ) / userApplications.length
    : 0.5

  const completenessPoints = Math.round(completenessRatio * 35)
  const overlapPoints = Math.round(overlapRatio * 40)
  const performancePoints = Math.round(avgScoreRatio * 25)
  const score = clamp(completenessPoints + overlapPoints + performancePoints, 0, 100)

  const currentApplication = applications.find((entry) => entry.jobId === vacancy.id)
  const tips = []

  if (!latestCv) {
    tips.push(t('matchInsight.tipNoCv'))
  }
  if (completenessRatio < 0.6) {
    tips.push(t('matchInsight.tipCompleteness'))
  }
  if (overlapRatio < 0.25) {
    tips.push(t('matchInsight.tipKeywords'))
  }
  if (avgScoreRatio < 0.65) {
    tips.push(t('matchInsight.tipTests'))
  }
  if (!currentApplication) {
    tips.push(t('matchInsight.tipApplyEarly'))
  }
  if (tips.length === 0) {
    tips.push(t('matchInsight.tipStrong'))
  }

  const fitLevel =
    score >= 80
      ? t('matchInsight.levelStrong')
      : score >= 60
        ? t('matchInsight.levelPromising')
        : t('matchInsight.levelImprove')

  return {
    score,
    fitLevel,
    highlights: overlaps.slice(0, 6),
    tips: tips.slice(0, 4),
    breakdown: [
      {
        label: t('matchInsight.breakdownCompleteness'),
        value: toPercent(completenessRatio),
        points: completenessPoints,
      },
      {
        label: t('matchInsight.breakdownOverlap'),
        value: toPercent(overlapRatio),
        points: overlapPoints,
      },
      {
        label: t('matchInsight.breakdownTests'),
        value: toPercent(avgScoreRatio),
        points: performancePoints,
      },
    ],
    applicationStatus: currentApplication
      ? getStatusLabel?.(currentApplication.status) || currentApplication.status
      : null,
  }
}
