import React, { useEffect, useState } from "react";
import { GenerateProgramRule } from "../pages/GenerateProgramRule";
import { KiltCType, MultiCType, NUM_CALCULATE_OPERATOR, NUM_COMPARE_OPERATOR } from "./types";
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
interface Props {
  cTypeProps: KiltCType["metadata"]["properties"];
  ruleLength: number;
  open: boolean;
  toggle: () => void;
  updateRules: (arrIndex: number, rule: GenerateProgramRule) => void;
  updateStatus: (status: boolean) => void;
}
const CTypeMembershipRule: React.FC<Props> = ({ toggle, open, cTypeProps, ruleLength, updateRules, updateStatus }) => {
  const [addMembership, setAddMembership] = useState<KiltCType["metadata"]["properties"]>();
  const [isFinish, setIsFinish] = useState<boolean>(false);

  useEffect(() => {
    if (addMembership && Object.keys(addMembership).length) {
      setIsFinish(true);
    } else {
      setIsFinish(false);
    }
  }, [addMembership]);

  const handleAddRuleItem = (key: string) => {
    if (addMembership && addMembership[key]) {
      const newAdd = { ...addMembership };
      delete newAdd[key];
      setAddMembership(newAdd);
    } else {
      setAddMembership({
        ...addMembership,
        [key]: cTypeProps[key],
      });
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
          Membership
        </Typography>

        <Typography component="h5" variant="h5">
          Fields
        </Typography>
        <Divider />

        <List>
          {Object.keys(cTypeProps).map((item, index) => {
            const labelId = `checkbox-list-secondary-label-${item}`;
            return (
              <ListItem
                key={index}
                secondaryAction={
                  <Checkbox
                    edge="end"
                    onChange={() => handleAddRuleItem(item)}
                    checked={addMembership && addMembership[item] ? true : false}
                    inputProps={{ "aria-labelledby": labelId }}
                  />
                }
              >
                <ListItemText id={labelId} primary={item} onClick={() => {}} />
              </ListItem>
            );
          })}
        </List>
        <Typography component="h5" variant="h5">
          Rules
        </Typography>
        <Divider />

        <Box sx={{ marginTop: 2, width: "180px" }} display="flex" justifyContent="space-between" alignItems="center">
          <Button variant="contained" disabled={!isFinish}>
            Confirm
          </Button>
        </Box>
      </Paper>
    </Modal>
  );
};

export default CTypeMembershipRule;
