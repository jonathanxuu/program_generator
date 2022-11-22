import { ICTypeSchema, InstanceType } from "@kiltprotocol/sdk-js";
import { GenerateProgramRule } from "../pages/GenerateProgramRule";

export interface RuleProps {
  field: string;
  arrIndex: number;
  updateRules: (arrIndex: number, rule: GenerateProgramRule) => void;
  updateStatus: (status: boolean) => void;
  type: InstanceType;
}

export const NUM_CALCULATE_OPERATOR = {
  sum: "sum",
  average: "average",
  None: "None",
} as const;

export type NUM_CALCULATE_OPERATOR_KEYS = keyof typeof NUM_CALCULATE_OPERATOR;
export type NUM_CALCULATE_OPERATOR_VALUES = typeof NUM_CALCULATE_OPERATOR[NUM_CALCULATE_OPERATOR_KEYS];

export const STR_OPERATOR = {
  contain: "contain",
  startWith: "start with",
  endWith: "end with",
  None: "None",
} as const;

export type STR_OPERATOR_KEYS = keyof typeof STR_OPERATOR;
export type STR_OPERATOR_VALUES = typeof STR_OPERATOR[STR_OPERATOR_KEYS];

export const NUM_COMPARE_OPERATOR = {
  ">": "gt",
  ">=": "gte",
  "<=": "lte",
  "<": "lt",
  "≠": "neq",
  None: "None",
} as const;

export type NUM_COMPARE_OPERATOR_KEYS = keyof typeof NUM_COMPARE_OPERATOR;
export type NUM_COMPARE_OPERATOR_VALUES = typeof NUM_COMPARE_OPERATOR[NUM_COMPARE_OPERATOR_KEYS];

export const BOOL_OPERATOR = {
  true: 1,
  false: 0,
  None: "None",
} as const;

export type BOOL_OPERATOR_KEYS = keyof typeof BOOL_OPERATOR;
export type BOOL_OPERATOR_VALUES = typeof BOOL_OPERATOR[BOOL_OPERATOR_KEYS];

export type MultiCType = {
  fieldIndex: number;
  fieldName: string;
} & {
  $ref?: string;
  type?: InstanceType;
  format?: string;
};

export interface KiltCType {
  ctypeHash: string;
  metadata: ICTypeSchema;
  owner: string;
}
