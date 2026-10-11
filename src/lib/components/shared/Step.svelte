<script lang="ts">
  /** 解答手順の 1 ステップ（見出し + 式の行） */
  let { title, lines }: { title: string; lines: string[] } = $props();
</script>

<div class="sheet-step border-b border-slate-200 dark:border-slate-800 pb-3">
  <p class="font-bold mb-1">{title}</p>
  {#each lines as line, i (i)}
    <p class="font-mono pl-4 whitespace-pre-wrap">{line}</p>
  {/each}
</div>
