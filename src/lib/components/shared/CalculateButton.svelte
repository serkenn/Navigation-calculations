<script lang="ts">
  import type { Component } from 'svelte';

  let { onclick, icon: Icon, label = '計算実行 (RUN)', color = 'from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600' }: {
    onclick: () => void;
    icon: Component;
    label?: string;
    color?: string;
  } = $props();
</script>

<button
  {onclick}
  class="w-full py-4 bg-gradient-to-r {color} text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex justify-center items-center gap-2"
>
  <Icon size={20} /> {label}
</button>
