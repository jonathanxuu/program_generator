import { Add } from "@mui/icons-material";
import {
  Select,
  MenuItem,
  SelectChangeEvent,
  CircularProgress,
  FormControl,
  InputLabel,
  Container,
  Typography,
  Grid,
} from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { KiltCType } from "../components/types";
import { useCTypes } from "../hooks/useCTypes";
import CTypeSingleRules from "./CTypeSingleRule";

export interface GenerateProgramRule {
  fields: number[];
  operation: string[];
  value?: number | string;
}

const GenerateProgramRule: React.FC = () => {
  const { cTypes, loading } = useCTypes();
  const [title, setTitle] = useState<string>("");
  const [cType, setCType] = useState<KiltCType>();

  const handleChange = (event: SelectChangeEvent<typeof title>) => {
    setTitle(event.target.value);
  };

  useEffect(() => {
    console.log("[ cType ] >", cType);
  }, [cType]);

  return (
    <Container
      sx={{
        width: 470,
      }}
    >
      <Typography variant="h4" component="h4">
        Program Generator
      </Typography>

      <FormControl
        sx={{
          width: 488,
          marginBottom: 3,
          marginTop: 2,
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={10}>
            <InputLabel id="select-cType-label">credential type</InputLabel>
            <Select
              labelId="select-cType-label"
              id="select-cType"
              value={title}
              label="credential type"
              onChange={handleChange}
              sx={{ width: 420 }}
              disabled={loading}
            >
              {cTypes?.map((item, index) => {
                return (
                  <MenuItem key={index} value={item.metadata.title} onClick={() => setCType(item)}>
                    {item.metadata.title}
                  </MenuItem>
                );
              })}
            </Select>
          </Grid>
          <Grid item xs={1}>
            {loading ? <CircularProgress sx={{ marginTop: 1, marginLeft: 1 }} size={32} /> : ""}
          </Grid>
        </Grid>
      </FormControl>
      {cType ? (
        <>
          <CTypeSingleRules cType={cType} />
        </>
      ) : (
        ""
      )}
    </Container>
  );
};

export default GenerateProgramRule;
