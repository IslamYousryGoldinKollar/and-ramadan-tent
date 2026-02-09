import { prisma } from './prisma'

export interface CreateRiddleEpisodeData {
  title: string
  description?: string
  videoUrl: string
  episodeNumber: number
}

export interface UpdateRiddleEpisodeData {
  title?: string
  description?: string
  videoUrl?: string
  episodeNumber?: number
}

export interface CreateQuestionData {
  episodeId: string
  questionText: string
  optionA: string
  optionB: string
  optionC: string
  correctAnswer: 'A' | 'B' | 'C'
}

export interface UpdateQuestionData {
  questionText?: string
  optionA?: string
  optionB?: string
  optionC?: string
  correctAnswer?: 'A' | 'B' | 'C'
}

export interface SubmitAnswersData {
  episodeId: string
  email: string
  idNumber: string
  phoneNumber: string
  answers: Array<{
    questionId: string
    selectedAnswer: 'A' | 'B' | 'C'
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
      videoUrl: data.videoUrl,
      episodeNumber: data.episodeNumber,
      isActive: true,
    },
    include: {
      questions: true,
    },
  })
}

/**
 * Update a riddle episode
 */
export async function updateRiddleEpisode(episodeId: string, data: UpdateRiddleEpisodeData) {
  return prisma.riddleEpisode.update({
    where: { id: episodeId },
    data,
    include: { questions: true },
  })
}

/**
 * Delete a riddle episode
 */
export async function deleteRiddleEpisode(episodeId: string) {
  return prisma.riddleEpisode.delete({
    where: { id: episodeId },
  })
}

/**
 * Toggle episode active status
 */
export async function toggleEpisodeStatus(episodeId: string) {
  const episode = await prisma.riddleEpisode.findUnique({ where: { id: episodeId } })
  if (!episode) throw new Error('Episode not found')
  return prisma.riddleEpisode.update({
    where: { id: episodeId },
    data: { isActive: !episode.isActive },
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
      correctAnswer: data.correctAnswer,
    },
  })
}

/**
 * Update a question
 */
export async function updateQuestion(questionId: string, data: UpdateQuestionData) {
  return prisma.riddleQuestion.update({
    where: { id: questionId },
    data,
  })
}

/**
 * Delete a question
 */
export async function deleteQuestion(questionId: string) {
  return prisma.riddleQuestion.delete({
    where: { id: questionId },
  })
}

/**
 * Get all episodes (admin — includes inactive)
 */
export async function getAllEpisodes() {
  return prisma.riddleEpisode.findMany({
    orderBy: { episodeNumber: 'desc' },
    include: {
      questions: { orderBy: { createdAt: 'asc' } },
      _count: { select: { answers: true } },
    },
  })
}

/**
 * Get all active episodes (public)
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
      _count: { select: { answers: true } },
    },
  })
}

/**
 * Get episode stats (answer counts, correct rates)
 */
export async function getEpisodeStats(episodeId: string) {
  const [episode, totalAnswers, correctAnswers] = await Promise.all([
    prisma.riddleEpisode.findUnique({
      where: { id: episodeId },
      include: { questions: true, _count: { select: { answers: true, raffleWinners: true } } },
    }),
    prisma.riddleAnswer.count({ where: { episodeId } }),
    prisma.riddleAnswer.count({ where: { episodeId, isCorrect: true } }),
  ])

  if (!episode) throw new Error('Episode not found')

  const totalQuestions = episode.questions.length
  const uniqueSubmitters = totalQuestions > 0
    ? Math.floor(totalAnswers / totalQuestions)
    : 0

  return {
    totalQuestions,
    totalAnswers,
    correctAnswers,
    correctRate: totalAnswers > 0 ? Math.round((correctAnswers / totalAnswers) * 100) : 0,
    uniqueSubmitters,
    winnersCount: episode._count.raffleWinners,
  }
}

/**
 * Submit answers for an episode
 */
export async function submitRiddleAnswers(data: SubmitAnswersData) {
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
      email: data.email,
      idNumber: data.idNumber,
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
          email: data.email,
          idNumber: data.idNumber,
          phoneNumber: data.phoneNumber,
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

  const allAnswers = await prisma.riddleAnswer.findMany({
    where: { episodeId },
  })

  // Group by user (idNumber + email)
  const answersByUser = new Map<string, typeof allAnswers>()
  for (const answer of allAnswers) {
    const key = `${answer.idNumber}-${answer.email}`
    if (!answersByUser.has(key)) {
      answersByUser.set(key, [])
    }
    answersByUser.get(key)!.push(answer)
  }

  const correctAnswerers: Array<{
    email: string
    idNumber: string
    phoneNumber: string
    correctCount: number
    totalQuestions: number
  }> = []

  for (const [, answers] of answersByUser.entries()) {
    const correctCount = answers.filter((a) => a.isCorrect).length
    if (correctCount === totalQuestions) {
      const firstAnswer = answers[0]
      correctAnswerers.push({
        email: firstAnswer.email,
        idNumber: firstAnswer.idNumber,
        phoneNumber: firstAnswer.phoneNumber,
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

  const winnerRecords = await Promise.all(
    winners.map((winner) =>
      prisma.raffleWinner.create({
        data: {
          episodeId,
          email: winner.email,
          idNumber: winner.idNumber,
          phoneNumber: winner.phoneNumber,
        },
      })
    )
  )

  return winnerRecords
}

/**
 * Clear raffle winners for re-running
 */
export async function clearRaffleWinners(episodeId: string) {
  await prisma.raffleWinner.deleteMany({ where: { episodeId } })
  await prisma.raffleSettings.upsert({
    where: { episodeId },
    create: { episodeId, numberOfWinners: 0, isActive: false },
    update: { isActive: false, raffleDate: null },
  })
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
