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

import {
    ChapterSelect,
  } from '../workspace/controlBar/index';


export interface IDispatchProps {
    handleAssessmentOverviewFetch: () => void;
    handleDeleteAssessment: (id: number) => void;
    handleUploadAssessment: (file: File) => void;
    handlePublishAssessment: (bool: boolean, id: number) => void;
    handleAssessmentChangeDate: (id:number, openAt: string, closeAt: string) => void;
    handleChapterSelect: (chapter: number) => void;
}

export interface IStateProps {
    assessmentOverviews: IAssessmentOverview[];
    sourceChapter?: number;
}

export interface IGroundControlProps extends IDispatchProps, IStateProps {}


class GroundControl extends React.Component<IGroundControlProps, {}> {
    private columnDefs: ColDef[];
    private gridApi?: GridApi;

    public constructor(props: IGroundControlProps) {
        super(props);
        this.columnDefs = [
            {
                headerName: "Title",
                field: "title"
            },
            {
                headerName: "Category",
                field: "category"
            },
            {
                headerName: "Open Date",
                field: "prettyOpenAt"
            },
            {
                headerName: "Close Date",
                field: "prettyCloseAt"
            },
            {
                headerName: "Edit",
                field: '',
                cellRendererFramework: EditCell,
                cellRendererParams: {
                    handleAssessmentChangeDate: this.props.handleAssessmentChangeDate
                },
                width: 150,
                suppressSorting: true,
                suppressMovable: true,
                suppressMenu: true,
                cellStyle: {
                    padding: 0
                },
                // hide: !this.props.handleDeleteAssessment
            },
            {
                headerName: "Max Grade",
                field: "maxGrade"
            },
            {
                headerName: "Max XP",
                field: "maxXp"
            },
            {
                headerName: "Publish",
                field: '',
                cellRendererFramework: PublishCell,
                cellRendererParams: {
                    handlePublishAssessment: this.props.handlePublishAssessment
                },
                width: 150,
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
                width: 150,
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
        if (this.gridApi && this.props.assessmentOverviews.length !== prevProps.assessmentOverviews.length) {
            this.gridApi.setRowData(this.sortByCategory());            
        }
    }

    public render() {
        
        const chapterSelectHandler = ({ chapter }: { chapter: number }, e: any) => {
            // console.log(chapter);
            // console.log(this.props.sourceChapter);
            // if (
            //   (chapter <= 2 && this.state.hasBreakpoints) ||
            //   this.state.selectedTab === SideContentType.substVisualizer
            // ) {
            //   this.props.handleUsingSubst(true);
            // }
            // if (chapter > 2) {
            //   this.props.handleReplOutputClear();
            //   this.props.handleUsingSubst(false);
            // }
            this.props.handleChapterSelect(chapter);
          };
          const chapterSelect = (
            <ChapterSelect
              handleChapterSelect={chapterSelectHandler}
              sourceChapter={this.props.sourceChapter == undefined ? 1 : this.props.sourceChapter}
              key="chapter"
            />
          );

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
                <Dropzone handleUploadAssessment={this.props.handleUploadAssessment}/>
                <Grid/>
            </div>
        );

        return (
            <div>
                <div> {chapterSelect} </div>
                <ContentDisplay display={display} loadContentDispatch={this.props.handleAssessmentOverviewFetch}/>
            </div>
        );
    }

    private sortByCategory = () => {
        if(!this.props.assessmentOverviews) {
            return [];
        }
        
        const overview = this.props.assessmentOverviews.slice();
        return overview
            .sort((subX, subY) => {
                if(subX.category < subY.category) {
                    return -1;
                } else if(subX.category === subY.category) {
                    return 0;
                } else {
                    return 1;
                }
            })
            .map((assessmentOverview) => {
                const clone = JSON.parse(JSON.stringify(assessmentOverview));
                clone.prettyCloseAt = getPrettyDate(clone.closeAt);
                clone.prettyOpenAt = getPrettyDate(clone.openAt);
                return clone;
            });
    }

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