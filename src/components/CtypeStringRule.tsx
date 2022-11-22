import { Box, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { GenerateProgramRule } from "../pages/GenerateProgramRule";
import { RuleProps, STR_OPERATOR, STR_OPERATOR_VALUES } from "./types";

const CTypeStringRule: React.FC<RuleProps> = ({ field, arrIndex, updateRules, updateStatus, type }) => {
  const [ruleState, setRuleState] = useState<{
    isSelect: boolean;
    isInputRule: boolean;
  }>({
    isSelect: false,
    isInputRule: false,
  });

  const [rule, setRule] = useState<GenerateProgramRule>({
    fields: [],
    operation: [],
  });

  useEffect(() => {
    if (ruleState.isInputRule && ruleState.isSelect) {
      updateStatus(true);
    } else {
      updateStatus(false);
    }
  }, [ruleState]);

  useEffect(() => {
    if (rule?.fields && ruleState.isInputRule) {
      updateRules(arrIndex, rule);
    } else {
      updateRules(arrIndex, rule);
    }
  }, [rule]);

  const handleRuleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.target.value.length === 0) {
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
        value: e.target.value,
      });

      setRuleState({
        ...ruleState,
        isInputRule: true,
      });
    }
  };

  const handleOperatorSelect = (val: STR_OPERATOR_VALUES, key: string) => {
    if (val !== "None") {
      setRule({
        ...rule,
        fields: [arrIndex],
        operation: [STR_OPERATOR[key as keyof typeof STR_OPERATOR]],
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
      <FormControl>
        <InputLabel id="operator-select-label">Operator</InputLabel>
        <Select
          sx={{ width: 120 }}
          labelId="operator-select-label"
          id="operator"
          value={rule.operation[0] ? rule.operation[0] : "None"}
          label="Operator"
          size="small"
        >
          {Object.keys(STR_OPERATOR).map((itemKey, index) => {
            let val = STR_OPERATOR[itemKey as keyof typeof STR_OPERATOR];
            return (
              <MenuItem key={index} value={val} onClick={() => handleOperatorSelect(val, itemKey)}>
                {itemKey}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
      <FormControl>
        {ruleState.isSelect && (
          <TextField
            sx={{ width: 300 }}
            size="small"
            type="text"
            disabled={!ruleState.isSelect}
            placeholder="condition"
            value={rule.value ? rule.value : ""}
            onChange={handleRuleInput}
            error={ruleState.isSelect && !ruleState.isInputRule}
            helperText={ruleState.isSelect && !ruleState.isInputRule ? "Please enter a value or select none " : ""}
          />
        )}
      </FormControl>
    </Box>
  );
};

export default CTypeStringRule;
