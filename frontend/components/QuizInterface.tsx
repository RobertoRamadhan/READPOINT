'use client';

import { useState } from 'react';

export interface QuizQuestion {
  id: number;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string;
}

export interface QuizInterfaceProps {
  quizId: number;
  ebookTitle: string;
  questions: QuizQuestion[];
  onSubmit: (answers: Record<number, string>, score: number) => void;
  onCancel: () => void;
}

export default function QuizInterface({
  quizId,
  ebookTitle,
  questions,
  onSubmit,
  onCancel,
}: QuizInterfaceProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  const currentQuestion = questions[currentIndex];
  const options = [
    { key: 'a', label: currentQuestion?.option_a },
    { key: 'b', label: currentQuestion?.option_b },
    { key: 'c', label: currentQuestion?.option_c },
    { key: 'd', label: currentQuestion?.option_d },
  ];

  const handleSelectAnswer = (key: string) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestion.id]: key,
    });
  };

  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSubmitQuiz = () => {
    // Calculate score
    let correctCount = 0;
    questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correct_answer.toLowerCase()) {
        correctCount++;
      }
    });

    const calculatedScore = Math.round((correctCount / questions.length) * 100);
    setScore(calculatedScore);
    setShowResults(true);

    // Call parent callback
    onSubmit(selectedAnswers, calculatedScore);
  };

  const handleTakeAgain = () => {
    setCurrentIndex(0);
    setSelectedAnswers({});
    setShowResults(false);
    setScore(0);
  };

  const isAnswered = currentQuestion && selectedAnswers[currentQuestion.id];
  const allAnswered = questions.length > 0 && Object.keys(selectedAnswers).length === questions.length;

  if (questions.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-sky-200 p-8 text-center">
        <p className="text-gray-600">Tidak ada pertanyaan kuis tersedia</p>
        <button
          onClick={onCancel}
          className="mt-4 px-4 py-2 bg-sky-600 text-white rounded hover:bg-sky-700"
        >
          Kembali
        </button>
      </div>
    );
  }

  if (showResults) {
    const correctCount = Object.keys(selectedAnswers).length;
    const percentage = Math.round((correctCount / questions.length) * 100);

    return (
      <div className="bg-white rounded-lg border border-sky-200 p-8 max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Hasil Kuis</h2>
          <p className="text-gray-600 mb-4">{ebookTitle}</p>
        </div>

        <div className="bg-sky-50 rounded-lg p-8 mb-8 text-center">
          <div className="text-6xl font-bold text-sky-600 mb-4">{score}%</div>
          <div className="text-xl text-gray-700 mb-2">
            Jawab Benar: <span className="font-bold">{correctCount}</span> dari{' '}
            <span className="font-bold">{questions.length}</span>
          </div>
          <p className="text-gray-600 mt-4">
            {score >= 80
              ? '🎉 Sempurna! Kamu menguasai materi dengan baik!'
              : score >= 60
                ? '👍 Bagus! Terus tingkatkan pemahaman kamu.'
                : '💪 Baik, coba pelajari ulang materi dan coba lagi.'}
          </p>
        </div>

        <div className="flex gap-4 justify-center">
          <button
            onClick={handleTakeAgain}
            className="px-6 py-2 bg-sky-600 text-white rounded hover:bg-sky-700 font-medium"
          >
            Coba Lagi
          </button>
          <button
            onClick={onCancel}
            className="px-6 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 font-medium"
          >
            Selesai
          </button>
        </div>

        {/* Detail Jawaban */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Detail Jawaban</h3>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {questions.map((q, idx) => {
              const userAnswer = selectedAnswers[q.id];
              const isCorrect = userAnswer === q.correct_answer.toLowerCase();

              return (
                <div
                  key={q.id}
                  className={`p-4 rounded border-l-4 ${
                    isCorrect
                      ? 'bg-green-50 border-green-500'
                      : 'bg-red-50 border-red-500'
                  }`}
                >
                  <p className="font-medium text-gray-800 mb-2">
                    {idx + 1}. {q.question_text}
                  </p>
                  <p
                    className={`text-sm ${
                      isCorrect ? 'text-green-700' : 'text-red-700'
                    }`}
                  >
                    {isCorrect ? '✓ Benar' : '✗ Salah'} - Jawaban kamu: {userAnswer?.toUpperCase()}
                  </p>
                  {!isCorrect && (
                    <p className="text-sm text-green-700 mt-1">
                      Jawaban yang benar: {q.correct_answer.toUpperCase()}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-sky-200 p-8 max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Kuis</h2>
        <p className="text-gray-600">{ebookTitle}</p>
        <div className="flex justify-between items-center mt-4">
          <span className="text-sm text-gray-600">
            Pertanyaan {currentIndex + 1} dari {questions.length}
          </span>
          <div className="flex-1 mx-4 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-sky-600 transition-all duration-300"
              style={{
                width: `${((currentIndex + 1) / questions.length) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Question */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-6">
          {currentQuestion?.question_text}
        </h3>

        {/* Options */}
        <div className="space-y-3">
          {options.map(({ key, label }) => (
            <label
              key={key}
              className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                selectedAnswers[currentQuestion.id] === key
                  ? 'border-sky-600 bg-sky-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                name={`question-${currentQuestion.id}`}
                value={key}
                checked={selectedAnswers[currentQuestion.id] === key}
                onChange={() => handleSelectAnswer(key)}
                className="w-4 h-4 text-sky-600 cursor-pointer"
              />
              <span className="ml-3 text-gray-700">
                <span className="font-semibold mr-2">{key.toUpperCase()}.</span>
                {label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex gap-3 justify-between">
        <button
          onClick={handlePreviousQuestion}
          disabled={currentIndex === 0}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed font-medium"
        >
          ← Sebelumnya
        </button>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 font-medium"
          >
            Batalkan
          </button>

          {currentIndex < questions.length - 1 ? (
            <button
              onClick={handleNextQuestion}
              disabled={!isAnswered}
              className="px-4 py-2 bg-sky-600 text-white rounded hover:bg-sky-700 disabled:bg-sky-300 disabled:cursor-not-allowed font-medium"
            >
              Selanjutnya →
            </button>
          ) : (
            <button
              onClick={handleSubmitQuiz}
              disabled={!allAnswered}
              className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-green-300 disabled:cursor-not-allowed font-medium"
            >
              Selesai Kuis
            </button>
          )}
        </div>
      </div>

      {/* Question Indicators */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <p className="text-sm text-gray-600 mb-3">Navigasi Cepat:</p>
        <div className="flex flex-wrap gap-2">
          {questions.map((q, idx) => (
            <button
              key={q.id}
              onClick={() => setCurrentIndex(idx)}
              className={`w-8 h-8 rounded text-sm font-medium transition-colors ${
                idx === currentIndex
                  ? 'bg-sky-600 text-white'
                  : selectedAnswers[q.id]
                    ? 'bg-green-200 text-green-800 hover:bg-green-300'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-2">
          🟩 = Sudah dijawab | 🟦 = Pertanyaan aktif | ⬜ = Belum dijawab
        </p>
      </div>
    </div>
  );
}
