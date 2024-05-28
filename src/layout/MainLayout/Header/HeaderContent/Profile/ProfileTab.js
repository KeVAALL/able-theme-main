import PropTypes from 'prop-types';
import { useState } from 'react';

// material-ui
import { List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';

// assets
import { Card, Edit2, Logout, Profile, Profile2User } from 'iconsax-react';
import { useNavigate } from 'react-router';
import { GetUser } from 'hooks/user/user';
import { toInteger } from 'lodash';

// ==============================|| HEADER PROFILE - PROFILE TAB ||============================== //

const ProfileTab = ({ handleLogout }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();
  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
  };

  return (
    <List component="nav" sx={{ p: 0, '& .MuiListItemIcon-root': { minWidth: 32 } }}>
      {/* <ListItemButton selected={selectedIndex === 0} onClick={(event) => handleListItemClick(event, 0)}>
        <ListItemIcon>
          <Edit2 variant="Bulk" size={18} />
        </ListItemIcon>
        <ListItemText primary="Edit Profile" />
      </ListItemButton> */}
      <ListItemButton
        selected={selectedIndex === 1}
        onClick={async (event) => {
          navigate('user/personal');
          handleListItemClick(event, 1);

          // const userID = localStorage.getItem('userID');

          // try {
          //   const payload = { user_id: toInteger(userID), method_name: 'get_user_by_id' };

          //   const data = await GetUser(payload);

          //   navigate('user/personal', { state: data });
          // } catch (err) {
          //   console.log(err);
          // }
        }}
      >
        <ListItemIcon>
          <Profile variant="Bulk" size={18} />
        </ListItemIcon>
        <ListItemText primary="View Profile" />
      </ListItemButton>

      <ListItemButton selected={selectedIndex === 3} onClick={(event) => handleListItemClick(event, 3)}>
        <ListItemIcon>
          <Profile2User variant="Bulk" size={18} />
        </ListItemIcon>
        <ListItemText primary="Social Profile" />
      </ListItemButton>
      {/* <ListItemButton selected={selectedIndex === 4} onClick={(event) => handleListItemClick(event, 4)}>
        <ListItemIcon>
          <Card variant="Bulk" size={18} />
        </ListItemIcon>
        <ListItemText primary="Billing" />
      </ListItemButton> */}
      <ListItemButton selected={selectedIndex === 2} onClick={handleLogout}>
        <ListItemIcon>
          <Logout variant="Bulk" size={18} />
        </ListItemIcon>
        <ListItemText primary="Logout" />
      </ListItemButton>
    </List>
  );
};

ProfileTab.propTypes = {
  handleLogout: PropTypes.func
};

export default ProfileTab;
