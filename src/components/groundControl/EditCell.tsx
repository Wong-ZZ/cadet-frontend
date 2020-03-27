import { Classes, Dialog } from '@blueprintjs/core';
import { DateInput } from '@blueprintjs/datetime';
import { IconNames } from '@blueprintjs/icons';
import * as React from 'react';

import { IAssessmentOverview } from '../assessment/assessmentShape';
import { controlButton } from '../commons';

interface IEditCellProps {
  data: IAssessmentOverview;
  handleAssessmentChangeDate: (id: number, openAt: string, closeAt: string) => void;
}

interface IEditCellState extends IEditCellDateState {
  dialogOpen: boolean;
}

interface IEditCellDateState {
  openAt: Date;
  closeAt: Date;
}

interface IDateInputProps {
  dateInputKey: keyof IEditCellDateState;
}

class EditCell extends React.Component<IEditCellProps, IEditCellState> {
  private maxDate = new Date(new Date(Date.now()).setFullYear(2100));

  public constructor(props: IEditCellProps) {
    super(props);
    this.state = {
      dialogOpen: false,
      openAt: new Date(Date.parse(this.props.data.openAt)),
      closeAt: new Date(Date.parse(this.props.data.closeAt))
    };
  }

  public render() {
    return (
      <div>
        {controlButton('', IconNames.EDIT, this.handleOpenDialog)}
        <Dialog
          icon="info-sign"
          isOpen={this.state.dialogOpen}
          onClose={this.handleCloseDialog}
          title="Update Assessment"
          canOutsideClickClose={true}
        >
          <div className={Classes.DIALOG_BODY}>
            Opening Date: {<this.dateInput dateInputKey="openAt" />}
            <br />
            Closing Date: {<this.dateInput dateInputKey="closeAt" />}
          </div>
          <div className={Classes.DIALOG_FOOTER}>
            <div className={Classes.DIALOG_FOOTER_ACTIONS}>
              {controlButton('Confirm Update', IconNames.TICK, this.handleUpdate)}
              {controlButton('Cancel', IconNames.CROSS, this.handleCloseDialog)}
            </div>
          </div>
        </Dialog>
      </div>
    );
  }

  private dateInput = (props: IDateInputProps) => {
    return (
      <DateInput
        formatDate={this.formatDate}
        onChange={this.handleDateChange(props.dateInputKey)}
        parseDate={this.parseDate}
        value={props.dateInputKey === 'closeAt' ? this.state.closeAt : this.state.openAt}
        timePrecision={'minute'}
        fill={true}
        maxDate={this.maxDate}
      />
    );
  };

  private parseDate = (str: string) => new Date(str);

  private formatDate = (date: Date) => date.toLocaleString();

  private handleDateChange = (key: keyof IEditCellState) => (selectedDate: Date) => {
    this.setState(({ [key]: selectedDate } as unknown) as Pick<
      IEditCellState,
      keyof IEditCellState
    >);
  };

  private handleCloseDialog = () => this.setState({ dialogOpen: false });
  private handleOpenDialog = () => this.setState({ dialogOpen: true });
  private handleUpdate = () => {
    const { data } = this.props;
    this.props.handleAssessmentChangeDate(
      data.id,
      this.state.openAt.toISOString(),
      this.state.closeAt.toISOString()
    );
    this.handleCloseDialog();
  };
}

export default EditCell;
