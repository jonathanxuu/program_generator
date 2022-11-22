import { Box, FormControl, InputLabel, MenuItem, OutlinedInput, Select, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { GenerateProgramRule } from "../pages/GenerateProgramRule";
import { NUM_COMPARE_OPERATOR, NUM_COMPARE_OPERATOR_VALUES, RuleProps } from "./types";

const CTypeNumberRule: React.FC<RuleProps> = ({ field, arrIndex, updateRules, updateStatus, type }) => {
  const [ruleState, setRuleState] = useState<{
    isSelect: boolean;
    isInputRule: boolean;
  }>({
    isSelect: false,
    isInputRule: false,
  });

  useEffect(() => {
    if (ruleState.isInputRule && ruleState.isSelect) {
      updateStatus(true);
    } else {
      updateStatus(false);
    }
  }, [ruleState]);

  const [rule, setRule] = useState<GenerateProgramRule>({
    fields: [],
    operation: [],
  });

  useEffect(() => {
    if (rule.fields.length && ruleState.isInputRule) {
      console.log("[ waiting update rule 1 is ] >", rule);
      updateRules(arrIndex, rule);
    } else {
      console.log("[ waiting update rule 2 is ] >", rule);
      updateRules(arrIndex, rule);
    }
  }, [rule]);

  const handleRuleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if ((e.target.value as string).length === 0) {
      setRuleState({
        ...ruleState,
        isInputRule: false,
      });

      setRule({
        ...rule,
        value: e.target.value,
      });
    } else {
      setRule({
        ...rule,
        value: Number(e.target.value),
      });

      setRuleState({
        ...ruleState,
        isInputRule: true,
      });
    }
  };

  const handleOperatorSelect = (val: NUM_COMPARE_OPERATOR_VALUES, key: string) => {
    if (val !== "None") {
      setRule({
        ...rule,
        fields: [arrIndex],
        operation: [NUM_COMPARE_OPERATOR[key as keyof typeof NUM_COMPARE_OPERATOR]],
      });

      setRuleState({
        ...ruleState,
        isSelect: true,
      });
    } else {
      setRule({
        fields: [],
        operation: [],
        value: undefined,
      });

      setRuleState({
        ...ruleState,
        isSelect: false,
        isInputRule: false,
      });
    }
  };

  return (
    <Box>
      <Typography variant="h5" component="h3">
        {field}[{type}]
      </Typography>
      <FormControl sx={{ marginBottom: 3, marginTop: 2 }} component="fieldset">
        <InputLabel id="operator-select-label">Operator</InputLabel>
        <Select
          labelId="operator-select-label"
          id="operator"
          value={rule.operation[0] ? rule.operation[0] : "None"}
          label="Operator"
          size="small"
          input={<OutlinedInput sx={{ width: 120 }} label="Operator" />}
        >
          {Object.keys(NUM_COMPARE_OPERATOR).map((itemKey, index) => {
            let val = NUM_COMPARE_OPERATOR[itemKey as keyof typeof NUM_COMPARE_OPERATOR];
            return (
              <MenuItem key={index} value={val} onClick={() => handleOperatorSelect(val, itemKey)}>
                {itemKey}
              </MenuItem>
            );
          })}
        </Select>
        {ruleState.isSelect && (
          <TextField
            sx={{ width: 320, marginTop: 1 }}
            size="small"
            type="number"
            disabled={!ruleState.isSelect}
            placeholder="condition"
            value={rule.value || rule.value === 0 ? rule.value : ""}
            onChange={handleRuleInput}
            error={ruleState.isSelect && !ruleState.isInputRule}
            helperText={ruleState.isSelect && !ruleState.isInputRule ? "Please enter a value or select none " : ""}
          />
        )}
      </FormControl>
    </Box>
  );
};

export default CTypeNumberRule;
