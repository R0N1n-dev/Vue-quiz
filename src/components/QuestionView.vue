<template>
  <section class="question-view">
    <p class="question-text" v-html="currentQuestion.question"></p>

    <div class="answers" role="group" aria-label="Answer choices">
      <button
        v-for="(answer, i) in shuffledAnswers"
        :key="i"
        type="button"
        class="answer"
        :class="answerClass(i)"
        :disabled="answered"
        @click="selectAnswer(i)"
      >
        <span class="answer-key" aria-hidden="true">{{ letters[i] }}</span>
        <span class="answer-text" v-html="answer"></span>
        <span class="answer-icon" aria-hidden="true">
          <Check v-if="answered && i === correctIndex" :size="18" :weight="'bold'" />
          <X v-else-if="answered && i === selectedIndex" :size="18" :weight="'bold'" />
        </span>
      </button>
    </div>

    <div class="actions">
      <button
        v-if="answered"
        type="button"
        class="btn btn-primary"
        @click="next"
      >
        {{ isLast ? "See results" : "Next question" }}
        <ArrowRight :size="18" :weight="'bold'" />
      </button>
    </div>
  </section>
</template>

<script>
import {
  PhCheck as Check,
  PhX as X,
  PhArrowRight as ArrowRight,
} from "@phosphor-icons/vue";

export default {
  components: { Check, X, ArrowRight },
  props: {
    currentQuestion: Object,
    next: Function,
    increment: Function,
    index: Number,
    total: Number,
  },
  data() {
    return {
      letters: ["A", "B", "C", "D"],
      selectedIndex: null,
      correctIndex: null,
      shuffledAnswers: [],
      answered: false,
    };
  },
  computed: {
    isLast() {
      return this.index === this.total - 1;
    },
  },
  watch: {
    currentQuestion: {
      immediate: true,
      handler() {
        this.selectedIndex = null;
        this.answered = false;
        this.shuffleAnswers();
      },
    },
  },
  methods: {
    selectAnswer(index) {
      if (this.answered) return;
      this.selectedIndex = index;
      this.answered = true;
      this.increment(index === this.correctIndex);
    },
    shuffleAnswers() {
      const answers = [
        ...this.currentQuestion.incorrect_answers,
        this.currentQuestion.correct_answer,
      ];

      for (let i = answers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [answers[i], answers[j]] = [answers[j], answers[i]];
      }

      this.shuffledAnswers = answers;
      this.correctIndex = answers.findIndex(
        (answer) => answer === this.currentQuestion.correct_answer
      );
    },
    answerClass(index) {
      if (this.answered && index === this.correctIndex) return "is-correct";
      if (this.answered && index === this.selectedIndex) return "is-wrong";
      if (!this.answered && index === this.selectedIndex) return "is-selected";
      if (this.answered) return "is-dim";
      return "";
    },
  },
};
</script>

<style scoped>
.question-view {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.question-text {
  margin: 0;
  font-size: clamp(1.25rem, 2.5vw, 1.5rem);
  font-weight: 700;
  line-height: 1.35;
  letter-spacing: -0.01em;
}

.answers {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
}

.answer {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  width: 100%;
  padding: 0.875rem 1rem;
  background: var(--card);
  border: var(--border-w) solid var(--line);
  border-radius: var(--radius);
  color: var(--ink);
  font-size: 1rem;
  font-weight: 500;
  text-align: left;
  transition: background-color 0.15s ease, transform 0.15s ease,
    border-color 0.15s ease, opacity 0.15s ease;
}

.answer:not(:disabled):hover {
  background: var(--gold);
  transform: translateY(-1px);
}

.answer:not(:disabled):active {
  transform: translateY(0);
}

.answer-key {
  flex-shrink: 0;
  display: grid;
  place-items: center;
  width: 1.875rem;
  height: 1.875rem;
  border: 2px solid var(--line);
  border-radius: 7px;
  font-size: 0.8125rem;
  font-weight: 800;
  background: var(--paper);
}

.answer-text {
  flex: 1;
  line-height: 1.4;
}

.answer-icon {
  display: grid;
  place-items: center;
  width: 1.5rem;
  color: #fff;
}

.is-selected {
  background: var(--accent);
  color: #fff;
}

.is-selected .answer-key {
  background: #fff;
  color: var(--accent);
}

.is-correct {
  background: var(--correct);
  border-color: var(--correct);
  color: #fff;
}

.is-correct .answer-key {
  background: #fff;
  border-color: #fff;
  color: var(--correct);
}

.is-correct .answer-icon {
  color: #fff;
}

.is-wrong {
  background: var(--incorrect);
  border-color: var(--incorrect);
  color: #fff;
}

.is-wrong .answer-key {
  background: #fff;
  border-color: #fff;
  color: var(--incorrect);
}

.is-wrong .answer-icon {
  color: #fff;
}

.is-dim {
  opacity: 0.45;
}

.is-dim:hover {
  opacity: 0.45;
  transform: none;
  background: var(--card);
}

.actions {
  display: flex;
  justify-content: center;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: var(--border-w) solid var(--line);
  border-radius: 999px;
  font-size: 1rem;
  font-weight: 700;
  transition: background-color 0.15s ease, transform 0.15s ease,
    opacity 0.15s ease;
}

.btn-primary {
  background: var(--accent);
  color: #fff;
}

.btn-primary:hover:not(:disabled) {
  background: var(--accent-dark);
}

.btn-primary:active:not(:disabled) {
  transform: translateY(1px);
}
</style>
