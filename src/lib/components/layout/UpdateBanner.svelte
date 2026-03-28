<script lang="ts">
  import { X, Download } from 'lucide-svelte';
  import { updateChecker } from '$lib/stores/updateCheck.svelte';
</script>

{#if updateChecker.hasUpdate}
  <div class="fixed bottom-4 left-1/2 -translate-x-1/2 z-[100] max-w-md w-[calc(100%-2rem)] bg-blue-600 text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300" style="padding-bottom: max(0.75rem, var(--sab));">
    <Download size={20} class="shrink-0" />
    <div class="flex-1 text-sm">
      <span class="font-bold">v{updateChecker.latestVersion.replace(/^v/, '')}</span> が利用可能です
      <span class="text-blue-200 text-xs ml-1">(現在 {updateChecker.currentVersion})</span>
    </div>
    <a
      href={updateChecker.releaseUrl}
      target="_blank"
      rel="noopener noreferrer"
      class="shrink-0 px-3 py-1 bg-white text-blue-600 font-bold text-xs rounded-lg hover:bg-blue-50 transition-colors"
    >
      詳細
    </a>
    <button onclick={() => updateChecker.dismiss()} class="shrink-0 p-1 hover:bg-blue-500 rounded-full transition-colors">
      <X size={16} />
    </button>
  </div>
{/if}
