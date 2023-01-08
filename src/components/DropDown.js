import {
  Autocomplete,
  Button,
  Card,
  CardHeader,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  FormGroup,
  FormLabel,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { getClients, getNextClients } from "../firebase";
import { catchDuplicates } from "../utils/catchDuplicates";
import { customFilter } from "../utils/customFilter";
import PopUpFormForm from "./PopupForm";

export const DropDown = () => {
  const [selectedInfo, setSelectedInfo] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState([]);
  const [options, setOptions] = useState([]);
  const [checkBoxStates, setChecboxState] = useState([
    { state: true, id: "Nombre" },
    { state: false, id: "Razon social" },
    { state: false, id: "Telefono" },
    { state: false, id: "Codigo" },
    { state: false, id: "NIT" },
  ]);

  async function getFirstClients() {
    const res = await getClients();
    const options = catchDuplicates(res);
    setClients(options);
  }
  async function getNextClientsPage() {
    setLoading(true);
    const res = await getNextClients();
    console.log(res);
    if (!res === false) {
      setClients(res);
      setLoading(false);
    } else {
      setLoading(false);
    }
  }
  async function esElFinal() {
    let element = document.getElementById("scroll");
    if (element.offsetHeight + element.scrollTop >= element.scrollHeight) {
      getNextClientsPage();
    }
  }

  function onChangeSwitch(event) {
    setChecboxState(
      checkBoxStates.map((e) => {
        if (e.id === event.target.name) return { ...e, state: true };
        else return { ...e, state: false };
      })
    );
  }
  function getFilterType() {
    const filtered = checkBoxStates.filter((item) => item.state === true);
    return filtered[0].id.toLowerCase();
  }
  useEffect(() => {
    getFirstClients();
  }, []);

  useEffect(() => {
    setOptions(clients);
  }, [clients]);

  return (
    <>
      <Card sx={{ padding: 8, height: "50vh", textAlign: "left" }}>
        <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
          Tu Gerente challenge - Ignacio Romanow
        </Typography>
        <FormLabel>Filtrar por:</FormLabel>
        <FormGroup column="true" sx={{ maxHeight: "150px", padding: 0, mb: 5 }}>
          {checkBoxStates.map((checboxOption) => {
            return (
              <FormControlLabel
                key={checboxOption.id}
                control={
                  <Checkbox
                    checked={checboxOption.state}
                    onChange={onChangeSwitch}
                    name={checboxOption.id}
                  />
                }
                label={checboxOption.id}
              />
            );
          })}
        </FormGroup>
        <Autocomplete
          clearOnBlur
          id="dropdown"
          selectOnFocus
          closeText="true"
          options={options}
          loading={loading}
          handleHomeEndKeys
          value={selectedInfo}
          sx={{ width: "500px" }}
          loadingText={"Loading..."}
          ListboxProps={{ id: "scroll", onScroll: () => esElFinal() }}
          renderInput={(params) => (
            <TextField
              {...params}
              label={`Buscar por ${getFilterType()}`}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {loading ? (
                      <CircularProgress color="inherit" size={20} />
                    ) : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
          getOptionLabel={(option) => {
            if (typeof option === "string") {
              return option;
            }
            if (option.inputValue) {
              return option.inputValue;
            }
            if (option.info) {
              return option.info;
            } else if (option.info === " ") {
              return " ";
            }
            return option.nombre;
          }}
          onChange={(event, newValue) => {
            if (typeof newValue === "string") {
              setSelectedInfo({
                nombre: newValue,
              });
            } else if (newValue && newValue.inputValue) {
              setSelectedInfo({
                nombre: newValue.inputValue,
              });
            } else {
              setSelectedInfo(newValue);
            }
          }}
          filterOptions={(options, params) => {
            const { inputValue } = params;
            const filtered = customFilter(options, getFilterType(), inputValue);
            if (inputValue !== "" && filtered.length === 0) {
              filtered.push({
                inputValue,
                nombre: `Añadir "${inputValue}"`,
              });
            } else {
              filtered.unshift({
                inputValue: "",
                nombre: `Añadir usuario`,
              });
            }
            return filtered;
          }}
          renderOption={(props, option, params) => {
            const { inputValue } = params;
            if (option.nombre.startsWith("Añadir ")) {
              return (
                <Button
                  key="ButtonList"
                  onClick={(e) => {
                    e.preventDefault();
                    setOpen(true);
                    setSelectedInfo({
                      info: inputValue || " ",
                      type: getFilterType(),
                    });
                  }}
                  fullWidth
                >
                  {option.nombre}
                </Button>
              );
            }
            return (
              <li key={option.id} {...props}>
                {option.nombre}
              </li>
            );
          }}
        />
      </Card>
      <PopUpFormForm
        setClients={setClients}
        open={open}
        setOpen={setOpen}
        selectedInfo={selectedInfo}
      />
    </>
  );
};

export default DropDown;
