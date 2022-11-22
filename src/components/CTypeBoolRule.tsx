import { Box, FormControl, InputLabel, MenuItem, OutlinedInput, Select, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { GenerateProgramRule } from "../pages/GenerateProgramRule";
import { BOOL_OPERATOR, BOOL_OPERATOR_VALUES, RuleProps } from "./types";

const CTypeBoolRule: React.FC<RuleProps> = ({ field, arrIndex, updateRules, updateStatus, type }) => {
  const [ruleState, setRuleState] = useState<{
    isInputRule: boolean;
  }>({
    isInputRule: false,
  });

  useEffect(() => {
    if (ruleState.isInputRule) {
      updateStatus(true);
    } else {
      updateStatus(false);
    }
  }, [ruleState]);

  const [rule, setRule] = useState<GenerateProgramRule>({
    fields: [],
    operation: ["eq"],
  });

  useEffect(() => {
    console.log("[ in rule ] >", rule);
    if (rule?.fields && ruleState.isInputRule) {
      updateRules(arrIndex, rule);
    } else {
      updateRules(arrIndex, rule);
    }
  }, [rule]);

  const handleOperatorSelect = (val: BOOL_OPERATOR_VALUES, key: string) => {
    if (val !== "None") {
      const newFields = [];
      newFields.push(arrIndex);

      const newOp = [];
      newOp.push("eq");

      setRule({
        fields: newFields,
        operation: newOp,
        value: val,
      });

      setRuleState({
        isInputRule: true,
      });
    } else {
      setRule({
        fields: [],
        operation: [],
        value: undefined,
      });

      setRuleState({
        isInputRule: false,
      });
    }
  };

  return (
    <Box>
      <Typography variant="h5" component="h3">
        {field}[{type}]
      </Typography>
      <FormControl sx={{ marginBottom: 3, marginTop: 2 }}>
        <InputLabel id="operator-select-label">Value</InputLabel>
        <Select
          labelId="operator-select-label"
          id="operator"
          value={rule.value === 0 || rule.value === 1 ? rule.value : "None"}
          label="Value"
          size="small"
          input={<OutlinedInput sx={{ width: 120 }} label="Value" />}
        >
          {Object.keys(BOOL_OPERATOR).map((itemKey, index) => {
            let val = BOOL_OPERATOR[itemKey as keyof typeof BOOL_OPERATOR];
            return (
              <MenuItem key={index} value={val} onClick={() => handleOperatorSelect(val, itemKey)}>
                {itemKey}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </Box>
  );
};

export default CTypeBoolRule;
