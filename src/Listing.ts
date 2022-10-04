export interface ListingInterface {
  id: string
  name: string

  address: string
  phone: string
  photos: string[]
  areaSize: string
  url: string
  price: string
  tags: string[]
  description: string
}

export type Listing = Partial<ListingInterface>
