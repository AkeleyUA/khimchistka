import {createContext} from 'react';
import {OrderType, UpdatesForOrder} from '../hooks/useOrders';

export const OrdersContext = createContext({
  orders: [] as OrderType[],
  loading: false,
  getOrders: async (): Promise<void> => {},
  changeOrder: async (
    order: UpdatesForOrder,
    reason?: string,
  ): Promise<void> => {},
  orderLoading: [] as string[],
});
