import { Button, Classes, MenuItem } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import { ItemRenderer, Select } from '@blueprintjs/select';
import * as React from 'react';

import { RouteComponentProps } from 'react-router';

import { sourceChapters } from '../../reducers/states';

export interface IChapterProps extends IDispatchProps, IStateProps, RouteComponentProps<{}> {}

export type IDispatchProps = {
    handleFetchChapter: () => void;
    handleUpdateChapter: (chapterno: number) => void;
};

export interface IStateProps {
  sourceChapter: number;
}

export interface IChapter {
    chapter: number;
    displayName: string;
}

class DefaultChapter extends React.Component<IChapterProps, {}> {
    public constructor(props: IChapterProps) {
        super(props);
        this.props.handleFetchChapter();
    }
    
    private styliseChapter = (chap: number) => `Source \xa7${chap}`;

    chapters = sourceChapters.map(chap => ({
        displayName: this.styliseChapter(chap),
        chapter: chap
    }));

    

    chapterRenderer: ItemRenderer<IChapter> = (chap) => (
        <MenuItem active={false} key={chap.chapter} onClick={() => this.props.handleUpdateChapter(chap.chapter)} text={chap.displayName} />
    );
   
    ChapterSelectComponent = Select.ofType<IChapter>();


    chapSelect = (
    currentChap: number,
    handleSelect = (i: IChapter, e: React.ChangeEvent<HTMLSelectElement>) => {}
  ) => (
    <this.ChapterSelectComponent
      className={Classes.MINIMAL}
      items={this.chapters}
      onItemSelect={handleSelect}
      itemRenderer={this.chapterRenderer}
      filterable={false}
    >
      <Button
        className={Classes.MINIMAL}
        text={this.styliseChapter(currentChap)}
        rightIcon={IconNames.DOUBLE_CARET_VERTICAL}
      />
    </this.ChapterSelectComponent>
  );


    public render() {
        return (
            <div> {this.chapSelect(this.props.sourceChapter, () => {} )} </div>
        )
    }
}

export default DefaultChapter;
