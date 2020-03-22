import { connect, MapDispatchToProps, MapStateToProps } from 'react-redux';
import { withRouter } from 'react-router';
import { bindActionCreators, Dispatch } from 'redux';

import {
  fetchChapter,
  // updateChapter
} from '../actions';

// import { ExternalLibraryName } from '../components/assessment/assessmentShape';
import DefaultChapter, { IStateProps, IDispatchProps} from '../components/academy/defaultChapter';
import { IState} from '../reducers/states';

const mapStateToProps: MapStateToProps<IStateProps, {}, IState> = state => ({
  
  sourceChapter: state.playground.sourceChapter,
  
});
// console.log((fetchChapter()));


const mapDispatchToProps: MapDispatchToProps<IDispatchProps, {}> = (dispatch: Dispatch<any>) =>
  bindActionCreators(
    {
      
      handleFetchChapter: () => fetchChapter(),
      // handleUpdateChapter: (chapterno: number) => updateChapter(chapterno)
      
    },
    dispatch
  );

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(DefaultChapter)
);
