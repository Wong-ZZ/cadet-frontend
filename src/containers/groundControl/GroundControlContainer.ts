import { connect, MapDispatchToProps, MapStateToProps } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import {
  fetchAssessmentOverviews,
  uploadAssessment,
  deleteAssessment
} from '../../actions/session';
import GroundControl, { IDispatchProps, IStateProps } from '../../components/groundControl/GroundControl';
import { IState } from '../../reducers/states';

const mapStateToProps: MapStateToProps<IStateProps, {}, IState> = (state, props) => ({
    assessmentOverviews: state.session.assessmentOverviews
      ? state.session.assessmentOverviews
      : []
  }
);

const mapDispatchToProps: MapDispatchToProps<IDispatchProps, {}> = (dispatch: Dispatch<any>) =>
  bindActionCreators(
    {
      handleAssessmentOverviewFetch: fetchAssessmentOverviews,
      handleUploadAssessment: uploadAssessment,
      handleDeleteAssessment: deleteAssessment
    },
    dispatch
  );

export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(GroundControl);
