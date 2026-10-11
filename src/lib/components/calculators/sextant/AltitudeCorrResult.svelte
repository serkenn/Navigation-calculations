<script lang="ts">
  import Sheet from '#lib/components/shared/Sheet.svelte';
  import ResultRows from '#lib/components/shared/ResultRows.svelte';
  import Highlight from '#lib/components/shared/Highlight.svelte';
  import { formatDMS } from '#lib/utils/navigationMath.js';

  let { result }: { result: any } = $props();

  const bodyName: Record<string, string> = {
    sun_lower: '太陽下辺',
    sun_upper: '太陽上辺',
    moon: '月下辺',
    star: '恒星',
    planet: '惑星',
  };
  const min = (v: number) => `${v >= 0 ? '+' : '−'}${Math.abs(v).toFixed(1)}'`;
</script>

<Sheet title="Altitude Corrections — {bodyName[result.bodyType]}">
  <ResultRows
    rows={[
      { label: '六分儀高度 Hs', value: formatDMS(result.rawHs) },
      ...(result.indexError
        ? [{ label: '器差 I.C.', value: min(result.indexError) }]
        : []),
      {
        label: `眼高差 Dip (眼高 ${result.heightOfEye} m)`,
        value: min(-result.dip),
      },
      { label: '視高度 Ha', value: formatDMS(result.ha) },
      { label: '大気差 Refraction', value: min(-result.refraction) },
      ...(result.parallax
        ? [{ label: '視差 Parallax', value: min(result.parallax) }]
        : []),
      ...(result.sdCorr
        ? [{ label: '視半径 S.D.', value: min(result.sdCorr) }]
        : []),
      {
        label: '改正総数 Total Corr.',
        value: min(result.totalCorr + (result.indexError ?? 0)),
        bold: true,
      },
    ]}
  />
  <Highlight items={[{ label: '真高度 Ho', value: formatDMS(result.ho) }]} />
</Sheet>
