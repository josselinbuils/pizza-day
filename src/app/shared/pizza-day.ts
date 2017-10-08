import { Pizzeria } from './pizzeria';
import { User } from './user';

export interface PizzaDay {
  _id: string;
  createdAt: Date;
  day: number;
  mealTime: string;
  orderTime: string;
  owner: User;
  participants: User[];
  pizzeria: Pizzeria;
  purchaseTime: string;
  reminderTime: string;
}
