<template>
  <main class="quiz">
    <!-- Setup -->
    <section v-if="phase === 'setup'" class="setup">
      <div class="hero">
        <h1 class="hero-title">
          How well do you<br />
          <span class="hero-accent">really</span> know things?
        </h1>
        <p class="hero-lede">
          Pick a category, choose your difficulty, and see how many you can get
          right.
        </p>
      </div>

      <form class="config" @submit.prevent="getQuestions">
        <div class="field">
          <label class="field-label" for="q-count">
            <Hash :size="16" :weight="'bold'" />
            Questions
          </label>
          <div class="stepper">
            <button
              type="button"
              class="stepper-btn"
              :disabled="noOfQns <= 1"
              aria-label="Fewer questions"
              @click="noOfQns--"
            >
              <Minus :size="16" :weight="'bold'" />
            </button>
            <input
              id="q-count"
              v-model.number="noOfQns"
              class="stepper-input"
              type="number"
              min="1"
              max="30"
            />
            <button
              type="button"
              class="stepper-btn"
              :disabled="noOfQns >= 30"
              aria-label="More questions"
              @click="noOfQns++"
            >
              <Plus :size="16" :weight="'bold'" />
            </button>
          </div>
        </div>

        <div class="field">
          <label class="field-label" for="q-category">
            <SquaresFour :size="16" :weight="'bold'" />
            Category
          </label>
          <div class="select-wrap">
            <select id="q-category" v-model="category" class="select">
              <option value="">Surprise me</option>
              <option
                v-for="option in categoryOptions"
                :key="option.value"
                :value="option.value"
              >
                {{ option.text }}
              </option>
            </select>
            <CaretDown :size="18" class="select-icon" aria-hidden="true" />
          </div>
        </div>

        <div class="field">
          <span class="field-label" id="q-difficulty-label">
            <Gauge :size="16" :weight="'bold'" />
            Difficulty
          </span>
          <div class="segmented" role="group" aria-labelledby="q-difficulty-label">
            <button
              v-for="setting in difficultyOptions"
              :key="setting.value"
              type="button"
              class="segment"
              :class="{ 'is-active': difficulty === setting.value }"
              :aria-pressed="difficulty === setting.value"
              @click="difficulty = setting.value"
            >
              {{ setting.text }}
            </button>
          </div>
        </div>

        <button type="submit" class="btn-start">
          <Play :size="20" :weight="'fill'" />
          Start quiz
        </button>
      </form>
    </section>

    <!-- Loading -->
    <section v-else-if="phase === 'loading'" class="status" aria-live="polite">
      <CircleNotch :size="40" class="spin" />
      <p class="status-text">Fetching questions…</p>
      <div class="skeleton" aria-hidden="true">
        <span v-for="n in 4" :key="n" class="skeleton-line"></span>
      </div>
    </section>

    <!-- Error -->
    <section v-else-if="phase === 'error'" class="status" role="alert">
      <WarningCircle :size="44" class="status-icon-error" />
      <h2 class="status-title">Couldn't load questions</h2>
      <p class="status-text">{{ errorMessage }}</p>
      <button type="button" class="btn-start" @click="phase = 'setup'">
        <ArrowLeft :size="20" :weight="'bold'" />
        Back to setup
      </button>
    </section>

    <!-- Playing -->
    <section v-else-if="phase === 'playing'" class="playing">
      <div class="hud">
        <div class="progress" role="progressbar" :aria-valuenow="index + 1" :aria-valuemin="1" :aria-valuemax="questions.length" :aria-label="`Question ${index + 1} of ${questions.length}`">
          <span
            v-for="n in questions.length"
            :key="n"
            class="progress-seg"
            :class="{ 'is-done': n <= index, 'is-current': n === index + 1 }"
          ></span>
        </div>
        <div class="hud-meta">
          <span class="hud-count">{{ index + 1 }} / {{ questions.length }}</span>
          <span class="hud-score">
            <CheckCircle :size="18" :weight="'fill'" />
            {{ numCorrect }}
          </span>
        </div>
      </div>

      <div class="card">
        <QuestionView
          :currentQuestion="questions[index]"
          :index="index"
          :total="questions.length"
          :next="next"
          :increment="increment"
        />
      </div>
    </section>

    <!-- Results -->
    <section v-else class="results">
      <div class="results-card">
        <span class="results-icon" :class="resultTier.class" aria-hidden="true">
          <component :is="resultTier.icon" :size="56" :weight="'fill'" />
        </span>
        <p class="results-score">{{ numCorrect }}<span class="results-total"> / {{ questions.length }}</span></p>
        <h2 class="results-title">{{ resultTier.title }}</h2>
        <p class="results-sub">{{ resultTier.sub }}</p>
        <button type="button" class="btn-start" @click="reset">
          <ArrowCounterClockwise :size="20" :weight="'bold'" />
          Play again
        </button>
      </div>
    </section>
  </main>
</template>

<script>
import {
  PhHash as Hash,
  PhSquaresFour as SquaresFour,
  PhGauge as Gauge,
  PhCaretDown as CaretDown,
  PhPlay as Play,
  PhMinus as Minus,
  PhPlus as Plus,
  PhCircleNotch as CircleNotch,
  PhCheckCircle as CheckCircle,
  PhWarningCircle as WarningCircle,
  PhArrowLeft as ArrowLeft,
  PhArrowCounterClockwise as ArrowCounterClockwise,
  PhTrophy as Trophy,
  PhMedal as Medal,
  PhTarget as Target,
} from "@phosphor-icons/vue";
import QuestionView from "./QuestionView.vue";

export default {
  components: {
    QuestionView,
    Hash,
    SquaresFour,
    Gauge,
    CaretDown,
    Play,
    Minus,
    Plus,
    CircleNotch,
    CheckCircle,
    WarningCircle,
    ArrowLeft,
    ArrowCounterClockwise,
    Trophy,
    Medal,
    Target,
  },
  data() {
    return {
      phase: "setup",
      questions: [],
      index: 0,
      numCorrect: 0,
      loading: false,
      category: "",
      difficulty: "",
      noOfQns: 10,
      errorMessage: "",
      difficultyOptions: [
        { text: "Easy", value: "easy" },
        { text: "Medium", value: "medium" },
        { text: "Hard", value: "hard" },
      ],
      categoryOptions: [
        { text: "Video games", value: "15" },
        { text: "General knowledge", value: "9" },
        { text: "Books", value: "10" },
        { text: "Film", value: "11" },
        { text: "Music", value: "12" },
        { text: "Vehicles", value: "28" },
        { text: "Science & nature", value: "17" },
        { text: "Animals", value: "27" },
        { text: "History", value: "23" },
        { text: "Sports", value: "21" },
        { text: "Anime & manga", value: "31" },
      ],
    };
  },
  computed: {
    resultTier() {
      const pct = this.questions.length
        ? this.numCorrect / this.questions.length
        : 0;
      if (pct >= 0.8)
        return {
          icon: Trophy,
          class: "tier-gold",
          title: "Trivia master",
          sub: "You really know your stuff.",
        };
      if (pct >= 0.5)
        return {
          icon: Medal,
          class: "tier-blue",
          title: "Solid run",
          sub: "A few more rounds and you'll be dangerous.",
        };
      return {
        icon: Target,
        class: "tier-accent",
        title: "Good start",
        sub: "Everyone whiffs. Run it back.",
      };
    },
  },
  methods: {
    next() {
      if (this.index !== this.questions.length - 1) {
        this.index++;
      } else {
        this.phase = "results";
      }
    },
    increment(isCorrect) {
      if (isCorrect) {
        this.numCorrect++;
      }
    },
    getQuestions() {
      this.phase = "loading";
      const amount = Math.min(Math.max(this.noOfQns || 10, 1), 30);
      fetch(
        `https://opentdb.com/api.php?amount=${amount}&category=${this.category}&difficulty=${this.difficulty}`
      )
        .then((response) => response.json())
        .then((jsonData) => {
          if (!jsonData.results || jsonData.results.length === 0) {
            this.errorMessage =
              "No questions matched those settings. Try a different category or difficulty.";
            this.phase = "error";
            return;
          }
          this.questions = jsonData.results;
          this.index = 0;
          this.numCorrect = 0;
          this.phase = "playing";
        })
        .catch(() => {
          this.errorMessage =
            "The question service didn't respond. Check your connection and try again.";
          this.phase = "error";
        });
    },
    reset() {
      this.questions = [];
      this.index = 0;
      this.numCorrect = 0;
      this.noOfQns = 10;
      this.category = "";
      this.difficulty = "";
      this.phase = "setup";
    },
  },
};
</script>

<style scoped>
.quiz {
  width: min(720px, 100%);
  margin: 0 auto;
  padding: clamp(1.5rem, 4vw, 3rem) clamp(1rem, 4vw, 1.5rem) 4rem;
}

/* Setup */
.setup {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.hero {
  margin-bottom: 2rem;
  text-align: center;
}

.hero-title {
  margin: 0 0 0.75rem;
  font-size: clamp(2.25rem, 6vw, 3.5rem);
  font-weight: 800;
  line-height: 1.05;
  letter-spacing: -0.03em;
  text-wrap: balance;
}

.hero-accent {
  color: var(--accent);
}

.hero-lede {
  margin: 0 auto;
  max-width: 46ch;
  font-size: 1.0625rem;
  line-height: 1.5;
  color: var(--ink-soft);
}

.config {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem;
  width: min(100%, 32rem);
  padding: clamp(1.25rem, 3vw, 1.75rem);
  background: var(--card);
  border: var(--border-w) solid var(--line);
  border-radius: var(--radius);
}

.field {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.field-label {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.8125rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--ink-soft);
}

.stepper {
  display: flex;
  align-items: stretch;
  border: var(--border-w) solid var(--line);
  border-radius: 10px;
  overflow: hidden;
  width: fit-content;
}

.stepper-btn {
  display: grid;
  place-items: center;
  width: 2.75rem;
  border: none;
  background: var(--paper);
  color: var(--ink);
  transition: background-color 0.15s ease;
}

.stepper-btn:hover:not(:disabled) {
  background: var(--gold);
}

.stepper-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.stepper-input {
  width: 4rem;
  border: none;
  border-left: var(--border-w) solid var(--line);
  border-right: var(--border-w) solid var(--line);
  background: var(--card);
  color: var(--ink);
  font-family: inherit;
  font-size: 1.125rem;
  font-weight: 700;
  text-align: center;
  padding: 0.5rem 0;
  -moz-appearance: textfield;
}

.stepper-input::-webkit-outer-spin-button,
.stepper-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.stepper-input:focus-visible {
  outline: 2px solid var(--ink);
  outline-offset: -2px;
}

.select-wrap {
  position: relative;
  width: fit-content;
  max-width: 100%;
}

.select {
  appearance: none;
  padding: 0.75rem 2.75rem 0.75rem 1rem;
  border: var(--border-w) solid var(--line);
  border-radius: 10px;
  background: var(--card);
  color: var(--ink);
  font-family: inherit;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
}

.select:hover {
  background: var(--gold);
}

.select:focus-visible {
  outline: 2px solid var(--ink);
  outline-offset: 2px;
}

.select-icon {
  position: absolute;
  right: 0.875rem;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
}

.segmented {
  display: inline-flex;
  border: var(--border-w) solid var(--line);
  border-radius: 10px;
  overflow: hidden;
  width: fit-content;
}

.segment {
  padding: 0.625rem 1.25rem;
  border: none;
  border-right: var(--border-w) solid var(--line);
  background: var(--card);
  color: var(--ink);
  font-size: 0.9375rem;
  font-weight: 700;
  transition: background-color 0.15s ease, color 0.15s ease;
}

.segment:last-child {
  border-right: none;
}

.segment:hover {
  background: var(--paper);
}

.segment.is-active {
  background: var(--ink);
  color: var(--paper);
}

.btn-start {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  align-self: center;
  padding: 0.875rem 1.75rem;
  border: var(--border-w) solid var(--line);
  border-radius: 999px;
  background: var(--accent);
  color: #fff;
  font-family: inherit;
  font-size: 1.0625rem;
  font-weight: 800;
  transition: background-color 0.15s ease, transform 0.15s ease;
}

.btn-start:hover {
  background: var(--accent-dark);
}

.btn-start:active {
  transform: translateY(1px);
}

/* Status screens */
.status {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 4rem 1rem;
  text-align: center;
}

.spin {
  color: var(--accent);
  animation: spin 0.9s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.status-icon-error {
  color: var(--incorrect);
}

.status-title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.status-text {
  margin: 0;
  max-width: 40ch;
  color: var(--ink-soft);
  line-height: 1.5;
}

.skeleton {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  width: min(480px, 100%);
  margin-top: 1rem;
}

.skeleton-line {
  height: 3.25rem;
  background: var(--card);
  border: var(--border-w) solid var(--line);
  border-radius: var(--radius);
  animation: pulse 1.2s ease-in-out infinite alternate;
}

.skeleton-line:nth-child(2) {
  animation-delay: 0.15s;
}
.skeleton-line:nth-child(3) {
  animation-delay: 0.3s;
}
.skeleton-line:nth-child(4) {
  animation-delay: 0.45s;
}

@keyframes pulse {
  from {
    opacity: 1;
  }
  to {
    opacity: 0.45;
  }
}

/* Playing */
.playing {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding-top: 2rem;
}

.hud {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.progress {
  display: flex;
  gap: 0.375rem;
}

.progress-seg {
  flex: 1;
  height: 0.625rem;
  background: var(--card);
  border: 1.5px solid var(--line);
  border-radius: 999px;
  transition: background-color 0.2s ease;
}

.progress-seg.is-done {
  background: var(--ink);
}

.progress-seg.is-current {
  background: var(--accent);
}

.hud-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
  font-weight: 700;
}

.hud-count {
  color: var(--ink-soft);
  font-variant-numeric: tabular-nums;
}

.hud-score {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.25rem 0.75rem;
  background: var(--gold);
  border: 2px solid var(--line);
  border-radius: 999px;
  font-variant-numeric: tabular-nums;
}

.card {
  background: var(--card);
  border: var(--border-w) solid var(--line);
  border-radius: var(--radius);
  padding: clamp(1.25rem, 3vw, 2rem);
}

/* Results */
.results {
  display: grid;
  place-items: center;
  padding: 3rem 1rem;
}

.results-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  width: min(480px, 100%);
  padding: clamp(2rem, 5vw, 3rem) clamp(1.5rem, 4vw, 2.5rem);
  background: var(--card);
  border: var(--border-w) solid var(--line);
  border-radius: var(--radius);
  text-align: center;
}

.results-icon {
  display: grid;
  place-items: center;
  width: 6rem;
  height: 6rem;
  border-radius: 50%;
  border: var(--border-w) solid var(--line);
}

.tier-gold {
  background: var(--gold);
}

.tier-blue {
  background: var(--blue);
  color: #fff;
}

.tier-accent {
  background: var(--accent);
  color: #fff;
}

.results-score {
  margin: 0.5rem 0 0;
  font-size: 4rem;
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.04em;
  font-variant-numeric: tabular-nums;
}

.results-total {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--ink-soft);
}

.results-title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.results-sub {
  margin: 0 0 1rem;
  color: var(--ink-soft);
}
</style>
