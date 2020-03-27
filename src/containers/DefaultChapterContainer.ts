import { connect, MapDispatchToProps, MapStateToProps } from 'react-redux';
import { withRouter } from 'react-router';
import { bindActionCreators, Dispatch } from 'redux';

import {
  fetchChapter,
  changeDefaultChapter
} from '../actions';

import DefaultChapter, { IStateProps, IDispatchProps} from '../components/academy/DefaultChapter';
import { IState} from '../reducers/states';


const mapStateToProps: MapStateToProps<IStateProps, {}, IState> = state => ({
  sourceChapter: state.workspaces.playground.context.chapter

});


const mapDispatchToProps: MapDispatchToProps<IDispatchProps, {}> = (dispatch: Dispatch<any>) =>
  bindActionCreators(
    {
      handleFetchChapter: () => fetchChapter(),
      handleUpdateChapter: (chapterno: number) => changeDefaultChapter(chapterno)
    },
    dispatch
  );

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(DefaultChapter)
);
