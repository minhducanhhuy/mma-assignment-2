import { ProductEntity } from './catalog';

export interface BasketRecord {
  item: ProductEntity;
  quantity: number;
  addedAt: number;
}

export interface BasketBillCalculation {
  itemCount: number;
  rawSubtotal: number;
  discountSavings: number;
  shippingFee: number;
  finalPayable: number;
  qualifiesFreeShipping: boolean;
  freeShippingGap: number;
}

