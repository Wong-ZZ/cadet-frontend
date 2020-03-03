import { Classes, Dialog, Switch } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import * as React from 'react';

import { IAssessmentOverview } from '../assessment/assessmentShape';
import { controlButton } from '../commons';

interface IPublishCellProps {
  data: IAssessmentOverview;
  handlePublishAssessment: (bool: boolean, id: number) => void;
}

interface IPublishCellState {
  dialogOpen: boolean;
  is_published: boolean;
}

class PublishCell extends React.Component<IPublishCellProps, IPublishCellState> {
  
  public constructor(props: IPublishCellProps) {
    super(props);
    this.state = {
      dialogOpen: false,
      is_published: this.props.data.is_published === undefined ? false : this.props.data.is_published
    };
  }
  
  public render() {
    return (
      <div>
        <this.toggleButton />
        <Dialog
          icon="info-sign"
          isOpen={this.state.dialogOpen}
          onClose={this.handleCloseDialog}
          title="Delete Assessment"
          canOutsideClickClose={true}
        >
          <div className={Classes.DIALOG_BODY}>
            {(
              <p>Are you sure to delete this Assessment?</p>
            )}
          </div>
          <div className={Classes.DIALOG_FOOTER}>
            <div className={Classes.DIALOG_FOOTER_ACTIONS}>
              {controlButton('Confirm Delete', IconNames.TRASH, this.handleDelete)}
              {controlButton('Cancel', IconNames.CROSS, this.handleCloseDialog)}
            </div>
          </div>
        </Dialog>
      </div>
    );
  }

  private toggleButton = () => {
    return <Switch checked={this.state.is_published} onChange={this.handleOpenDialog} />;
  }
  private handleCloseDialog = () => this.setState({ dialogOpen: false });
  private handleOpenDialog = () => this.setState({ dialogOpen: true });
  private handleDelete = () => {
    const { data } = this.props;
    this.props.handlePublishAssessment(!data.is_published, data.id);
    this.handleCloseDialog();
  };
  
  
}

export default PublishCell;
