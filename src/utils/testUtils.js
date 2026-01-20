export const COMPANY_JOB_TYPES = [
  'Frontend Developer',
  'Backend Engineer',
  'Fullstack Developer',
  'UI/UX Designer',
  'Mobile Developer',
  'DevOps Engineer',
  'QA Engineer',
  'Data Analyst',
  'Product Manager',
  'Cybersecurity',
]

export const TEST_DURATION_SECONDS = 60 * 60

const shuffleArray = (items) => [...items].sort(() => Math.random() - 0.5)

const buildOptions = (jobType) => {
  const correct = `Break the ${jobType} task into clear steps, validate assumptions, and deliver measurable outcomes.`
  const wrongOne = 'Skip planning and jump directly into execution without alignment.'
  const wrongTwo = 'Wait for perfect information before taking any action.'
  const options = shuffleArray([correct, wrongOne, wrongTwo])
  const correctIndex = options.indexOf(correct)
  return { options, correctIndex }
}

const buildQuestion = (prompt, jobType) => {
  const { options, correctIndex } = buildOptions(jobType)
  return {
    id: `q-${Math.random().toString(36).slice(2, 10)}`,
    prompt,
    options,
    correctIndex,
  }
}

export const generateAiQuestions = (jobType, companyLabel) => {
  const pool = [
    `Explain how you would scope and deliver a ${jobType} project under a tight deadline.`,
    `Describe a complex bug you might encounter as a ${jobType} and how you would debug it.`,
    `What performance metrics matter most for a ${jobType}, and how do you improve them?`,
    `How would you document your work so that another ${jobType} can continue it?`,
    `Provide a step-by-step plan to validate quality for a ${jobType} deliverable.`,
    `Explain how you prioritize tasks when multiple stakeholders request ${jobType} changes.`,
    `What trade-offs would you make between speed, quality, and scalability as a ${jobType}?`,
    `Describe how you collaborate with design and product as a ${jobType}.`,
    `What security considerations are important for a ${jobType} role?`,
    `Outline your approach to testing and automation in a ${jobType} workflow.`,
    `How do you measure success for a ${jobType} initiative?`,
    `Give an example of refactoring you would perform to improve maintainability.`,
    `How would you handle technical debt in a ${jobType} team?`,
    `Describe a time you improved user experience or system reliability in a ${jobType} project.`,
    `What tools or frameworks would you select for a ${jobType} assignment and why?`,
    `What would your first 30 days look like in a ${jobType} role at ${companyLabel}?`,
    `How do you keep stakeholders updated on progress and risks as a ${jobType}?`,
    `Describe how you would mentor a junior teammate as a ${jobType}.`,
  ]

  return shuffleArray(pool).slice(0, 15).map((prompt) => buildQuestion(prompt, jobType))
}

export const parseManualQuestions = (raw) =>
  raw
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.split('|').map((part) => part.trim()))
    .map((parts) => {
      if (parts.length < 5) {
        return null
      }
      const [prompt, optionA, optionB, optionC, correctToken] = parts
      const options = [optionA, optionB, optionC]
      const normalized = correctToken.toLowerCase()
      const correctIndex = ['a', 'b', 'c'].includes(normalized)
        ? ['a', 'b', 'c'].indexOf(normalized)
        : Math.max(0, Math.min(2, Number.parseInt(correctToken, 10) - 1 || 0))

      return {
        id: `q-${Math.random().toString(36).slice(2, 10)}`,
        prompt,
        options,
        correctIndex,
      }
    })
    .filter(Boolean)

export const generateQuestionSets = (jobType, companyLabel) =>
  Array.from({ length: 10 }, () => generateAiQuestions(jobType, companyLabel))

export const generateManualQuestionSets = (questions) =>
  Array.from({ length: 10 }, () => shuffleArray([...questions]))
