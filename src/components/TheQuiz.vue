<template>
  <main class="mb-3">
    <MDBContainer class="mt-5">
      <MDBRow class="justify-content-center gx-4 gy-4">
        <h4 align="center">Please select some options or just begin with a random quiz</h4>
        <MDBCol sm="8" md="4">
          <MDBInput
            label="Number of Questions(10 by default)"
            type="number"
            style="height: calc(3.5rem + 2px)"
            v-model="noOfQns"
          />
        </MDBCol>
        <MDBCol sm="8" md="4">
          <div class="form-floating">
            <select
              class="form-select"
              v-model="category"
              id="floatingSelect"
              aria-label="Category Select"
            >
              <option
                :value="option.value"
                v-for="option in categoryOptions"
                :key="option"
              >
                {{ option.text }}
              </option>
            </select>
            <label for="floatingSelect">Pick a category</label>
          </div>
        </MDBCol>
        <MDBCol sm="8" md="4">
          <div class="form-floating">
            <select
              class="form-select"
              v-model="difficulty"
              id="floatingSelect"
              aria-label="Difficulty Select"
            >
              <option
                :value="setting.value"
                v-for="setting in difficultyOptions"
                :key="setting"
              >
                {{ setting.text }}
              </option>
            </select>
            <label for="floatingSecret">Select difficulty</label>
          </div>
        </MDBCol>
        <div align="center">
          <MDBBtn color="dark" rounded class="" @click="getQuestions"
            >Get Questions & Begin</MDBBtn
          >
        </div>
        <h2 align="center" class="my-1" v-if="loading">Incoming....</h2>
        <MDBCol md="6" v-if="questions.length > 0">
          <TheCounter
            :numTotal="numTotal"
            align="center"
            :numCorrect="numCorrect"
          />
          <QuestionView
            v-if="questions.length"
            :currentQuestion="questions[index]"
            :next="next"
            :increment="increment"
          />
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  </main>
</template>

<script>
import { MDBContainer, MDBRow, MDBCol, MDBInput, MDBBtn } from "mdb-vue-ui-kit";
export default {
  components: {
    MDBContainer,
    MDBCol,
    MDBRow,
    MDBInput,
    MDBBtn,
  },
  data() {
    return {
      questions: [],
      index: 0,
      numCorrect: 0,
      numTotal: 0,
      loading: false,
      category: "",
      difficulty: "",
      noOfQns: 10,
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
  methods: {
    next() {
      if (this.index !== this.questions.length - 1) {
        this.index++;
      } else {
        alert(`Game Over. You got ${this.numCorrect} out of ${this.numTotal}`);
        this.questions.length = 0;
        this.noOfQns = 10;
        this.category = "";
        this.difficulty = "";
        this.index = 0;
        this.numTotal = 0;
        this.numCorrect = 0;
        return;
      }
    },
    increment(isCorrect) {
      if (isCorrect) {
        this.numCorrect++;
      }
      this.numTotal++;
    },
    getQuestions() {
      this.loading = true;
      fetch(
        `https://opentdb.com/api.php?amount=${this.noOfQns}&category=${this.category}&difficulty=${this.difficulty}`,
        {
          method: "get",
        }
      )
        .then((response) => {
          return response.json();
        })
        .then((jsonData) => {
          this.questions = jsonData.results;
          this.loading = false;
        });
    },
  }
};
</script>

<style scoped>
</style>
