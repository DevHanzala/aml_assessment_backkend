export const scoreExam = (questions, answers) => {
  let score = 0;

  questions.forEach((q) => {
    let submitted = answers[q.id];
    let correct = q.correctAnswer;

    // Normalize TRUE/FALSE
    if (q.type === "true_false") {
      submitted = submitted === true || submitted === "true";
      correct = correct === true;
    }

    // Normalize MCQ
    if (q.type === "mcq") {
      submitted = String(submitted).trim();
      correct = String(correct).trim();
    }

    if (submitted === correct) {
      score++;
    }
  });

  return {
    score,
    percentage: Math.round((score / questions.length) * 100),
  };
};
