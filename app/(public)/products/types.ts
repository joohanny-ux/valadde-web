export type ProductListItem = {
  id: string
  brand: string
  name: string
  description: string
  image?: string | null
  badgeLeft?: string
  badgeRight?: string
  meta?: string[]
  favorite?: boolean
}

export type CategoryTree = {
  [category1: string]: {
    [category2: string]: string[]
  }
}