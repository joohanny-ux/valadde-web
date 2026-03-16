import type { CategoryTree } from './types'

export const categoryTree: CategoryTree = {
  ALL: {
    ALL: ['ALL'],
  },

  COSMETICS: {
    ALL: ['ALL'],
    'Make Up': [
      'ALL',
      'Base',
      'Lip',
      'Eye',
      'Nail',
      'Blusher/Highlighter/Shading',
      'Others',
    ],
    'Skin Care': [
      'ALL',
      'Facial',
      'Cleansing',
      'Mask/Pack',
      'Sun Care',
      'Baby/Kids',
      'Others',
    ],
    'Body Care': ['ALL', 'Body', 'Hand/Foot', 'Baby/Kids', 'Functional', 'Dental', 'Others'],
    "Men's Care": ['ALL', 'Shaving/Cleansing', 'Facial', 'Make Up', 'Others'],
    'Hair Care': ['ALL', 'Shampoo/Rinse/Treatment', 'Styling', 'Appliance', 'Others'],
    Perfume: ['ALL', 'Perfume'],
    Tools: ['ALL', 'Face', 'Eye', 'Nail', 'Body', 'Hair', 'Others'],
  },

  'FOODS & BEVERAGES': {
    ALL: ['ALL'],
    'Inner Beauty': ['ALL', 'Inner Beauty'],
    Foods: ['ALL', 'Foods'],
    Beverage: ['ALL', 'Beverage'],
  },

  FASHION: {
    ALL: ['ALL'],
    Accessories: ['ALL', 'Accessories'],
  },

  OTHERS: {
    ALL: ['ALL'],
    Living: ['ALL', 'Living'],
  },
}