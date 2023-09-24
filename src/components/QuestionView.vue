<template>
  <section>
    <MDBListGroup light small>
      <h3 v-html="currentQuestion.question" align="center"></h3>
      <MDBListGroupItem
        v-for="(answer, index) in answers"
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
        class="mx-auto "
        :disabled="selectedIndex === null || answered"
        >Submit</MDBBtn
      >
      <MDBBtn color="dark" @click="next">Next</MDBBtn>
    </MDBBtnGroup>
  </section>
</template>

<script>
import _ from "lodash";
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
  computed: {
    answers() {
      let answers = [...this.currentQuestion.incorrect_answers];
      answers.push(this.currentQuestion.correct_answer);
      return answers;
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

    /*() {
      this.selectedIndex = null;
      this.shuffleAnswers();
    }*/
  },
  methods: {
    selectAnswer(index) {
      this.selectedIndex = index;
    },
    submitAnswer() {
      let isCorrect = false;
      if (this.selectedIndex === this.correctIndex) {
        isCorrect = true;
      }
      this.answered = true;
      this.increment(isCorrect);
    },
    shuffleAnswers() {
      let answers = [
        ...this.currentQuestion.incorrect_answers,
        this.currentQuestion.correct_answer,
      ];
      this.shuffledAnswers = answers.sort(() => Math.random() - 0.5);

  // Find the correct index in the shuffled array
  this.correctIndex = this.shuffledAnswers.findIndex(answer => answer === this.currentQuestion.correct_answer);
    },
    answerClass(index) {
      let answerClass = "";

      if (!this.answered && this.selectedIndex === index) {
        answerClass = "selected";
      } else if (this.answered && this.correctIndex === index) {
        answerClass = "correct";
      } else if (
        this.answered &&
        this.selectedIndex === index &&
        this.correctIndex !== index
      ) {
        answerClass = "incorrect";
      }
      return answerClass;
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
