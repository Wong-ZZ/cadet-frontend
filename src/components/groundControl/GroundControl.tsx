import { ColDef, GridApi, GridReadyEvent } from 'ag-grid';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid/dist/styles/ag-grid.css';
import 'ag-grid/dist/styles/ag-theme-balham.css';
import * as React from 'react';

import { getPrettyDate } from '../../utils/dateHelpers';
import { IAssessmentOverview } from '../assessment/assessmentShape';
import ContentDisplay from '../commons/ContentDisplay';
import DeleteCell from './DeleteCell';
import Dropzone from './Dropzone';
import EditCell from './EditCell';
import PublishCell from './PublishCell';

// import {
//     ChapterSelect,
//   } from '../workspace/controlBar/index';

export interface IDispatchProps {
  handleAssessmentOverviewFetch: () => void;
  handleDeleteAssessment: (id: number) => void;
  handleUploadAssessment: (file: File) => void;
  handlePublishAssessment: (bool: boolean, id: number) => void;
  handleAssessmentChangeDate: (id: number, openAt: string, closeAt: string) => void;
}

export interface IGroundControlAssessmentOverview extends IAssessmentOverview {
  prettyOpenAt?: string;
  prettyCloseAt?: string;
}

export interface IStateProps {
  assessmentOverviews: IGroundControlAssessmentOverview[];
}

export interface IGroundControlProps extends IDispatchProps, IStateProps {}

class GroundControl extends React.Component<IGroundControlProps, {}> {
  private columnDefs: ColDef[];
  private gridApi?: GridApi;

  public constructor(props: IGroundControlProps) {
    super(props);
    this.columnDefs = [
      {
        headerName: 'Title',
        field: 'title'
      },
      {
        headerName: 'Category',
        field: 'category',
        width: 100
      },
      {
        headerName: 'Open Date',
        field: '',
        cellRendererFramework: EditCell,
        cellRendererParams: {
          handleAssessmentChangeDate: this.props.handleAssessmentChangeDate,
          forOpenDate: true
        },
        width: 150,
        suppressSorting: true,
        suppressMovable: true,
        suppressMenu: true,
        cellStyle: {
          padding: 0
        }
      },
      {
        headerName: 'Close Date',
        field: '',
        cellRendererFramework: EditCell,
        cellRendererParams: {
          handleAssessmentChangeDate: this.props.handleAssessmentChangeDate,
          forOpenDate: false
        },
        width: 150,
        suppressSorting: true,
        suppressMovable: true,
        suppressMenu: true,
        cellStyle: {
          padding: 0
        }
      },
      {
        headerName: 'Publish',
        field: '',
        cellRendererFramework: PublishCell,
        cellRendererParams: {
          handlePublishAssessment: this.props.handlePublishAssessment
        },
        width: 100,
        suppressSorting: true,
        suppressMovable: true,
        suppressMenu: true,
        cellStyle: {
          padding: 0
        },
        hide: !this.props.handlePublishAssessment
      },
      {
        headerName: 'Delete',
        field: '',
        cellRendererFramework: DeleteCell,
        cellRendererParams: {
          handleDeleteAssessment: this.props.handleDeleteAssessment
        },
        width: 100,
        suppressSorting: true,
        suppressMovable: true,
        suppressMenu: true,
        cellStyle: {
          padding: 0
        },
        hide: !this.props.handleDeleteAssessment
      }
    ];
  }

  public componentDidUpdate(prevProps: IGroundControlProps) {
    if (
      this.gridApi &&
      this.props.assessmentOverviews.length !== prevProps.assessmentOverviews.length
    ) {
      this.gridApi.setRowData(this.sortByCategory());
    }
  }

  public render() {
    const data = this.sortByCategory();
    const Grid = () => (
      <div className="GradingContainer">
        <div className="Grading ag-grid-parent ag-theme-balham">
          <AgGridReact
            gridAutoHeight={true}
            enableColResize={true}
            enableSorting={true}
            enableFilter={true}
            columnDefs={this.columnDefs}
            onGridReady={this.onGridReady}
            onGridSizeChanged={this.resizeGrid}
            rowData={data}
            rowHeight={30}
            pagination={true}
            paginationPageSize={25}
            suppressMovableColumns={true}
            suppressPaginationPanel={true}
          />
        </div>
      </div>
    );

    const display = (
      <div>
        <Dropzone handleUploadAssessment={this.props.handleUploadAssessment} />
        <Grid />
      </div>
    );

    return (
      <div>
        <ContentDisplay
          display={display}
          loadContentDispatch={this.props.handleAssessmentOverviewFetch}
        />
      </div>
    );
  }

  private sortByCategory = () => {
    if (!this.props.assessmentOverviews) {
      return [];
    }

    const overview = this.props.assessmentOverviews.slice();
    return overview
      .sort((subX, subY) => {
        if (subX.category < subY.category) {
          return -1;
        } else if (subX.category === subY.category) {
          return 0;
        } else {
          return 1;
        }
      })
      .map(assessmentOverview => {
        const clone = JSON.parse(JSON.stringify(assessmentOverview));
        clone.prettyCloseAt = getPrettyDate(clone.closeAt);
        clone.prettyOpenAt = getPrettyDate(clone.openAt);
        return clone;
      });
  };

  private onGridReady = (params: GridReadyEvent) => {
    this.gridApi = params.api;
    this.gridApi.sizeColumnsToFit();
  };

  private resizeGrid = () => {
    if (this.gridApi) {
      this.gridApi.sizeColumnsToFit();
    }
  };
}

export default GroundControl;
