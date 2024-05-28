import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import { List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';

// assets
import { CardCoin, Lock, Profile, Setting3 } from 'iconsax-react';

function getPathIndex(pathname) {
  let selectedTab = 0;
  switch (pathname) {
    // case 'user/payment':
    //   selectedTab = 1;
    //   break;
    case '/user/password':
      selectedTab = 2;
      break;
    case '/user/settings':
      selectedTab = 3;
      break;
    case '/user/personal':
    default:
      selectedTab = 0;
  }
  return selectedTab;
}

// ==============================|| USER PROFILE - BASIC ||============================== //

const ProfileTab = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [selectedIndex, setSelectedIndex] = useState(getPathIndex(pathname));
  const handleListItemClick = (index, route) => {
    setSelectedIndex(index);
    navigate(route);
  };

  useEffect(() => {
    setSelectedIndex(getPathIndex(pathname));
  }, [pathname]);

  return (
    <List component="nav" sx={{ p: 0, '& .MuiListItemIcon-root': { minWidth: 32, color: theme.palette.secondary.main } }}>
      <ListItemButton selected={selectedIndex === 0} onClick={() => handleListItemClick(0, 'personal')}>
        <ListItemIcon>
          <Profile size={18} />
        </ListItemIcon>
        <ListItemText primary="Personal Information" />
      </ListItemButton>
      {/* <ListItemButton selected={selectedIndex === 1} onClick={() => handleListItemClick(1, '/apps/profiles/user/payment')}>
        <ListItemIcon>
          <CardCoin size={18} />
        </ListItemIcon>
        <ListItemText primary="Payment" />
      </ListItemButton> */}
      <ListItemButton selected={selectedIndex === 2} onClick={() => handleListItemClick(2, 'password')}>
        <ListItemIcon>
          <Lock size={18} />
        </ListItemIcon>
        <ListItemText primary="Change Password" />
      </ListItemButton>
      <ListItemButton selected={selectedIndex === 3} onClick={() => handleListItemClick(3, 'settings')}>
        <ListItemIcon>
          <Setting3 size={18} />
        </ListItemIcon>
        <ListItemText primary="Settings" />
      </ListItemButton>
    </List>
  );
};

export default ProfileTab;
