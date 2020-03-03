import { ColDef, GridApi, GridReadyEvent } from 'ag-grid';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid/dist/styles/ag-grid.css';
import 'ag-grid/dist/styles/ag-theme-balham.css';
import * as React from 'react';

import { GradingOverview } from '../academy/grading/gradingShape';
import ContentDisplay from '../commons/ContentDisplay';
import GradeCell from './GradeCell';

type State = {
    filterValue: string;
    groupFilterEnabled: boolean;
    currPage: number;
    maxPages: number;
    rowCountString: string;
    isBackDisabled: boolean;
    isForwardDisabled: boolean;
};

interface IDashboardProps
  extends IDispatchProps,
    IStateProps {}
  
export interface IDispatchProps {
    handleFetchGradingOverviews: (filterToGroup?: boolean) => void;
}
  
export interface IStateProps {
    gradingOverviews: GradingOverview[];
}

export type LeaderBoardInfo = {
    groupName: string,
    numOfUngradedAssessments: number,
    totalNumOfAssessments: number,
    gradeTotal: number
};

class Dashboard extends React.Component<IDashboardProps, State> {
    private columnDefs: ColDef[];
    private gridApi?: GridApi;

    public constructor(props: IDashboardProps) {
        super(props);
        this.columnDefs = [
            {
                headerName: 'Group',
                field: 'groupName'
            },
            {
                headerName: 'Number of Ungraded Assessments',
                field: 'numOfUngradedAssessments'
            },
            {
                headerName: 'Number of Submitted Assessments',
                field: 'totalNumOfAssessments'
            },
            {
                headerName: 'Average Grade',
                cellRendererFramework: GradeCell
            }
        ];
    }

    public componentDidUpdate(prevProps: IDashboardProps, prevState: State) {
        if (this.gridApi && this.props.gradingOverviews.length !== prevProps.gradingOverviews.length) {
            this.gridApi.setRowData(this.updateLeaderBoard());
        }
        console.log(this.sortSubmissionsByGroup());
        console.log(this.updateLeaderBoard());        
    }

    public handleFetchGradingOverviews = () => {
        this.props.handleFetchGradingOverviews(false);
    }

    public render() { 
        const data = this.updateLeaderBoard();
        const grid = (
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

        return (
            <div>
                <ContentDisplay
                    display={grid} 
                    loadContentDispatch={this.handleFetchGradingOverviews}
                />
            </div>
        );
    }

    private updateLeaderBoard = () => {
        const rawData: GradingOverview[] = this.sortSubmissionsByGroup();
        const filteredData: LeaderBoardInfo[] = [];
        for(let i = 0; i < rawData.length; i++) {
            const currentInput = rawData[i];
            const index = parseInt(currentInput.groupName.slice(5), 10);
            if(filteredData[index] === undefined) {
                filteredData[index] = {
                    groupName: "group" + index,
                    numOfUngradedAssessments: 0,
                    totalNumOfAssessments: 0,
                    gradeTotal: 0
                };
            }
            const currentEntry = filteredData[index];
            const gradingStatus = currentInput.gradingStatus;
            if(gradingStatus === "none") {                               
                currentEntry.numOfUngradedAssessments++; 
            } else {
                currentEntry.gradeTotal += currentInput.currentGrade;                
            }
            currentEntry.totalNumOfAssessments++;
        }
        return filteredData;
    }

    private sortSubmissionsByGroup = () => {
        if (!this.props.gradingOverviews) {
          return [];
        }
        return (this.props.gradingOverviews as GradingOverview[])
          .sort((subX, subY) => {
              if(subX.groupName < subY.groupName) {
                  return -1;
              } else if(subX.groupName === subY.groupName) {
                  return 0;
              } else {
                  return 1;
              }
          })
          .filter(sub => sub.assessmentCategory === "Sidequest" || sub.assessmentCategory === "Mission");
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

export default Dashboard;