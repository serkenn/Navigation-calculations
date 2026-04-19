import { calculators } from "$lib/data/calculatorRegistry";

export function entries() {
  return calculators.map((c) => ({ id: c.id }));
}

export function load({ params }) {
  return { id: params.id };
}
