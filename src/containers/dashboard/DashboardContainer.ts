import { connect, MapDispatchToProps, MapStateToProps } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import { fetchGradingOverviews, fetchGroupAvengers } from '../../actions/session';
import { IDispatchProps, IStateProps } from '../../components/dashboard/Dashboard';
import Dashboard from '../../components/dashboard/Dashboard';
import { IState } from '../../reducers/states';

const mapStateToProps: MapStateToProps<IStateProps, {}, IState> = state => ({
  gradingOverviews: state.session.gradingOverviews ? state.session.gradingOverviews : [],
  groupAvengers: state.dashboard.groupAvengers
});

const mapDispatchToProps: MapDispatchToProps<IDispatchProps, {}> = (dispatch: Dispatch<any>) =>
  bindActionCreators(
    {
      handleFetchGradingOverviews: fetchGradingOverviews,
      handleFetchGroupAvengers: fetchGroupAvengers
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard);
