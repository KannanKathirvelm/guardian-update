import { wardImpersonateStateReducer, wardListStateReducer, wardsSessionStateReducer } from '@stores/reducers/ward.reducer';

export const reducers = {
  wardsSession: wardsSessionStateReducer,
  wardList: wardListStateReducer,
  wardImpersonate: wardImpersonateStateReducer
};
