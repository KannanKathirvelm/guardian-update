import { Action, createReducer, createSelector, on } from '@ngrx/store';
import { setWardImpersonate, setWardList, setWardSession } from '@stores/actions/ward.action';

const stateValue = (state) => state;

export const getWardSessionById = (wardId) => createSelector(stateValue, (stateItem) => {
  return stateItem.wardsSession ? stateItem.wardsSession[wardId] : null;
});

export const getWardImpersonate = () => createSelector(stateValue, (stateItem) => {
  return stateItem.wardImpersonate;
});

export const getWardList = () => createSelector(stateValue, (stateItem) => {
  return stateItem.wardList;
});

const wardsSessionReducer = createReducer({},
  on(setWardSession, (state, { key, data }) => setStateData(state, key, data)));

const wardImpersonateReducer = createReducer({},
  on(setWardImpersonate, (state, { data }) => setStateNonKeyData(state, data)));

const wardListReducer = createReducer({},
  on(setWardList, (state, { data }) => setStateNonKeyData(state, data)));

function setStateData(state, key, data) {
  return {
    ...state,
    [key]: data
  };
}

function setStateNonKeyData(state, data) {
  return {
    ...state,
    data
  };
}


export function wardsSessionStateReducer(state, action: Action) {
  return wardsSessionReducer(state, action);
}

export function wardListStateReducer(state, action: Action) {
  return wardListReducer(state, action);
}

export function wardImpersonateStateReducer(state, action: Action) {
  return wardImpersonateReducer(state, action);
}
