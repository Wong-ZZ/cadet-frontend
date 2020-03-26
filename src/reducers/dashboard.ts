import { Reducer } from 'redux';
import { ActionType } from 'typesafe-actions';

import * as actions from '../actions';
import { UPDATE_GROUP_AVENGERS } from '../actions/actionTypes';
import { defaultDashBoard, IDashBoardState } from './states';

export const reducer: Reducer<IDashBoardState> = (
  state = defaultDashBoard,
  action: ActionType<typeof actions>
) => {
  switch (action.type) {
    case UPDATE_GROUP_AVENGERS:
      return {
        ...state,
        groupAvengers: action.payload
      };
    default:
      return state;
  }
};
