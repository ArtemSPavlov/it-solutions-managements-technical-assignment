document.querySelectorAll('[data-quiz]').forEach((quiz) => {
  const questions = [...quiz.querySelectorAll('[data-answer]')];
  const result = quiz.querySelector('[data-quiz-result]');

  function updateResult() {
    const answered = questions.filter((question) =>
      question.querySelector('input:checked'),
    ).length;
    const correct = questions.filter((question) =>
      question.classList.contains('correct'),
    ).length;
    result.textContent = `Результат: ${correct} из ${questions.length}; отвечено: ${answered}.`;
  }

  questions.forEach((question) => {
    question.addEventListener('change', () => {
      const selected = question.querySelector('input:checked');
      if (!selected) return;

      const isCorrect = selected.value === question.dataset.answer;
      question.classList.toggle('correct', isCorrect);
      question.classList.toggle('incorrect', !isCorrect);
      question.querySelectorAll('input').forEach((input) => {
        input.disabled = true;
      });
      question.querySelector('.feedback').textContent = isCorrect
        ? question.dataset.correct
        : question.dataset.incorrect;
      updateResult();
    });
  });

  quiz.addEventListener('reset', () => {
    questions.forEach((question) => {
      question.classList.remove('correct', 'incorrect');
      question.querySelectorAll('input').forEach((input) => {
        input.disabled = false;
      });
      question.querySelector('.feedback').textContent = '';
    });
    result.textContent = '';
  });
});
