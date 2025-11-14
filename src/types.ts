export interface Owner {
  id: number;
  name: string;
  email: string;
}

export interface Venue {
  id: number;
  title: string;
  description: string;
  image?: string | null;
  capacity: number;
  pricePerHour: number;
  location?: string | null;
  available: boolean;
  ownerId: number;
  owner?: Owner;
  createdAt?: string;
  updatedAt?: string;
}
