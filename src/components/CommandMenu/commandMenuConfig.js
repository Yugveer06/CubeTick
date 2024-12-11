import {
  IconCube,
  IconDeviceDesktop,
  IconForms,
  IconHome,
  IconPerspective,
  IconPlus,
  IconReload,
  IconSquare,
  IconTrash,
} from "@tabler/icons-react";

export const MENU_PAGES = {
  HOME: 'home',
  DELETE_SOLVE: 'delete solve',
  THEME: 'theme',
  SCRAMBLE_VISUALIZATION: 'scramble visualization',
  CREATE_SESSION: 'create session',
  RENAME_SESSION: 'rename session',
  DELETE_SESSION: 'delete session',
};

// Define nested items for each menu item that has children
export const NESTED_ITEMS = {
  [MENU_PAGES.THEME]: [
    { label: 'Light Theme', keywords: 'light bright white day mode' },
    { label: 'Dark Theme', keywords: 'dark night black mode' }
  ],
  [MENU_PAGES.SCRAMBLE_VISUALIZATION]: [
    { label: '2D', keywords: '2d flat visualization' },
    { label: '3D', keywords: '3d cube visualization' }
  ]
};

export const getMainMenuItems = (handlers) => [
  {
    icon: IconReload,
    label: 'Generate Scramble',
    keywords: 'new refresh scramble generate',
    onSelect: () => {
      handlers.generateScramble();
      handlers.setOpen(false);
    },
  },
  {
    icon: IconTrash,
    label: 'Delete Solve',
    keywords: 'remove delete solve time',
    onSelect: () => handlers.navigateToPage(MENU_PAGES.DELETE_SOLVE),
  },
  {
    icon: IconDeviceDesktop,
    label: 'Theme',
    keywords: 'theme appearance light dark mode color',
    onSelect: () => handlers.navigateToPage(MENU_PAGES.THEME),
    children: NESTED_ITEMS[MENU_PAGES.THEME]
  },
  {
    icon: IconPerspective,
    label: 'Scramble Visualization',
    keywords: 'view cube 2d 3d display scramble',
    onSelect: () => handlers.navigateToPage(MENU_PAGES.SCRAMBLE_VISUALIZATION),
    children: NESTED_ITEMS[MENU_PAGES.SCRAMBLE_VISUALIZATION]
  },
  {
    icon: IconPlus,
    label: 'Create New Session',
    keywords: 'new create add session',
    onSelect: () => handlers.navigateToPage(MENU_PAGES.CREATE_SESSION),
  },
  {
    icon: IconForms,
    label: 'Rename Session',
    keywords: 'rename change session name',
    onSelect: () => handlers.navigateToPage(MENU_PAGES.RENAME_SESSION),
  },
  {
    icon: IconTrash,
    label: 'Delete Session',
    keywords: 'remove delete session',
    onSelect: () => handlers.navigateToPage(MENU_PAGES.DELETE_SESSION),
  },
];

export const getInputPlaceholder = (pages) => {
  const pageString = pages.join(', ');

  switch (pageString) {
    case MENU_PAGES.DELETE_SOLVE:
      return 'Delete Solve';
    case MENU_PAGES.THEME:
      return 'Choose your theme';
    case MENU_PAGES.SCRAMBLE_VISUALIZATION:
      return 'Choose your preferred visualization';
    case MENU_PAGES.CREATE_SESSION:
      return 'Enter session name';
    case MENU_PAGES.RENAME_SESSION:
      return 'Choose the session to rename';
    case 'rename session, new name':
      return 'Enter new session name';
    default:
      return 'What do you need?';
  }
};
