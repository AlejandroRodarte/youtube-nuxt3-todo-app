export type PiniaGetterAdaptor<
  StateType extends Record<string, any>,
  GetterType extends Record<string, any>
> = {
  [GetterKey in keyof GetterType]: (state: StateType) => GetterType[GetterKey];
};
