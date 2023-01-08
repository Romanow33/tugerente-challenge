import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slide,
  TextField,
} from "@mui/material";
import { Stack } from "@mui/system";
import { forwardRef, useEffect, useState } from "react";
import { postClient } from "../firebase";
const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
export const PopUpFormForm = ({ open, setOpen, selectedInfo, setClients }) => {
  const [initialData, setInitialData] = useState({
    nombre: "",
    razonSocial: "",
    telefono: "",
    codigo: "",
    nit: "",
  });
  const [loading, setLoading] = useState(false);
  const addClient = async (clientObject) => {
    const res = await postClient(clientObject);
    return res;
  };
  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    const res = await addClient(initialData);
    console.log(res);
    const { codigo, nit, nombre, razonSocial, telefono } = initialData;
    setClients((clients) => [
      ...clients,
      { codigo, nit, nombre, razonSocial, telefono, id: res },
    ]);
    handleClose();
    alert("Usuario creado con exito: ", res);
    setLoading(false);
  };
  const handleChange = (e) => {
    setInitialData({
      ...initialData,
      [e.target.name]: e.target.value,
    });
  };
  const handleClose = () => {
    setOpen(false);
    setInitialData({
      nombre: "",
      razonSocial: "",
      telefono: "",
      codigo: "",
      nit: "",
    });
  };

  useEffect(() => {
    if (selectedInfo) {
      if (selectedInfo.type === "razon social")
        selectedInfo.type = "razonSocial";
      setInitialData({
        [selectedInfo.type]: selectedInfo.info,
      });
    }
    return () => {
      setInitialData((initialData) => initialData);
    };
  }, [selectedInfo]);

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle sx={{ textAlign: "center" }}>
        ¿Desea agregar un nuevo usuario?
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ padding: 5 }}>
          <Stack
            justifyContent={"space-between"}
            alignItems="space-between"
            container="true"
            rowGap={1}
            padding={0}
          >
            <TextField
              name="nombre"
              type="text"
              label="Nombre"
              value={initialData.nombre}
              onChange={handleChange}
            />
            <TextField
              name="razonSocial"
              type="text"
              label="Razon social"
              value={initialData.razonSocial}
              onChange={handleChange}
            />
            <TextField
              name="telefono"
              type="tel"
              label="Telefono"
              value={initialData.telefono}
              onChange={handleChange}
            />
            <TextField
              name="nit"
              type="text"
              label="NIT"
              value={initialData.nit}
              onChange={handleChange}
            />
            <TextField
              name="codigo"
              type="number"
              label="Codigo"
              InputProps={{ inputProps: { min: 0 } }}
              value={initialData.codigo}
              onChange={handleChange}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button variant="contained" type="submit">
            {loading ? (
              <CircularProgress
                size={"medium"}
                color="info"
                sx={{ zIndex: "999" }}
              />
            ) : (
              "Agregar"
            )}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default PopUpFormForm;
