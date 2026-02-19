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

const buildUserCvCorpus = (cvSubmissions, currentUserEmail) => {
  if (!currentUserEmail) {
    return ''
  }

  const normalizedEmail = currentUserEmail.toLowerCase()
  const userCvs = (cvSubmissions ?? []).filter(
    (cv) =>
      cv?.createdBy?.email?.toLowerCase() === normalizedEmail ||
      cv?.personalInfo?.toLowerCase().includes(normalizedEmail),
  )

  if (userCvs.length === 0) {
    return ''
  }

  return userCvs
    .map((cv) =>
      [
        cv.summary,
        cv.personalInfo,
        cv.workExperience,
        cv.education,
        cv.languages,
        cv.skills,
        cv.certificates,
        cv.trainings,
      ].join(' '),
    )
    .join(' ')
}

export const hasUserCv = (cvSubmissions, currentUserEmail) =>
  Boolean(buildUserCvCorpus(cvSubmissions, currentUserEmail))

export const matchesVacancyByCv = ({
  vacancy,
  cvSubmissions,
  currentUserEmail,
}) => {
  const cvCorpus = buildUserCvCorpus(cvSubmissions, currentUserEmail)
  if (!cvCorpus) {
    return false
  }

  const vacancyTokens = new Set(
    tokenize(
      [vacancy?.title, vacancy?.descriptionTitle, vacancy?.description, vacancy?.type].join(' '),
    ),
  )
  const cvTokens = new Set(tokenize(cvCorpus))

  if (vacancyTokens.size === 0 || cvTokens.size === 0) {
    return false
  }

  const overlapCount = [...vacancyTokens].filter((token) => cvTokens.has(token)).length
  const overlapRatio = overlapCount / vacancyTokens.size

  return overlapCount >= 2 || overlapRatio >= 0.15
}
