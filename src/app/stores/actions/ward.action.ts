import { WardModel } from '@models/ward/ward';
import { createAction, props } from '@ngrx/store';
export const setWardSession = createAction(
  '[WardSession] SetWardSession',
  props<{ key: string; data: WardModel }>()
);
export const setWardImpersonate = createAction(
  '[WardImpersonate] SetWardImpersonate',
  props<{ data: string }>()
);
export const setWardList = createAction(
  '[WardList] SetWardList',
  props<{ data: Array<WardModel> }>()
);
