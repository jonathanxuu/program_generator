import { Button } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import CTypeBoolRule from "../components/CTypeBoolRule";
import CTypeNumberRule from "../components/CTypeNumberRule";
import CTypeStringRule from "../components/CtypeStringRule";
import { GenerateProgramRule } from "./GenerateProgramRule";
import Program from "../components/Program";
import { KiltCType } from "../components/types";

interface Props {
  cType: KiltCType;
}

const CTypeRules: React.FC<Props> = ({ cType }) => {
  const [rules, setRules] = useState<GenerateProgramRule[]>([]);
  const [isFinish, setIsFinish] = useState<boolean>(false);
  const [isReady, setIsReady] = useState<boolean>(false);

  const cTypeProps = cType.metadata.properties;

  useEffect(() => {
    setRules([]);
  }, [cType]);

  useEffect(() => {
    let flag = false;
    console.log("[ testing ] >", rules);
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
    console.log("[ flag ] >", flag);
    setIsFinish(flag);
    console.log("[ rules ] >", rules);
  }, [rules]);

  const updateRules = useCallback(
    (arrIndex: number, rule: GenerateProgramRule) => {
      setIsReady(false);
      console.log("[ old rules ] >", rules);
      const newRules = [...rules];
      console.log("[ rule ] >", rule);
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

  return (
    <>
      {Object.keys(cTypeProps).map((key, index) => {
        switch (cTypeProps[key].type) {
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
      <Button disabled={!isFinish} onClick={handleSubmit} variant="contained">
        Submit
      </Button>
      {isReady ? <Program leaves_number={Object.keys(cTypeProps).length} rules={rules} /> : ""}
    </>
  );
};

export default CTypeRules;
