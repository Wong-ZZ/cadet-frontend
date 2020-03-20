import { action } from 'typesafe-actions';

import * as actionTypes from './actionTypes';

export const generateLzString = () => action(actionTypes.GENERATE_LZ_STRING);

export const toggleUsingSubst = (usingSubst: boolean) =>
  action(actionTypes.TOGGLE_USING_SUBST, usingSubst);

export const changeQueryString = (queryString: string) =>
  action(actionTypes.CHANGE_QUERY_STRING, queryString);

export const fetchChapter = () => action(actionTypes.FETCH_CHAPTER);

  export const updateChapter = (
    chapterno: number,
    // index: ISourcecastData[],
    // workspaceLocation: WorkspaceLocation
  ) =>
    action(actionTypes.UPDATE_CHAPTER_NUMBER, chapterno);
