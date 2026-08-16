<template>
  <section>
    <MDBListGroup light small>
      <h3 v-html="currentQuestion.question" align="center"></h3>
      <MDBListGroupItem
        v-for="(answer, index) in shuffledAnswers"
        :key="index"
        @click.prevent="selectAnswer(index)"
        :class="answerClass(index)"
      >
        <p v-html="answer"></p>
      </MDBListGroupItem>
    </MDBListGroup>
    <MDBBtnGroup class="d-flex">
      <MDBBtn
        @click="submitAnswer"
        color="primary"
        class="mx-auto"
        :disabled="selectedIndex === null || answered"
        >Submit</MDBBtn
      >
      <MDBBtn color="dark" @click="next">Next</MDBBtn>
    </MDBBtnGroup>
  </section>
</template>
<script>
import {
  MDBListGroup,
  MDBListGroupItem,
  MDBBtn,
  MDBBtnGroup,
} from "mdb-vue-ui-kit";
export default {
  components: {
    MDBBtn,
    MDBBtnGroup,
    MDBListGroup,
    MDBListGroupItem,
  },
  props: {
    currentQuestion: Object,
    next: Function,
    increment: Function,
  },
  data() {
    return {
      selectedIndex: null,
      correctIndex: null,
      shuffledAnswers: [],
      answered: false,
    };
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
    },
    submitAnswer() {
      const isCorrect = this.selectedIndex === this.correctIndex;
      this.answered = true;
      this.increment(isCorrect);
    },
    shuffleAnswers() {
      const answers = [
        ...this.currentQuestion.incorrect_answers,
        this.currentQuestion.correct_answer,
      ];

      // Fisher-Yates shuffle. Math.random() - 0.5 in Array.sort is biased
      // and not guaranteed to touch every element depending on engine.
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
      if (!this.answered && this.selectedIndex === index) {
        return "selected";
      }
      if (this.answered && this.correctIndex === index) {
        return "correct";
      }
      if (
        this.answered &&
        this.selectedIndex === index &&
        this.correctIndex !== index
      ) {
        return "incorrect";
      }
      return "";
    },
  },
};
</script>
<style scoped>
.list-group {
  margin-bottom: 15px;
}
.list-group-item:hover {
  background: #eee;
  cursor: pointer;
}
.selected {
  background-color: lightblue;
}
.correct {
  background-color: lightgreen;
}
.incorrect {
  background-color: red;
}
</style>
