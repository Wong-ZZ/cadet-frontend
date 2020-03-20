import { ColDef, GridApi, GridReadyEvent } from 'ag-grid';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid/dist/styles/ag-grid.css';
import 'ag-grid/dist/styles/ag-theme-balham.css';
import * as React from 'react';

import { GradingOverview } from '../academy/grading/gradingShape';
import ContentDisplay from '../commons/ContentDisplay';

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
    numOfUngradedMissions: number,
    totalNumOfMissions: number,
    numOfUngradedQuests: number,
    totalNumOfQuests: number
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
                headerName: 'Number of Ungraded Missions',
                field: 'numOfUngradedMissions'
            },
            {
                headerName: 'Number of Submitted Missions',
                field: 'totalNumOfMissions'
            },
            {
                headerName: 'Number of Ungraded Quests',
                field: 'numOfUngradedQuests'
            },
            {
                headerName: 'Number of Submitted Quests',
                field: 'totalNumOfQuests'
            },
        ];
    }

    public componentDidUpdate(prevProps: IDashboardProps, prevState: State) {
        if (this.gridApi && this.props.gradingOverviews.length !== prevProps.gradingOverviews.length) {
            this.gridApi.setRowData(this.updateLeaderBoard());
        }
     
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
        const gradingOverview: GradingOverview[] = this.sortSubmissionsByGroup();
        const filteredData: LeaderBoardInfo[] = [];
        for(const current of gradingOverview) {
            const index = parseInt(current.groupName.slice(5), 10);
            if(filteredData[index] === undefined) {
                filteredData[index] = {
                    groupName: "group" + index,
                    numOfUngradedMissions: 0,
                    totalNumOfMissions: 0,
                    numOfUngradedQuests: 0,
                    totalNumOfQuests: 0,
                };
            }
            const currentEntry = filteredData[index];
            const gradingStatus = current.gradingStatus;

            if(current.submissionStatus !== "submitted") {
                continue;
            }

            if(current.assessmentCategory === "Mission") {
                if(gradingStatus === "none" || gradingStatus === "grading") {
                    currentEntry.numOfUngradedMissions++;
                }                
                currentEntry.totalNumOfMissions++;
            } else if (current.assessmentCategory === "Sidequest") {
                if(gradingStatus === "none" || gradingStatus === "grading") {
                    currentEntry.numOfUngradedQuests++;
                }                
                currentEntry.totalNumOfQuests++;
            }                
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