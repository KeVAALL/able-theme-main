// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { Story, Fatrows, PresentionChart } from 'iconsax-react';

// icons
const icons = {
  widgets: Story,
  data: Fatrows
};

// ==============================|| MENU ITEMS - WIDGETS ||============================== //

const form = {
  id: 'group-form',
  title: <FormattedMessage id="form" />,
  icon: icons.widgets,
  type: 'group',
  children: [
    {
      id: 'form',
      title: <FormattedMessage id="Form" />,
      type: 'item',
      url: '/form/basic',
      icon: icons.data
    }
  ]
};

export default form;
