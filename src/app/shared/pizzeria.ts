import { Pizza } from './pizza';

export interface Pizzeria {
  _id: string;
  address?: string;
  createdAt: Date;
  name: string;
  phone: string;
  pizzas: Pizza[];
}
