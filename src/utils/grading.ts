import { QUESTIONS, QuizQuestion, TOTAL_SCORE_SCALE } from '../data/questions';

export type QuestionStatus = 'correct' | 'partial' | 'incorrect' | 'unanswered';

export interface QuestionResult {
  questionId: number;
  selectedIds: Array<'A' | 'B' | 'C' | 'D'>;
  correctIds: Array<'A' | 'B' | 'C' | 'D'>;
  earnedPoints: number;
  maxPoints: number;
  status: QuestionStatus;
}

export interface QuizEvaluation {
  totalScore: number;
  correctCount: number;
  partialCount: number;
  totalQuestions: number;
  resultsByQuestion: Record<number, QuestionResult>;
}

export function evaluateQuestion(
  question: QuizQuestion,
  selectedIds: Array<'A' | 'B' | 'C' | 'D'>,
  maxPointsPerQuestion: number
): QuestionResult {
  const uniqueSelected = Array.from(new Set(selectedIds));
  const correctSet = new Set(question.correctIds);

  if (uniqueSelected.length === 0) {
    return {
      questionId: question.id,
      selectedIds: [],
      correctIds: question.correctIds,
      earnedPoints: 0,
      maxPoints: maxPointsPerQuestion,
      status: 'unanswered',
    };
  }

  if (question.type === 'single') {
    const isCorrect =
      uniqueSelected.length === 1 && correctSet.has(uniqueSelected[0]);
    return {
      questionId: question.id,
      selectedIds: uniqueSelected,
      correctIds: question.correctIds,
      earnedPoints: isCorrect ? maxPointsPerQuestion : 0,
      maxPoints: maxPointsPerQuestion,
      status: isCorrect ? 'correct' : 'incorrect',
    };
  }

  // Multiple-choice grading:
  // Exact match gets full points.
  // Partial credit: (correctPicked / totalCorrect - wrongPicked / totalWrong) * maxPoints, clamped to [0, maxPoints].
  const totalCorrect = question.correctIds.length;
  const totalWrong = question.options.length - totalCorrect;
  const correctPicked = uniqueSelected.filter((id) => correctSet.has(id)).length;
  const wrongPicked = uniqueSelected.filter((id) => !correctSet.has(id)).length;

  const isExactMatch =
    correctPicked === totalCorrect && wrongPicked === 0;

  if (isExactMatch) {
    return {
      questionId: question.id,
      selectedIds: uniqueSelected,
      correctIds: question.correctIds,
      earnedPoints: maxPointsPerQuestion,
      maxPoints: maxPointsPerQuestion,
      status: 'correct',
    };
  }

  const ratio = Math.max(
    0,
    correctPicked / totalCorrect - (totalWrong > 0 ? wrongPicked / totalWrong : 0)
  );
  const earnedPoints = Math.round(ratio * maxPointsPerQuestion * 100) / 100;

  return {
    questionId: question.id,
    selectedIds: uniqueSelected,
    correctIds: question.correctIds,
    earnedPoints,
    maxPoints: maxPointsPerQuestion,
    status: earnedPoints > 0 ? 'partial' : 'incorrect',
  };
}

export function evaluateQuiz(
  answers: Record<number, Array<'A' | 'B' | 'C' | 'D'>>
): QuizEvaluation {
  const maxPointsPerQuestion = TOTAL_SCORE_SCALE / QUESTIONS.length;
  const resultsByQuestion: Record<number, QuestionResult> = {};

  let rawTotal = 0;
  let correctCount = 0;
  let partialCount = 0;

  for (const question of QUESTIONS) {
    const selected = answers[question.id] ?? [];
    const result = evaluateQuestion(question, selected, maxPointsPerQuestion);
    resultsByQuestion[question.id] = result;
    rawTotal += result.earnedPoints;
    if (result.status === 'correct') {
      correctCount += 1;
    } else if (result.status === 'partial') {
      partialCount += 1;
    }
  }

  const totalScore = Math.round(rawTotal * 100) / 100;

  return {
    totalScore,
    correctCount,
    partialCount,
    totalQuestions: QUESTIONS.length,
    resultsByQuestion,
  };
}

export function formatTimeMMSS(totalSeconds: number): string {
  const clamped = Math.max(0, Math.floor(totalSeconds));
  const mins = Math.floor(clamped / 60);
  const secs = clamped % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export function formatDurationVietnamese(totalSeconds: number): string {
  const clamped = Math.max(0, Math.floor(totalSeconds));
  const mins = Math.floor(clamped / 60);
  const secs = clamped % 60;
  if (mins === 0) {
    return `${secs} giây`;
  }
  return `${String(mins).padStart(2, '0')} phút ${String(secs).padStart(2, '0')} giây`;
}
