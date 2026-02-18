import { db, generateId, toPlainObject, docsToArray } from './db'

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

async function getQuestionsForEpisode(episodeId: string, includeCorrectAnswers: boolean = true) {
  const snap = await db.collection('riddleQuestions')
    .where('episodeId', '==', episodeId)
    .orderBy('createdAt', 'asc')
    .get()
  const questions = docsToArray(snap) as any[]

  if (includeCorrectAnswers) {
    return questions
  }

  return questions.map((question) => {
    const sanitizedQuestion = { ...question }
    delete (sanitizedQuestion as any).correctAnswer
    return sanitizedQuestion
  })
}

async function getAnswerCountForEpisode(episodeId: string) {
  const snap = await db.collection('riddleAnswers')
    .where('episodeId', '==', episodeId)
    .get()
  return snap.size
}

/**
 * Create a new riddle episode
 */
export async function createRiddleEpisode(data: CreateRiddleEpisodeData) {
  const id = generateId()
  const now = new Date()
  const episodeData = {
    title: data.title,
    description: data.description || null,
    videoUrl: data.videoUrl,
    episodeNumber: data.episodeNumber,
    isActive: true,
    createdAt: now,
    updatedAt: now,
  }
  await db.collection('riddleEpisodes').doc(id).set(episodeData)
  return { id, ...episodeData, questions: [] }
}

/**
 * Update a riddle episode
 */
export async function updateRiddleEpisode(episodeId: string, data: UpdateRiddleEpisodeData) {
  await db.collection('riddleEpisodes').doc(episodeId).update({ ...data, updatedAt: new Date() })
  const doc = await db.collection('riddleEpisodes').doc(episodeId).get()
  const episode = toPlainObject(doc)
  const questions = await getQuestionsForEpisode(episodeId)
  return { ...episode, questions }
}

/**
 * Delete a riddle episode (and cascade)
 */
export async function deleteRiddleEpisode(episodeId: string) {
  const batch = db.batch()
  // Delete questions
  const qSnap = await db.collection('riddleQuestions').where('episodeId', '==', episodeId).get()
  qSnap.docs.forEach((d) => batch.delete(d.ref))
  // Delete answers
  const aSnap = await db.collection('riddleAnswers').where('episodeId', '==', episodeId).get()
  aSnap.docs.forEach((d) => batch.delete(d.ref))
  // Delete raffle winners
  const wSnap = await db.collection('raffleWinners').where('episodeId', '==', episodeId).get()
  wSnap.docs.forEach((d) => batch.delete(d.ref))
  // Delete raffle settings
  const sSnap = await db.collection('raffleSettings').where('episodeId', '==', episodeId).get()
  sSnap.docs.forEach((d) => batch.delete(d.ref))
  // Delete episode
  batch.delete(db.collection('riddleEpisodes').doc(episodeId))
  await batch.commit()
}

/**
 * Toggle episode active status
 */
export async function toggleEpisodeStatus(episodeId: string) {
  const doc = await db.collection('riddleEpisodes').doc(episodeId).get()
  if (!doc.exists) throw new Error('Episode not found')
  const episode = toPlainObject<any>(doc)!
  await db.collection('riddleEpisodes').doc(episodeId).update({
    isActive: !episode.isActive,
    updatedAt: new Date(),
  })
  return { ...episode, isActive: !episode.isActive }
}

/**
 * Add a question to an episode
 */
export async function addQuestionToEpisode(data: CreateQuestionData) {
  const id = generateId()
  const questionData = {
    episodeId: data.episodeId,
    questionText: data.questionText,
    optionA: data.optionA,
    optionB: data.optionB,
    optionC: data.optionC,
    correctAnswer: data.correctAnswer,
    createdAt: new Date(),
  }
  await db.collection('riddleQuestions').doc(id).set(questionData)
  return { id, ...questionData }
}

/**
 * Update a question
 */
export async function updateQuestion(questionId: string, data: UpdateQuestionData) {
  await db.collection('riddleQuestions').doc(questionId).update({ ...data })
  const doc = await db.collection('riddleQuestions').doc(questionId).get()
  return toPlainObject(doc)
}

/**
 * Delete a question
 */
export async function deleteQuestion(questionId: string) {
  // Also delete related answers
  const aSnap = await db.collection('riddleAnswers').where('questionId', '==', questionId).get()
  const batch = db.batch()
  aSnap.docs.forEach((d) => batch.delete(d.ref))
  batch.delete(db.collection('riddleQuestions').doc(questionId))
  await batch.commit()
}

/**
 * Get all episodes (admin — includes inactive)
 */
export async function getAllEpisodes() {
  const snap = await db.collection('riddleEpisodes').orderBy('episodeNumber', 'desc').get()
  const episodes = docsToArray(snap)

  // Enrich with questions and answer counts
  return Promise.all(
    episodes.map(async (ep: any) => {
      const questions = await getQuestionsForEpisode(ep.id)
      const answerCount = await getAnswerCountForEpisode(ep.id)
      return { ...ep, questions, _count: { answers: answerCount } }
    })
  )
}

/**
 * Get all active episodes (public)
 */
export async function getActiveEpisodes() {
  const snap = await db.collection('riddleEpisodes')
    .where('isActive', '==', true)
    .orderBy('episodeNumber', 'desc')
    .get()
  const episodes = docsToArray(snap)

  return Promise.all(
    episodes.map(async (ep: any) => {
      const questions = await getQuestionsForEpisode(ep.id, false)
      return { ...ep, questions }
    })
  )
}

/**
 * Get episode by ID with questions
 */
export async function getEpisodeById(
  episodeId: string,
  options?: { includeCorrectAnswers?: boolean }
) {
  const doc = await db.collection('riddleEpisodes').doc(episodeId).get()
  if (!doc.exists) return null
  const episode = toPlainObject(doc)
  const questions = await getQuestionsForEpisode(episodeId, options?.includeCorrectAnswers ?? false)
  const answerCount = await getAnswerCountForEpisode(episodeId)
  return { ...episode, questions, _count: { answers: answerCount } }
}

/**
 * Get episode stats
 */
export async function getEpisodeStats(episodeId: string) {
  const episode = await getEpisodeById(episodeId)
  if (!episode) throw new Error('Episode not found')

  const allAnswers = await db.collection('riddleAnswers').where('episodeId', '==', episodeId).get()
  const correctAnswers = allAnswers.docs.filter((d) => d.data().isCorrect).length
  const totalAnswers = allAnswers.size

  const winnersSnap = await db.collection('raffleWinners').where('episodeId', '==', episodeId).get()

  const totalQuestions = (episode as any).questions.length
  const uniqueSubmitters = totalQuestions > 0 ? Math.floor(totalAnswers / totalQuestions) : 0

  return {
    totalQuestions,
    totalAnswers,
    correctAnswers,
    correctRate: totalAnswers > 0 ? Math.round((correctAnswers / totalAnswers) * 100) : 0,
    uniqueSubmitters,
    winnersCount: winnersSnap.size,
  }
}

/**
 * Submit answers for an episode
 */
export async function submitRiddleAnswers(data: SubmitAnswersData) {
  const episode = await getEpisodeById(data.episodeId, { includeCorrectAnswers: true })
  if (!episode) throw new Error('Episode not found')
  if (!(episode as any).isActive) throw new Error('Episode is not active')

  // Check if user already submitted
  const existingSnap = await db.collection('riddleAnswers')
    .where('episodeId', '==', data.episodeId)
    .where('email', '==', data.email)
    .where('idNumber', '==', data.idNumber)
    .limit(1)
    .get()

  if (!existingSnap.empty) {
    throw new Error('You have already submitted answers for this episode')
  }

  const questions = (episode as any).questions
  const answerRecords = await Promise.all(
    data.answers.map(async (answer) => {
      const question = questions.find((q: any) => q.id === answer.questionId)
      if (!question) throw new Error(`Question ${answer.questionId} not found`)

      const isCorrect = question.correctAnswer === answer.selectedAnswer
      const id = generateId()
      const answerData = {
        episodeId: data.episodeId,
        questionId: answer.questionId,
        email: data.email,
        idNumber: data.idNumber,
        phoneNumber: data.phoneNumber,
        selectedAnswer: answer.selectedAnswer,
        isCorrect,
        submittedAt: new Date(),
      }
      await db.collection('riddleAnswers').doc(id).set(answerData)
      return { id, ...answerData }
    })
  )

  return answerRecords
}

/**
 * Get all answers for an episode (admin only)
 */
export async function getEpisodeAnswers(episodeId: string) {
  const snap = await db.collection('riddleAnswers')
    .where('episodeId', '==', episodeId)
    .orderBy('submittedAt', 'desc')
    .get()
  const answers = docsToArray(snap)

  // Enrich with question data
  const questionIds = [...new Set(answers.map((a: any) => a.questionId))]
  const questionMap: Record<string, any> = {}
  for (const qid of questionIds) {
    const qDoc = await db.collection('riddleQuestions').doc(qid).get()
    if (qDoc.exists) questionMap[qid] = toPlainObject(qDoc)
  }

  return answers.map((a: any) => ({
    ...a,
    question: questionMap[a.questionId] || null,
  }))
}

/**
 * Get users who answered all questions correctly
 */
export async function getCorrectAnswerers(episodeId: string) {
  const questions = await getQuestionsForEpisode(episodeId)
  const totalQuestions = questions.length
  if (totalQuestions === 0) return []

  const snap = await db.collection('riddleAnswers')
    .where('episodeId', '==', episodeId)
    .get()
  const allAnswers = docsToArray(snap)

  const answersByUser = new Map<string, any[]>()
  for (const answer of allAnswers as any[]) {
    const key = `${answer.idNumber}-${answer.email}`
    if (!answersByUser.has(key)) answersByUser.set(key, [])
    answersByUser.get(key)!.push(answer)
  }

  const correctAnswerers: Array<{
    email: string; idNumber: string; phoneNumber: string
    correctCount: number; totalQuestions: number
  }> = []

  for (const [, answers] of answersByUser.entries()) {
    const correctCount = answers.filter((a: any) => a.isCorrect).length
    if (correctCount === totalQuestions) {
      correctAnswerers.push({
        email: answers[0].email,
        idNumber: answers[0].idNumber,
        phoneNumber: answers[0].phoneNumber,
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
  if (correctAnswerers.length === 0) throw new Error('No correct answerers found')
  if (numberOfWinners > correctAnswerers.length) {
    throw new Error(`Cannot select ${numberOfWinners} winners from ${correctAnswerers.length} correct answerers`)
  }

  const shuffled = [...correctAnswerers]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  const winners = shuffled.slice(0, numberOfWinners)

  // Upsert raffle settings
  const settingsSnap = await db.collection('raffleSettings')
    .where('episodeId', '==', episodeId)
    .limit(1)
    .get()

  if (settingsSnap.empty) {
    await db.collection('raffleSettings').doc(generateId()).set({
      episodeId, numberOfWinners, isActive: true, raffleDate: new Date(),
      createdAt: new Date(), updatedAt: new Date(),
    })
  } else {
    await settingsSnap.docs[0].ref.update({
      numberOfWinners, isActive: true, raffleDate: new Date(), updatedAt: new Date(),
    })
  }

  const winnerRecords = await Promise.all(
    winners.map(async (winner) => {
      const id = generateId()
      const data = {
        episodeId, email: winner.email, idNumber: winner.idNumber,
        phoneNumber: winner.phoneNumber, selectedAt: new Date(), createdAt: new Date(),
      }
      await db.collection('raffleWinners').doc(id).set(data)
      return { id, ...data }
    })
  )

  return winnerRecords
}

/**
 * Clear raffle winners for re-running
 */
export async function clearRaffleWinners(episodeId: string) {
  const wSnap = await db.collection('raffleWinners').where('episodeId', '==', episodeId).get()
  const batch = db.batch()
  wSnap.docs.forEach((d) => batch.delete(d.ref))
  await batch.commit()

  const sSnap = await db.collection('raffleSettings').where('episodeId', '==', episodeId).limit(1).get()
  if (sSnap.empty) {
    await db.collection('raffleSettings').doc(generateId()).set({
      episodeId, numberOfWinners: 0, isActive: false,
      createdAt: new Date(), updatedAt: new Date(),
    })
  } else {
    await sSnap.docs[0].ref.update({ isActive: false, raffleDate: null, updatedAt: new Date() })
  }
}

/**
 * Get raffle winners for an episode
 */
export async function getRaffleWinners(episodeId: string) {
  const snap = await db.collection('raffleWinners')
    .where('episodeId', '==', episodeId)
    .orderBy('createdAt', 'asc')
    .get()
  return docsToArray(snap)
}

/**
 * Get raffle settings for an episode
 */
export async function getRaffleSettings(episodeId: string) {
  const snap = await db.collection('raffleSettings')
    .where('episodeId', '==', episodeId)
    .limit(1)
    .get()
  if (snap.empty) return null
  return toPlainObject(snap.docs[0])
}
