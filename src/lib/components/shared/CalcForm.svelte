<script lang="ts">
  import type { Snippet } from 'svelte';
  import { Calculator } from 'lucide-svelte';
  import { useAccent } from '#lib/theme/accent.js';

  /** 入力フォーム全体。Enter キーでも計算を実行できる */
  let {
    onsubmit,
    submitLabel = '計算実行',
    error = '',
    children,
  }: {
    onsubmit: () => void;
    submitLabel?: string;
    error?: string;
    children: Snippet;
  } = $props();

  const accent = useAccent();

  function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    onsubmit();
  }
</script>

<form class="space-y-4 pb-20" onsubmit={handleSubmit} novalidate>
  {@render children()}

  {#if error}
    <p
      role="alert"
      class="text-sm text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-900/30 border border-rose-200 dark:border-rose-800 rounded-lg px-3 py-2"
    >
      {error}
    </p>
  {/if}

  <button
    type="submit"
    class="w-full py-4 bg-gradient-to-r {accent()
      .button} text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex justify-center items-center gap-2"
  >
    <Calculator size={20} />
    {submitLabel}
  </button>
</form>
