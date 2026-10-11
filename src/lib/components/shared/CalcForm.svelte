<script lang="ts">
  import type { Snippet } from 'svelte';
  import { Calculator } from '@lucide/svelte';
  import { useAccent } from '#lib/theme/accent.js';

  /**
   * 入力フォーム全体。Enter キーでも計算を実行できる。
   * 送信時に空欄の数値・日付入力があれば計算せずにエラーを表示する。
   */
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

  let formEl: HTMLFormElement | undefined = $state();
  let emptyError = $state('');

  /** 入力欄の表示名（aria-label か、Field の見出し） */
  function inputName(input: HTMLInputElement) {
    return (
      input.getAttribute('aria-label') ??
      input.closest('label')?.querySelector('span')?.textContent?.trim() ??
      '入力欄'
    );
  }

  function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    if (!formEl) return;

    const inputs = [
      ...formEl.querySelectorAll<HTMLInputElement>(
        'input[type="number"], input[type="date"]',
      ),
    ];
    for (const input of inputs) input.removeAttribute('aria-invalid');

    // 空欄、または数値として読めない入力（"1e" など）
    const empty = inputs.filter(
      (input) => input.value === '' || input.validity.badInput,
    );
    if (empty.length > 0) {
      for (const input of empty) input.setAttribute('aria-invalid', 'true');
      const names = empty.slice(0, 3).map(inputName).join('、');
      const more = empty.length > 3 ? ` ほか ${empty.length - 3} 件` : '';
      emptyError = `未入力の項目があります: ${names}${more}`;
      empty[0].focus();
      return;
    }

    emptyError = '';
    onsubmit();
  }

  /** 入力し直したら、その欄の未入力マークを外す */
  function handleInput(e: Event) {
    (e.target as HTMLElement | null)?.removeAttribute('aria-invalid');
  }

  const message = $derived(emptyError || error);
</script>

<form
  bind:this={formEl}
  class="space-y-4 pb-20"
  onsubmit={handleSubmit}
  oninput={handleInput}
  novalidate
>
  {@render children()}

  {#if message}
    <p
      role="alert"
      class="text-sm text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-900/30 border border-rose-200 dark:border-rose-800 rounded-lg px-3 py-2"
    >
      {message}
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
