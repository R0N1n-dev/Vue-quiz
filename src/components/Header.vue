<template>
  <header class="site-header">
    <div class="brand">
      <span class="brand-mark" aria-hidden="true">
        <Question :size="24" :weight="'bold'" />
      </span>
      <span class="brand-name">The Quiz</span>
    </div>
    <p class="tagline">Test your knowledge</p>
  </header>
</template>

<script>
import { PhQuestion as Question } from "@phosphor-icons/vue";

export default {
  components: { Question },
};
</script>

<style scoped>
.site-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem clamp(1rem, 4vw, 2.5rem);
  border-bottom: var(--border-w) solid var(--line);
}

.brand {
  display: flex;
  align-items: center;
  gap: 0.625rem;
}

.brand-mark {
  display: grid;
  place-items: center;
  width: 2.25rem;
  height: 2.25rem;
  background: var(--accent);
  color: #fff;
  border: var(--border-w) solid var(--line);
  border-radius: 8px;
}

.brand-name {
  font-weight: 800;
  font-size: 1.125rem;
  letter-spacing: -0.02em;
}

.tagline {
  margin: 0;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--ink-soft);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

@media (max-width: 480px) {
  .tagline {
    display: none;
  }
}
</style>
