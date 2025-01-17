/*
 * CloudBeaver - Cloud Database Manager
 * Copyright (C) 2020-2021 DBeaver Corp and others
 *
 * Licensed under the Apache License, Version 2.0.
 * you may not use this file except in compliance with the License.
 */

import type { SqlDataFilterConstraint } from '@cloudbeaver/core-sdk';

import type { IDatabaseDataAction } from '../IDatabaseDataAction';
import type { IDatabaseDataResult } from '../IDatabaseDataResult';
import type { Order } from '../Order';

export interface IDatabaseDataConstraintAction<TKey, TResult extends IDatabaseDataResult>
  extends IDatabaseDataAction<any, TResult> {
  setFilter: (attribute: string, operator: string, value?: any) => void;
  setOrder: (attribute: string, order: Order, multiple: boolean) => void;
  deleteAll: () => void;
  deleteFilter: (attribute: string) => void;
  deleteFilters: () => void;
  deleteOrder: (attribute: string) => void;
  deleteOrders: () => void;
  deleteDataFilters: () => void;
  get: (attribute: string) => SqlDataFilterConstraint | undefined;
  getOrder: (attribute: string) => Order;
  getFilterConstraints: () => SqlDataFilterConstraint[];
  getOrderConstraints: () => SqlDataFilterConstraint[];
}
