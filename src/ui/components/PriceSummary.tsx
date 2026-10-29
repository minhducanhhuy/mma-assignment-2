import React from 'react';
import { BillSummaryCard } from './BillSummaryCard';
import { BasketBillCalculation } from '../../models/basket';

export interface PriceSummaryProps {
  bill?: BasketBillCalculation;
  totalPrice?: number;
  totalItems?: number;
}

/**
 * Assignment requirement: Atomic PriceSummary component
 */
export const PriceSummary: React.FC<PriceSummaryProps> = ({
  bill,
  totalPrice,
  totalItems,
}) => {
  const resolvedBill: BasketBillCalculation =
    bill || {
      itemCount: totalItems || 0,
      rawSubtotal: totalPrice || 0,
      discountSavings: 0,
      shippingFee: (totalPrice || 0) >= 50 || (totalItems || 0) === 0 ? 0 : 7.99,
      finalPayable: (totalPrice || 0) >= 50 || (totalItems || 0) === 0 ? (totalPrice || 0) : (totalPrice || 0) + 7.99,
      qualifiesFreeShipping: (totalPrice || 0) >= 50 || (totalItems || 0) === 0,
      freeShippingGap: Math.max(0, 50 - (totalPrice || 0)),
    };

  return <BillSummaryCard bill={resolvedBill} />;
};

