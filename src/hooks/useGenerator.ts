import { useEffect, useState } from "react";
import { auto_program_generater } from "../auto_generator";
import { GenerateProgramRule } from "../pages/GenerateProgramRule";

export function useGenerator(leaves_number: number, rules: GenerateProgramRule[]) {
  const [program, setProgram] = useState<string>();

  useEffect(() => {
    console.log("[ in generator rules ] >", rules);
    if (rules.length === 0) {
      setProgram(undefined);
    } else {
      let data = auto_program_generater(leaves_number, rules);
      setProgram(data);

      // .then((data) => {
      //   setProgram(data);
      // });
    }
  }, [leaves_number, rules]);

  return { program };
}
