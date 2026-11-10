<template>
  <header class="site-header">
    <div class="brand">
      <span class="brand-mark" aria-hidden="true">
        <Question :size="24" :weight="'bold'" />
      </span>
      <span class="brand-name">The Quiz</span>
    </div>
    <div class="header-right">
      <p class="tagline">Test your knowledge</p>
      <button
        type="button"
        class="theme-toggle"
        :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
        :title="isDark ? 'Light mode' : 'Dark mode'"
        @click="toggleTheme"
      >
        <Sun v-if="isDark" :size="20" :weight="'bold'" />
        <Moon v-else :size="20" :weight="'bold'" />
      </button>
    </div>
  </header>
</template>

<script>
import { PhQuestion as Question, PhSun as Sun, PhMoon as Moon } from "@phosphor-icons/vue";

export default {
  components: { Question, Sun, Moon },
  data() {
    return {
      isDark: document.documentElement.dataset.theme === "dark",
    };
  },
  methods: {
    toggleTheme() {
      this.isDark = !this.isDark;
      const theme = this.isDark ? "dark" : "light";
      document.documentElement.dataset.theme = theme;
      localStorage.setItem("theme", theme);
    },
  },
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

.header-right {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.tagline {
  margin: 0;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--ink-soft);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.theme-toggle {
  display: grid;
  place-items: center;
  width: 2.25rem;
  height: 2.25rem;
  background: var(--card);
  color: var(--ink);
  border: var(--border-w) solid var(--line);
  border-radius: 8px;
  transition: background-color 0.15s ease, transform 0.15s ease;
}

.theme-toggle:hover {
  background: var(--gold);
  color: #1d1a13;
}

.theme-toggle:active {
  transform: translateY(1px);
}

@media (max-width: 480px) {
  .tagline {
    display: none;
  }
}
</style>
