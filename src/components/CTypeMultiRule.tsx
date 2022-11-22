import {
  Button,
  Checkbox,
  Divider,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Modal,
  OutlinedInput,
  Paper,
  Select,
  TextField,
  Typography,
  Box,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { GenerateProgramRule } from "../pages/GenerateProgramRule";
import { MultiCType, NUM_CALCULATE_OPERATOR, NUM_COMPARE_OPERATOR } from "./types";

interface Props {
  numberCType: MultiCType[];
  ruleLength: number;
  open: boolean;
  toggle: () => void;
  updateRules: (arrIndex: number, rule: GenerateProgramRule) => void;
  updateStatus: (status: boolean) => void;
}

const CTypeMultiRule: React.FC<Props> = ({ numberCType, updateRules, updateStatus, open, toggle }) => {
  const [addMulti, setAddMulti] = useState<MultiCType[]>([]);

  const [rule, setRule] = useState<GenerateProgramRule>({
    fields: [],
    operation: [],
    value: undefined,
  });

  const [isFinish, setIsFinish] = useState<boolean>(false);

  useEffect(() => {
    console.log("[ rule ] >", rule);
    if (rule.fields.length > 1 && rule.operation.length > 1 && rule.value) {
      setIsFinish(true);
    } else {
      setIsFinish(false);
    }
  }, [rule]);

  const handleAddRule = () => {
    updateRules(numberCType.length + 1, rule);
    updateStatus(true);
    toggle();
  };

  const handleChecked = (item: MultiCType) => {
    if (addMulti.includes(item)) {
      setRule({
        ...rule,
        fields: addMulti.filter((condition) => condition.fieldIndex !== item.fieldIndex).map((item) => item.fieldIndex),
      });
      setAddMulti(addMulti.filter((condition) => condition.fieldIndex !== item.fieldIndex));
    } else {
      const newArr = [...addMulti];
      newArr.push(item);
      const newFields = newArr.map((fItem) => {
        return fItem.fieldIndex;
      });
      setRule({ ...rule, fields: newFields });
      setAddMulti(newArr);
    }
  };

  return (
    <Modal open={open} onClose={toggle}>
      <Paper
        style={{
          position: "absolute" as "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 500,
          backgroundColor: "background.paper",
          padding: 20,
        }}
      >
        <Typography component="h4" variant="h4" align="center">
          Multi Condition
        </Typography>

        <Typography component="h5" variant="h5">
          Fields
        </Typography>
        <Divider />

        <List>
          {numberCType.map((item, index) => {
            const labelId = `checkbox-list-secondary-label-${item.fieldIndex}`;
            return (
              <ListItem
                key={index}
                secondaryAction={
                  <Checkbox
                    edge="end"
                    onChange={() => handleChecked(item)}
                    checked={addMulti.includes(item)}
                    inputProps={{ "aria-labelledby": labelId }}
                  />
                }
              >
                <ListItemText id={labelId} primary={item.fieldName} onClick={() => {}} />
              </ListItem>
            );
          })}
        </List>
        <Typography component="h5" variant="h5">
          Rules
        </Typography>
        <Divider />
        <Box sx={{ marginTop: 2 }}>
          <FormControl>
            <InputLabel id="operator-select-label2">Operator</InputLabel>
            <Select
              labelId="operator-select-label2"
              id="operator"
              value={rule.operation[0] ? rule.operation[0] : "None"}
              label="Operator"
              input={<OutlinedInput sx={{ width: 120 }} label="Operator" />}
            >
              {Object.keys(NUM_CALCULATE_OPERATOR).map((itemKey, index) => {
                let val = NUM_CALCULATE_OPERATOR[itemKey as keyof typeof NUM_CALCULATE_OPERATOR];
                return (
                  <MenuItem
                    key={index}
                    value={val}
                    onClick={() => {
                      const op: string[] = [...rule.operation];
                      op[0] = val;

                      setRule({
                        ...rule,
                        operation: op,
                      });
                    }}
                  >
                    {itemKey}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <FormControl>
            <InputLabel id="operator-select-label1">Operator</InputLabel>
            <Select
              labelId="operator-select-label1"
              id="operator"
              value={rule.operation[1] ? rule.operation[1] : "None"}
              label="Operator"
              input={<OutlinedInput sx={{ width: 120 }} label="Operator" />}
            >
              {Object.keys(NUM_COMPARE_OPERATOR).map((itemKey, index) => {
                let val = NUM_COMPARE_OPERATOR[itemKey as keyof typeof NUM_COMPARE_OPERATOR];
                return (
                  <MenuItem
                    key={index}
                    value={val}
                    onClick={() => {
                      const op: string[] = [...rule.operation];
                      op[1] = val;
                      setRule({
                        ...rule,
                        operation: op,
                      });
                    }}
                  >
                    {itemKey}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>

          <FormControl>
            <TextField
              type="number"
              placeholder="condition"
              value={rule.value || rule.value === 0 ? rule.value : ""}
              onChange={(e) => {
                if ((e.target.value as string).length === 0) {
                  setRule({
                    ...rule,
                    value: e.target.value,
                  });
                } else {
                  setRule({
                    ...rule,
                    value: Number(e.target.value),
                  });
                }
              }}
            />
          </FormControl>
          <Box sx={{ marginTop: 2, width: "180px" }} display="flex" justifyContent="space-between" alignItems="center">
            <Button variant="contained" disabled={!isFinish} onClick={handleAddRule}>
              Add Multi
            </Button>
          </Box>
        </Box>
      </Paper>
    </Modal>
  );
};

export default CTypeMultiRule;
