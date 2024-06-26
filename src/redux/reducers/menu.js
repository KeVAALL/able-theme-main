import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

// project-imports
import axios from 'utils/axios';

// initial state
const initialState = {
  openItem: ['dashboard'],
  openComponent: 'buttons',
  selectedID: null,
  drawerOpen: false,
  componentDrawerOpen: true,
  menu: [],
  menuItem: [],
  error: null
};

// ==============================|| SLICE - MENU ||============================== //

export const fetchMenu = createAsyncThunk('', async () => {
  const response = await axios.get('menu/getmenus');
  return response.data;
});

const menu = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    activeItem(state, action) {
      state.openItem = action.payload.openItem;
    },

    activeID(state, action) {
      state.selectedID = action.payload;
    },

    activeComponent(state, action) {
      state.openComponent = action.payload.openComponent;
    },

    openDrawer(state, action) {
      state.drawerOpen = action.payload;
    },

    openComponentDrawer(state, action) {
      state.componentDrawerOpen = action.payload.componentDrawerOpen;
    },

    hasError(state, action) {
      state.error = action.payload;
    },

    setMenuItems(state, action) {
      state.menuItem = action.payload;
    }
  },

  extraReducers(builder) {
    builder.addCase(fetchMenu.fulfilled, (state, action) => {
      state.menu = action.payload.dashboard;
    });
  }
});

export default menu.reducer;

export const { activeItem, activeComponent, openDrawer, openComponentDrawer, activeID, setMenuItems } = menu.actions;
