import questions from "../data/questions.json" with { type: "json" };
import shuffle from "../utils/shuffle.js";

export const getRandomQuestions = (count = 20) => {
  const shuffled = shuffle(questions);
  return shuffled.slice(0, Math.min(count, shuffled.length));
};