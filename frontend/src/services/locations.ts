export type StateCode = string;

export const STATES: { code: StateCode; name: string }[] = [
  { code: "RI", name: "Rhode Island" },
];

export const CITIES_BY_STATE: Record<StateCode, string[]> = {
  RI: ["Providence"],
};
