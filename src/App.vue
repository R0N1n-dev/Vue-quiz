<template>
  <div class="page">
    <div class="decor" aria-hidden="true">
      <span class="shape plus c-accent" style="top: 9%; left: 7%">+</span>
      <span class="shape ring c-gold" style="top: 16%; right: 9%"></span>
      <span class="shape q c-blue" style="top: 30%; left: 4%">?</span>
      <span class="shape dot c-ink" style="top: 55%; right: 6%"></span>
      <span class="shape plus c-gold" style="bottom: 22%; left: 12%">+</span>
      <span class="shape tri c-accent" style="bottom: 14%; right: 14%"></span>
      <span class="shape ring c-ink" style="top: 72%; left: 20%"></span>
      <span class="shape q c-gold" style="bottom: 8%; right: 5%">?</span>
      <span class="shape dot c-blue" style="top: 44%; right: 22%"></span>
      <span class="shape sq c-accent" style="top: 6%; left: 38%"></span>
    </div>
    <Header />
    <TheQuiz />
  </div>
</template>

<script>
import Header from "./components/Header.vue";
import TheQuiz from "./components/TheQuiz.vue";

export default {
  name: "App",
  components: { Header, TheQuiz },
};
</script>

<style scoped>
.page {
  position: relative;
  z-index: 0;
  min-height: 100vh;
}

.decor {
  position: fixed;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  overflow: hidden;
}

.shape {
  position: absolute;
  display: grid;
  place-items: center;
  font-weight: 800;
  animation: float 7s ease-in-out infinite alternate;
}

.shape:nth-child(2n) {
  animation-delay: -3.5s;
  animation-duration: 9s;
}

.shape:nth-child(3n) {
  animation-duration: 11s;
}

@keyframes float {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(-14px);
  }
}

.plus {
  font-size: 2.5rem;
  line-height: 1;
}

.q {
  font-size: 4rem;
  line-height: 1;
}

.ring {
  width: 2.25rem;
  height: 2.25rem;
  border: 3px solid currentColor;
  border-radius: 50%;
}

.dot {
  width: 0.875rem;
  height: 0.875rem;
  border-radius: 50%;
  background: currentColor;
}

.tri {
  width: 0;
  height: 0;
  border-left: 1.1rem solid transparent;
  border-right: 1.1rem solid transparent;
  border-bottom: 1.9rem solid currentColor;
}

.sq {
  width: 1.5rem;
  height: 1.5rem;
  border: 3px solid currentColor;
}

.c-accent {
  color: color-mix(in srgb, var(--accent) 22%, transparent);
}

.c-gold {
  color: color-mix(in srgb, var(--gold) 55%, transparent);
}

.c-blue {
  color: color-mix(in srgb, var(--blue) 20%, transparent);
}

.c-ink {
  color: color-mix(in srgb, var(--ink) 12%, transparent);
}

@media (max-width: 640px) {
  .shape {
    animation: none;
  }

  .shape:not(:nth-child(3n + 1)) {
    display: none;
  }
}
</style>
