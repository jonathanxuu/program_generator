import React from "react";
import { useGenerator } from "../hooks/useGenerator";
import { GenerateProgramRule } from "../pages/GenerateProgramRule";
import Highlight from "react-highlight";
interface Props {
  leaves_number: number;
  rules: GenerateProgramRule[];
}
const Program: React.FC<Props> = ({ leaves_number, rules }) => {
  console.log("[ leaves_number in program ] >", leaves_number);
  const { program } = useGenerator(leaves_number, rules);
  return <Highlight className="">{program ? program : ""}</Highlight>;
};

export default Program;
