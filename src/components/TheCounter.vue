<template>
  <div class="mt-5 d-flex justify-content-center align-items-center">
    <main class="">
      <h4>Correct/Total Questions answered</h4>
      <MDBBadge class="px-5 py-2" color="primary"
        >{{ numCorrect }}/{{ numTotal }}</MDBBadge
      >
    </main>
  </div>
</template>

<script>
import { MDBBadge } from "mdb-vue-ui-kit";
export default {
  components: {
    MDBBadge,
  },
  props: ["numCorrect", "numTotal"],
};
</script>

<style>
</style> 