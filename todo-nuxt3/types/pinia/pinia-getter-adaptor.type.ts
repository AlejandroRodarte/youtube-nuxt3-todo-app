import { Store } from 'pinia';

export type PiniaGetterAdaptor<GettersType, StoreType extends Store> = {
  [GetterKey in keyof GettersType]: (
    this: StoreType,
    state: StoreType['$state']
  ) => GettersType[GetterKey];
};
