<template>
  <main>
    <TheCounter :numTotal="numTotal" align="center" :numCorrect="numCorrect" />
    <MDBContainer>
      <MDBRow class="justify-content-center">
        <MDBCol md="6">
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
import { MDBContainer, MDBRow, MDBCol } from "mdb-vue-ui-kit";
export default {
  components: {
    MDBContainer,
    MDBCol,
    MDBRow,
  },
  data() {
    return {
      questions: [],
      index: 0,
      numCorrect: 0,
      numTotal: 0,
    };
  },
  methods: {
    next() {
      if (this.index !== this.questions.length - 1) {
        this.index++;
      } else {
        alert(`Game Over. You got ${this.numCorrect} out of ${this.numTotal}`);
        return;
      }
    },
    increment(isCorrect) {
      if (isCorrect) {
        this.numCorrect++;
      }
      this.numTotal++;
    },
  },
  mounted: function () {
    fetch("https://opentdb.com/api.php?amount=10&category=15", {
      method: "get",
    })
      .then((response) => {
        return response.json();
      })
      .then((jsonData) => {
        this.questions = jsonData.results;
      });
  },
};
</script>

<style scoped>
</style>