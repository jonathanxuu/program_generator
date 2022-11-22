import { Box, Button, Checkbox, List, ListItem, ListItemText, Typography } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import CTypeBoolRule from "../components/CTypeBoolRule";
import CTypeNumberRule from "../components/CTypeNumberRule";
import CTypeStringRule from "../components/CtypeStringRule";
import { GenerateProgramRule } from "./GenerateProgramRule";
import Program from "../components/Program";
import CTypeMultiRule from "../components/CTypeMultiRule";
import { KiltCType, MultiCType, NUM_COMPARE_OPERATOR } from "../components/types";
import { useToggle } from "../hooks/useToggle";
import CTypeMembershipRule from "../components/CTypeMembershipRule";

interface Props {
  cType: KiltCType;
}

const CTypeSingleRules: React.FC<Props> = ({ cType }) => {
  const [rules, setRules] = useState<GenerateProgramRule[]>([]);
  const [isFinish, setIsFinish] = useState<boolean>(false);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [addCTypeProps, setAddCTypeProps] = useState<typeof cType.metadata.properties>();
  const [numberCType, setNumberCType] = useState<MultiCType[]>([]);
  const [open, toggle] = useToggle();
  const [open1, toggle1] = useToggle();

  const cTypeProps = cType.metadata.properties;
  console.log("[ cTypeProps ] >", cTypeProps);

  useEffect(() => {
    setRules([]);
    setAddCTypeProps(undefined);
    setIsReady(false);
    setNumberCType([]);
  }, [cType]);

  useEffect(() => {
    const newCType: MultiCType[] = [];
    Object.keys(cTypeProps).map((key, index) => {
      if (cTypeProps[key].type === "integer") {
        newCType.push({
          fieldIndex: index,
          fieldName: key,
          ...cTypeProps[key],
        });
      }
    });
    setNumberCType(newCType);
  }, [cType]);

  useEffect(() => {
    console.log("[ numberCType ] >", numberCType);
  }, [numberCType]);

  useEffect(() => {
    let flag = false;
    for (let i = 0; i < rules.length; i++) {
      if (rules[i] && rules[i].operation.length) {
        if (rules[i].value?.toString().length) {
          flag = true;
        } else {
          flag = false;
          break;
        }
      }
    }
    setIsFinish(flag);
  }, [rules]);

  const updateRules = useCallback(
    (arrIndex: number, rule: GenerateProgramRule) => {
      console.log("[ old rules ] >", rules);
      const newRules = [...rules];
      newRules[arrIndex] = rule;
      if (rule.operation.length === 0) {
        console.log("[ delete rule ] >", rule);
        delete newRules[arrIndex];
      }
      console.log("[ newRules ] >", newRules);
      setRules(newRules);
    },
    [rules]
  );

  const updateStatus = useCallback((status: boolean) => {
    console.log("[ update status ] >", status);

    setIsFinish(status);
    if (!status) setIsReady(false);
  }, []);

  const handleSubmit = useCallback(() => {
    if (isFinish) {
      const newR: GenerateProgramRule[] = [];
      rules.forEach((item) => {
        item && newR.push(item) && console.log("[ item ] >", item);
      });
      setRules(newR);
      setIsReady(true);
    }
  }, [rules, isFinish]);

  const handleAddRuleItem = (key: string) => {
    if (addCTypeProps && addCTypeProps[key]) {
      const newAdd = { ...addCTypeProps };
      delete newAdd[key];
      setAddCTypeProps(newAdd);
      setIsReady(false);
    } else {
      setAddCTypeProps({
        ...addCTypeProps,
        [key]: cTypeProps[key],
      });
    }
  };

  return (
    <>
      <Box sx={{ width: 420 }}>
        <Typography component="h5" variant="h5">
          All Fields
        </Typography>
        <List sx={{ border: "1px dashed #000" }}>
          {Object.keys(cTypeProps).map((item, index) => {
            const labelId = `checkbox-list-secondary-label-${item}`;
            return (
              <ListItem
                key={index}
                secondaryAction={
                  <Checkbox
                    edge="end"
                    onChange={() => handleAddRuleItem(item)}
                    checked={addCTypeProps && addCTypeProps[item] ? true : false}
                    inputProps={{ "aria-labelledby": labelId }}
                  />
                }
              >
                <ListItemText
                  id={item}
                  primary={item}
                  onClick={() => {
                    // addCTypeProps.push(item);
                    // setAddCTypeProps()
                  }}
                />
              </ListItem>
            );
          })}
        </List>
        <CTypeMembershipRule
          cTypeProps={cTypeProps}
          ruleLength={rules.length}
          updateRules={updateRules}
          toggle={toggle1}
          updateStatus={updateStatus}
          open={open1}
        />
        {numberCType.length === 0 ? (
          ""
        ) : (
          <>
            <CTypeMultiRule
              numberCType={numberCType}
              ruleLength={rules.length}
              updateRules={updateRules}
              toggle={toggle}
              updateStatus={updateStatus}
              open={open}
            />
            <Button variant="contained" onClick={toggle}>
              Add Multi
            </Button>
            <Button variant="contained" onClick={toggle1}>
              Add Membership
            </Button>
            <Button variant="contained" onClick={() => {}}>
              Add Compare
            </Button>
          </>
        )}
      </Box>
      {addCTypeProps &&
        Object.keys(addCTypeProps).map((key, index) => {
          switch (addCTypeProps[key].type) {
            case "string":
              return (
                <CTypeStringRule
                  updateRules={updateRules}
                  updateStatus={updateStatus}
                  field={key}
                  key={index}
                  arrIndex={index}
                  type="string"
                />
              );
            case "integer":
              return (
                <CTypeNumberRule
                  updateRules={updateRules}
                  updateStatus={updateStatus}
                  field={key}
                  key={index}
                  arrIndex={index}
                  type="integer"
                />
              );
            case "boolean":
              return (
                <CTypeBoolRule
                  updateRules={updateRules}
                  updateStatus={updateStatus}
                  field={key}
                  key={index}
                  arrIndex={index}
                  type="boolean"
                />
              );
            default:
              return "";
          }
        })}

      {rules.map((ruleItem) => {
        if (ruleItem && ruleItem.fields.length > 1) {
          const val: string[] = [];
          ruleItem.fields.forEach((item) => {
            numberCType.filter((n) => n.fieldIndex === item).map((ni) => val.push(ni.fieldName));
          });
          console.log(ruleItem.operation[1]);

          let conKey = "";
          // let conVal = NUM_COMPARE_OPERATOR[ruleItem.operation[1] as keyof typeof NUM_COMPARE_OPERATOR];

          {
            Object.keys(NUM_COMPARE_OPERATOR).forEach((itemKey, index) => {
              let val = NUM_COMPARE_OPERATOR[itemKey as keyof typeof NUM_COMPARE_OPERATOR];
              val === ruleItem.operation[1] && (conKey = itemKey);
            });
          }

          return (
            <div>
              {`${ruleItem.operation[0]}(${val.toString()})`}
              {conKey}
              {ruleItem.value}
            </div>
          );
        }
      })}
      {addCTypeProps && Object.keys(addCTypeProps).length !== 0 && (
        <Button disabled={!isFinish} onClick={handleSubmit} variant="contained">
          Submit
        </Button>
      )}
      {isReady ? <Program leaves_number={Object.keys(cTypeProps).length} rules={rules} /> : ""}
    </>
  );
};

export default CTypeSingleRules;
