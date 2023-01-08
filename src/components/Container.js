import DropDown from "./DropDown";
import { Grid } from "@mui/material";
export const Container = () => {
  return (
    <Grid container justifyContent="center" alignItems="center" p="16px">
      <DropDown />
    </Grid>
  );
};
