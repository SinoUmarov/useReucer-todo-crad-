import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, Dialog, DialogActions, DialogContent, DialogTitle,
  Box, SwipeableDrawer, List, Divider, ListItem, ListItemButton, ListItemText, TextField
} from "@mui/material";
import { useReducer, useState } from "react";

// Reducer
function todoReducer(state, action) {
  switch (action.type) {
    case "delete":
      return state.filter((e) => e.id !== action.payload);
    case "add":
      return [
        ...state,
        {
          id: Date.now(),
          name: action.payload.name,
          age: Number(action.payload.age),
          complete: false,
        },
      ];
    case "edit":
      return state.map((todo) =>
        todo.id === action.payload.id
          ? { ...todo, name: action.payload.name, age: Number(action.payload.age) }
          : todo
      );
    case "TOGGLE":
      return state.map((todo) =>
        todo.id === action.payload ? { ...todo, complete: !todo.complete } : todo
      );
    default:
      return state;
  }
}

export default function App() {
  const [todos, dispatch] = useReducer(todoReducer, [
    { name: "Ali", age: 12, complete: true, id: 1 },
    { name: "Maga", age: 15, complete: false, id: 4 },
    { name: "Gapizuer", age: 17, complete: false, id: 5 },
  ]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [drawerState, setDrawerState] = useState({ right: false });
  const [formData, setFormData] = useState({ name: "", age: "", id: null });

  const openAddDialog = () => {
    setFormData({ name: "", age: "", id: null });
    setDialogOpen(true);
  };

  const openEditDialog = (todo) => {
    setFormData({
      name: todo.name,
      age: String(todo.age),
      id: todo.id,
    });
    setDialogOpen(true);
  };

  const closeDialog = () => setDialogOpen(false);

  const handleSave = () => {
    const { name, age, id } = formData;
    if (name.trim() && age.trim()) {
      if (id === null) {
        dispatch({ type: "add", payload: formData });
      } else {
        dispatch({ type: "edit", payload: formData });
      }
      closeDialog();
    }
  };

  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) {
      return;
    }
    setDrawerState({ ...drawerState, [anchor]: open });
  };

  const renderDrawerList = (anchor) => (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        {todos.map((element) => (
          <ListItem key={element.id} disablePadding>
            <ListItemButton>
              <ListItemText
                primary={`Name: ${element.name}`}
                secondary={`Status: ${element.complete ? "active" : "inactive"}, Age: ${element.age}`}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
    </Box>
  );

  return (
    <TableContainer component={Paper} sx={{ p:-1 }}>
      <Button variant="contained" onClick={openAddDialog}>
        + Add
      </Button>
      <Table sx={{ minWidth: 620 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell align="right">Name</TableCell>
            <TableCell align="right">Age</TableCell>
            <TableCell align="right">Complete</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {todos.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.id}</TableCell>
              <TableCell align="right">{row.name}</TableCell>
              <TableCell align="right">{row.age}</TableCell>
              <TableCell align="right">
                {row.complete ? "active" : "inactive"}
              </TableCell>
              <TableCell align="right">
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => dispatch({ type: "delete", payload: row.id })}
                >
                  Delete
                </Button>{" "}
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => openEditDialog(row)}
                >
                  Edit
                </Button>{" "}
                <Button
                  variant="contained"
                  color="info"
                  onClick={toggleDrawer("right", true)}
                >
                  Info
                </Button>{" "}
                <Button
                  variant="contained"
                  color="warning"
                  onClick={() => dispatch({ type: "TOGGLE", payload: row.id })}
                >
                  Complete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

    
      <Dialog open={dialogOpen} onClose={closeDialog}>
        <DialogTitle>{formData.id === null ? "Add New User" : "Edit User"}</DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 2, width: 300 }}
        >
          <TextField
            label="Name"
            variant="outlined"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <TextField
            label="Age"
            type="number"
            variant="outlined"
            value={formData.age}
            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>Close</Button>
          <Button onClick={handleSave} autoFocus>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <SwipeableDrawer
        anchor="right"
        open={drawerState["right"]}
        onClose={toggleDrawer("right", false)}
        onOpen={toggleDrawer("right", true)}
      >
        {renderDrawerList("right")}
      </SwipeableDrawer>
    </TableContainer>
  );
}
