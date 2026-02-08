import { prisma } from './prisma'

export interface CreateRiddleEpisodeData {
  title: string
  description?: string
  youtubeUrl: string
  episodeNumber: number
}

export interface CreateQuestionData {
  episodeId: string
  questionText: string
  optionA: string
  optionB: string
  optionC: string
  optionD: string
  correctAnswer: 'A' | 'B' | 'C' | 'D'
}

export interface SubmitAnswersData {
  episodeId: string
  employeeId: string
  employeeName: string
  email: string
  answers: Array<{
    questionId: string
    selectedAnswer: 'A' | 'B' | 'C' | 'D'
  }>
}

/**
 * Create a new riddle episode
 */
export async function createRiddleEpisode(data: CreateRiddleEpisodeData) {
  return prisma.riddleEpisode.create({
    data: {
      title: data.title,
      description: data.description,
      youtubeUrl: data.youtubeUrl,
      episodeNumber: data.episodeNumber,
      isActive: true,
    },
    include: {
      questions: true,
    },
  })
}

/**
 * Add a question to an episode
 */
export async function addQuestionToEpisode(data: CreateQuestionData) {
  return prisma.riddleQuestion.create({
    data: {
      episodeId: data.episodeId,
      questionText: data.questionText,
      optionA: data.optionA,
      optionB: data.optionB,
      optionC: data.optionC,
      optionD: data.optionD,
      correctAnswer: data.correctAnswer,
    },
  })
}

/**
 * Get all active episodes
 */
export async function getActiveEpisodes() {
  return prisma.riddleEpisode.findMany({
    where: { isActive: true },
    orderBy: { episodeNumber: 'desc' },
    include: {
      questions: {
        orderBy: { createdAt: 'asc' },
      },
    },
  })
}

/**
 * Get episode by ID with questions
 */
export async function getEpisodeById(episodeId: string) {
  return prisma.riddleEpisode.findUnique({
    where: { id: episodeId },
    include: {
      questions: {
        orderBy: { createdAt: 'asc' },
      },
    },
  })
}

/**
 * Submit answers for an episode
 */
export async function submitRiddleAnswers(data: SubmitAnswersData) {
  // Get episode and questions to verify answers
  const episode = await prisma.riddleEpisode.findUnique({
    where: { id: data.episodeId },
    include: { questions: true },
  })

  if (!episode) {
    throw new Error('Episode not found')
  }

  if (!episode.isActive) {
    throw new Error('Episode is not active')
  }

  // Check if user already submitted answers for this episode
  const existingAnswers = await prisma.riddleAnswer.findFirst({
    where: {
      episodeId: data.episodeId,
      employeeId: data.employeeId,
      email: data.email,
    },
  })

  if (existingAnswers) {
    throw new Error('You have already submitted answers for this episode')
  }

  // Create answer records and calculate correctness
  const answerRecords = await Promise.all(
    data.answers.map(async (answer) => {
      const question = episode.questions.find((q) => q.id === answer.questionId)
      if (!question) {
        throw new Error(`Question ${answer.questionId} not found`)
      }

      const isCorrect = question.correctAnswer === answer.selectedAnswer

      return prisma.riddleAnswer.create({
        data: {
          episodeId: data.episodeId,
          questionId: answer.questionId,
          employeeId: data.employeeId,
          employeeName: data.employeeName,
          email: data.email,
          selectedAnswer: answer.selectedAnswer,
          isCorrect,
        },
      })
    })
  )

  return answerRecords
}

/**
 * Get all answers for an episode (admin only)
 */
export async function getEpisodeAnswers(episodeId: string) {
  return prisma.riddleAnswer.findMany({
    where: { episodeId },
    include: {
      question: true,
    },
    orderBy: { submittedAt: 'desc' },
  })
}

/**
 * Get users who answered all questions correctly
 */
export async function getCorrectAnswerers(episodeId: string) {
  const episode = await prisma.riddleEpisode.findUnique({
    where: { id: episodeId },
    include: { questions: true },
  })

  if (!episode) {
    throw new Error('Episode not found')
  }

  const totalQuestions = episode.questions.length
  if (totalQuestions === 0) {
    return []
  }

  // Get all answers grouped by employee
  const allAnswers = await prisma.riddleAnswer.findMany({
    where: { episodeId },
  })

  // Group by employee
  const answersByEmployee = new Map<string, typeof allAnswers>()
  for (const answer of allAnswers) {
    const key = `${answer.employeeId}-${answer.email}`
    if (!answersByEmployee.has(key)) {
      answersByEmployee.set(key, [])
    }
    answersByEmployee.get(key)!.push(answer)
  }

  // Find employees who answered all questions correctly
  const correctAnswerers: Array<{
    employeeId: string
    employeeName: string
    email: string
    correctCount: number
    totalQuestions: number
  }> = []

  for (const [key, answers] of answersByEmployee.entries()) {
    const correctCount = answers.filter((a) => a.isCorrect).length
    if (correctCount === totalQuestions) {
      const firstAnswer = answers[0]
      correctAnswerers.push({
        employeeId: firstAnswer.employeeId,
        employeeName: firstAnswer.employeeName,
        email: firstAnswer.email,
        correctCount,
        totalQuestions,
      })
    }
  }

  return correctAnswerers
}

/**
 * Run raffle for an episode
 */
export async function runRaffle(episodeId: string, numberOfWinners: number) {
  const correctAnswerers = await getCorrectAnswerers(episodeId)

  if (correctAnswerers.length === 0) {
    throw new Error('No correct answerers found')
  }

  if (numberOfWinners > correctAnswerers.length) {
    throw new Error(
      `Cannot select ${numberOfWinners} winners from ${correctAnswerers.length} correct answerers`
    )
  }

  // Random selection using Fisher-Yates shuffle
  const shuffled = [...correctAnswerers]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }

  const winners = shuffled.slice(0, numberOfWinners)

  // Create raffle settings if not exists
  await prisma.raffleSettings.upsert({
    where: { episodeId },
    create: {
      episodeId,
      numberOfWinners,
      isActive: true,
      raffleDate: new Date(),
    },
    update: {
      numberOfWinners,
      isActive: true,
      raffleDate: new Date(),
    },
  })

  // Create winner records
  const winnerRecords = await Promise.all(
    winners.map((winner) =>
      prisma.raffleWinner.create({
        data: {
          episodeId,
          employeeId: winner.employeeId,
          employeeName: winner.employeeName,
          email: winner.email,
        },
      })
    )
  )

  return winnerRecords
}

/**
 * Get raffle winners for an episode
 */
export async function getRaffleWinners(episodeId: string) {
  return prisma.raffleWinner.findMany({
    where: { episodeId },
    orderBy: { createdAt: 'asc' },
  })
}

/**
 * Get raffle settings for an episode
 */
export async function getRaffleSettings(episodeId: string) {
  return prisma.raffleSettings.findUnique({
    where: { episodeId },
  })
}
