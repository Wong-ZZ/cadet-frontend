import { connect, MapDispatchToProps, MapStateToProps } from 'react-redux';
import { withRouter } from 'react-router';
import { bindActionCreators, Dispatch } from 'redux';

import { changeDefaultChapter, fetchChapter } from '../actions';

import { DefaultChapter, IDispatchProps, IStateProps } from '../components/academy/DefaultChapter';
import { IState } from '../reducers/states';
import { IChapter } from 'src/components/workspace/controlBar';

const mapStateToProps: MapStateToProps<IStateProps, {}, IState> = state => ({
  sourceChapter: state.workspaces.playground.context.chapter
});

const mapDispatchToProps: MapDispatchToProps<IDispatchProps, {}> = (dispatch: Dispatch<any>) =>
  bindActionCreators(
    {
      handleFetchChapter: () => fetchChapter(),
      handleUpdateChapter: (chapter: IChapter) => changeDefaultChapter(chapter.chapter),
     
    },
    dispatch
  );

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(DefaultChapter)
);
