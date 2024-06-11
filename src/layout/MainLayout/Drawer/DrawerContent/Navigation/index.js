import { useEffect, useLayoutEffect, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Typography, useMediaQuery } from '@mui/material';
import {
  HomeTrendUp,
  Profile2User,
  ShoppingBag,
  Bank,
  Add,
  UserCirlceAdd,
  MenuBoard,
  MoneySend,
  StatusUp,
  User,
  Convert,
  Tag,
  Moneys,
  ArrangeHorizontalCircle,
  Document,
  DirectInbox,
  Note,
  Note1,
  UserOctagon
} from 'iconsax-react';

// project-imports
import NavGroup from './NavGroup';
// import menuItem from 'menu-items';
import { Menu } from 'menu-items/dashboard';

import { useSelector } from '../../../../../redux';
import useConfig from 'hooks/useConfig';
import { HORIZONTAL_MAX_ITEM } from 'config';
import { MenuOrientation } from 'config';

// ==============================|| DRAWER CONTENT - NAVIGATION ||============================== //

const Navigation = () => {
  const theme = useTheme();
  const { menuItem } = useSelector((state) => state.menu);
  // console.log(menuItem);
  const icons = {
    Add: Add,
    ArrangeHorizontalCircle: ArrangeHorizontalCircle,
    Bank: Bank,
    Document: Document,
    DirectInbox: DirectInbox,
    HomeTrendUp: HomeTrendUp,
    Moneys: Moneys,
    MenuBoard: MenuBoard,
    MoneySend: MoneySend,
    Note: Note,
    Note1: Note1,
    Profile2User: Profile2User,
    ShoppingBag: ShoppingBag,
    StatusUp: StatusUp,
    Tag: Tag,
    User: User,
    UserCirlceAdd: UserCirlceAdd,
    UserOctagon: UserOctagon
  };

  const downLG = useMediaQuery(theme.breakpoints.down('lg'));

  const { menuOrientation } = useConfig();
  const { drawerOpen } = useSelector((state) => state.menu);

  const [selectedItems, setSelectedItems] = useState('');
  const [selectedLevel, setSelectedLevel] = useState(0);
  // const [menuItems, setMenuItems] = useState({ items: [] });
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    handlerMenuItem();
    // eslint-disable-next-line
  }, []);

  useLayoutEffect(() => {
    setMenuItems(menuItem);
    // eslint-disable-next-line
  }, [menuItem]);

  let getMenu = Menu();
  const handlerMenuItem = () => {
    // const isFound = menuItem.items.some((element) => {
    //   if (element.id === 'group-dashboard') {
    //     return true;
    //   }
    //   return false;
    // });
    const isFound = menuItem.some((element) => {
      if (element.id === 'group-dashboard') {
        return true;
      }
      return false;
    });

    if (getMenu?.id !== undefined && !isFound) {
      // menuItem.items.splice(0, 0, getMenu);
      menuItem.splice(0, 0, getMenu);
      console.log('Set Menu' + menuItem);
      setMenuItems(menuItem);
    }
  };

  const isHorizontal = menuOrientation === MenuOrientation.HORIZONTAL && !downLG;

  const lastItem = isHorizontal ? HORIZONTAL_MAX_ITEM : null;
  let lastItemIndex = menuItems.length - 1; //0
  // let lastItemIndex = menuItems.items.length - 1;
  let remItems = [];
  let lastItemId;

  // if (lastItem && lastItem < menuItems.items.length) {
  if (lastItem && lastItem < menuItems.length) {
    // lastItemId = menuItems.items[lastItem - 1].id;
    lastItemId = menuItems[lastItem - 1].id;
    lastItemIndex = lastItem - 1;
    // remItems = menuItems.items.slice(lastItem - 1, menuItems.items.length).map((item) => ({
    remItems = menuItems.slice(lastItem - 1, menuItems.length).map((item) => ({
      title: item.title,
      elements: item.children,
      icon: item.icon
    }));
    console.log(remItems);
  }

  // const navGroups = menuItems.items.slice(0, lastItemIndex + 1).map((item) => {
  // console.log(menuItems);
  // console.log(menuItems.slice(0, lastItemIndex + 1));
  const navGroups = menuItems.slice(0, lastItemIndex + 1).map((item) => {
    // const navGroups = menuItems.map((item) => {
    switch (item.type) {
      case 'group':
        return (
          <NavGroup
            key={item.id}
            setSelectedItems={setSelectedItems}
            setSelectedLevel={setSelectedLevel}
            selectedLevel={selectedLevel}
            selectedItems={selectedItems}
            lastItem={lastItem}
            remItems={remItems}
            lastItemId={lastItemId}
            item={item}
            icons={icons}
          />
        );
      default:
        return (
          <Typography key={item.id} variant="h6" color="error" align="center">
            Fix - Navigation Group
          </Typography>
        );
    }
  });
  return (
    <Box
      sx={{
        pt: drawerOpen ? (isHorizontal ? 0 : 2) : 0,
        '& > ul:first-of-type': { mt: 0 },
        display: isHorizontal ? { xs: 'block', lg: 'flex' } : 'block'
      }}
    >
      {navGroups}
    </Box>
  );
};

export default Navigation;
