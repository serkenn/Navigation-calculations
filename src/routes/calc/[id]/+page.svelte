<script lang="ts">
  import { FileText, Info, ArrowLeft } from 'lucide-svelte';
  import { getCalculator } from '$lib/data/calculatorRegistry';
  // Import all calculator components
  import CourseDistanceCalc from '$lib/components/calculators/pilot1/CourseDistanceCalc.svelte';
  import CourseDistanceResult from '$lib/components/calculators/pilot1/CourseDistanceResult.svelte';
  import DeadReckoningCalc from '$lib/components/calculators/pilot1/DeadReckoningCalc.svelte';
  import DeadReckoningResult from '$lib/components/calculators/pilot1/DeadReckoningResult.svelte';
  import GreatCircleCalc from '$lib/components/calculators/pilot1/GreatCircleCalc.svelte';
  import GreatCircleResult from '$lib/components/calculators/pilot1/GreatCircleResult.svelte';
  import CompositeSailingCalc from '$lib/components/calculators/pilot1/CompositeSailingCalc.svelte';
  import CompositeSailingResult from '$lib/components/calculators/pilot1/CompositeSailingResult.svelte';
  import ETACalc from '$lib/components/calculators/pilot1/ETACalc.svelte';
  import ETAResult from '$lib/components/calculators/pilot1/ETAResult.svelte';
  import CMGSMGCalc from '$lib/components/calculators/pilot2/CMGSMGCalc.svelte';
  import CMGSMGResult from '$lib/components/calculators/pilot2/CMGSMGResult.svelte';
  import CourseToSteerCalc from '$lib/components/calculators/pilot2/CourseToSteerCalc.svelte';
  import CourseToSteerResult from '$lib/components/calculators/pilot2/CourseToSteerResult.svelte';
  import CourseSteerSMGCalc from '$lib/components/calculators/pilot2/CourseSteerSMGCalc.svelte';
  import CourseSteerSMGResult from '$lib/components/calculators/pilot2/CourseSteerSMGResult.svelte';
  import SetDriftCalc from '$lib/components/calculators/pilot2/SetDriftCalc.svelte';
  import SetDriftResult from '$lib/components/calculators/pilot2/SetDriftResult.svelte';
  import TrueWindCalc from '$lib/components/calculators/pilot2/TrueWindCalc.svelte';
  import TrueWindResult from '$lib/components/calculators/pilot2/TrueWindResult.svelte';
  import TideHeightCalc from '$lib/components/calculators/pilot2/TideHeightCalc.svelte';
  import TideHeightResult from '$lib/components/calculators/pilot2/TideHeightResult.svelte';
  import TidalStreamCalc from '$lib/components/calculators/pilot2/TidalStreamCalc.svelte';
  import TidalStreamResult from '$lib/components/calculators/pilot2/TidalStreamResult.svelte';
  import TwilightCalc from '$lib/components/calculators/astro/TwilightCalc.svelte';
  import TwilightResult from '$lib/components/calculators/astro/TwilightResult.svelte';
  import StarFinderCalc from '$lib/components/calculators/astro/StarFinderCalc.svelte';
  import StarFinderResult from '$lib/components/calculators/astro/StarFinderResult.svelte';
  import NauticalAlmanacCalc from '$lib/components/calculators/astro/NauticalAlmanacCalc.svelte';
  import NauticalAlmanacResult from '$lib/components/calculators/astro/NauticalAlmanacResult.svelte';
  import LOPCalc from '$lib/components/calculators/astro/LOPCalc.svelte';
  import LOPResult from '$lib/components/calculators/astro/LOPResult.svelte';
  import PositionFixCalc from '$lib/components/calculators/astro/PositionFixCalc.svelte';
  import PositionFixResult from '$lib/components/calculators/astro/PositionFixResult.svelte';
  import GyroAmplitudeCalc from '$lib/components/calculators/astro/GyroAmplitudeCalc.svelte';
  import GyroAmplitudeResult from '$lib/components/calculators/astro/GyroAmplitudeResult.svelte';
  import AltitudeCorrCalc from '$lib/components/calculators/sextant/AltitudeCorrCalc.svelte';
  import AltitudeCorrResult from '$lib/components/calculators/sextant/AltitudeCorrResult.svelte';
  import DistanceToObjectCalc from '$lib/components/calculators/sextant/DistanceToObjectCalc.svelte';
  import DistanceToObjectResult from '$lib/components/calculators/sextant/DistanceToObjectResult.svelte';
  import TimeToArcCalc from '$lib/components/calculators/timeArc/TimeToArcCalc.svelte';
  import TimeToArcResult from '$lib/components/calculators/timeArc/TimeToArcResult.svelte';
  import ArcToTimeCalc from '$lib/components/calculators/timeArc/ArcToTimeCalc.svelte';
  import ArcToTimeResult from '$lib/components/calculators/timeArc/ArcToTimeResult.svelte';
  import ToHMSCalc from '$lib/components/calculators/timeCalc/ToHMSCalc.svelte';
  import ToHMSResult from '$lib/components/calculators/timeCalc/ToHMSResult.svelte';
  import ToDecimalCalc from '$lib/components/calculators/timeCalc/ToDecimalCalc.svelte';
  import ToDecimalResult from '$lib/components/calculators/timeCalc/ToDecimalResult.svelte';
  import ArithmeticCalc from '$lib/components/calculators/timeCalc/ArithmeticCalc.svelte';
  import ArithmeticResult from '$lib/components/calculators/timeCalc/ArithmeticResult.svelte';
  import MeripassCalc from '$lib/components/calculators/exam/MeripassCalc.svelte';
  import MeripassResult from '$lib/components/calculators/exam/MeripassResult.svelte';

  let { data } = $props();
  let result: any = $state(null);
  let showMobileResult = $state(false);

  const calc = $derived(getCalculator(data.id));
  const sheetSubtitle = $derived(calc ? calc.nameEn : 'Navigation Form');

  // Reset result when calculator changes
  $effect(() => {
    data.id;
    result = null;
    showMobileResult = false;
  });

  function handleResult(r: any) {
    result = r;
    showMobileResult = true;
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      // mobile
    }
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  const componentMap: Record<string, { calc: any; result: any }> = {
    'course-distance': { calc: CourseDistanceCalc, result: CourseDistanceResult },
    'dead-reckoning': { calc: DeadReckoningCalc, result: DeadReckoningResult },
    'great-circle': { calc: GreatCircleCalc, result: GreatCircleResult },
    'composite-sailing': { calc: CompositeSailingCalc, result: CompositeSailingResult },
    'eta': { calc: ETACalc, result: ETAResult },
    'cmg-smg': { calc: CMGSMGCalc, result: CMGSMGResult },
    'course-to-steer': { calc: CourseToSteerCalc, result: CourseToSteerResult },
    'course-steer-smg': { calc: CourseSteerSMGCalc, result: CourseSteerSMGResult },
    'set-drift': { calc: SetDriftCalc, result: SetDriftResult },
    'true-wind': { calc: TrueWindCalc, result: TrueWindResult },
    'tide-height': { calc: TideHeightCalc, result: TideHeightResult },
    'tidal-stream': { calc: TidalStreamCalc, result: TidalStreamResult },
    'twilight': { calc: TwilightCalc, result: TwilightResult },
    'star-finder': { calc: StarFinderCalc, result: StarFinderResult },
    'nautical-almanac': { calc: NauticalAlmanacCalc, result: NauticalAlmanacResult },
    'lop': { calc: LOPCalc, result: LOPResult },
    'position-fix': { calc: PositionFixCalc, result: PositionFixResult },
    'gyro-amplitude': { calc: GyroAmplitudeCalc, result: GyroAmplitudeResult },
    'altitude-correction': { calc: AltitudeCorrCalc, result: AltitudeCorrResult },
    'distance-to-object': { calc: DistanceToObjectCalc, result: DistanceToObjectResult },
    'time-to-arc': { calc: TimeToArcCalc, result: TimeToArcResult },
    'arc-to-time': { calc: ArcToTimeCalc, result: ArcToTimeResult },
    'to-hms': { calc: ToHMSCalc, result: ToHMSResult },
    'to-decimal': { calc: ToDecimalCalc, result: ToDecimalResult },
    'arithmetic': { calc: ArithmeticCalc, result: ArithmeticResult },
    'meripass-3n': { calc: MeripassCalc, result: MeripassResult },
  };

  const components = $derived(componentMap[data.id]);
</script>

{#key data.id}
<!-- Left Panel (Input) -->
<div
  class="w-full lg:w-5/12 p-4 md:p-6 overflow-y-auto border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 h-full transition-colors {showMobileResult
    ? 'hidden lg:block'
    : 'block'}"
>
  {#if components}
    <svelte:component this={components.calc} onResult={handleResult} />
  {/if}
</div>

<!-- Right Panel (Output / Calculation Sheet) -->
<div
  class="w-full lg:w-7/12 p-8 md:p-10 border-l border-slate-200 dark:border-slate-800 overflow-y-auto font-mono relative shadow-inner min-h-[50vh] lg:h-full transition-colors bg-[#fffdf5] dark:bg-[#1a1c23] text-slate-800 dark:text-slate-200 {showMobileResult
    ? 'block h-full overflow-auto'
    : 'hidden lg:block'}"
>
  {#if showMobileResult}
    <button
      onclick={() => (showMobileResult = false)}
      class="lg:hidden absolute top-4 left-4 p-2 bg-slate-200 dark:bg-slate-800 rounded-full text-slate-700 dark:text-slate-300 shadow-sm z-50"
    >
      <ArrowLeft size={24} />
    </button>
  {/if}

  <div class="absolute top-6 right-6 opacity-5 pointer-events-none text-slate-800 dark:text-white">
    <FileText size={200} />
  </div>
  <div
    class="border-b-2 border-slate-800 dark:border-slate-500 pb-4 mb-8 flex justify-between items-end mt-8 lg:mt-0"
  >
    <h2 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
      Calculation Sheet
    </h2>
    <span class="text-xs font-sans text-slate-500 dark:text-slate-400">{sheetSubtitle}</span>
  </div>

  {#if !result}
    <div class="h-64 flex flex-col items-center justify-center text-slate-400 dark:text-slate-600">
      <Info size={48} class="mb-4 opacity-20" />
      <p>No Data Calculated</p>
    </div>
  {:else if components}
    <svelte:component this={components.result} {result} />
  {/if}
</div>
{/key}
