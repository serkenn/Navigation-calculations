import { calculators } from "#lib/data/calculatorRegistry.js";

export function entries() {
  return calculators.map((c) => ({ id: c.id }));
}

export function load({ params }) {
  return { id: params.id };
}
