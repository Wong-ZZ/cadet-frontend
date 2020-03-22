import { Button, Classes, MenuItem } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import { ItemRenderer, Select } from '@blueprintjs/select';
import * as React from 'react';

import { RouteComponentProps } from 'react-router';

import { sourceChapters } from '../../reducers/states';

export interface IChapterProps extends IDispatchProps, IStateProps, RouteComponentProps<{}> {}

export type IDispatchProps = {
    handleFetchChapter: () => void;
    // handleUpdateChapter: (chapterno: number) => updateChapter(chapterno);
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
    

    styliseChapter = (chap: number) => `Source \xa7${chap}`;

    chapters = sourceChapters.map(chap => ({
        displayName: this.styliseChapter(chap),
        chapter: chap
    }));

    chapterRenderer: ItemRenderer<IChapter> = (chap, { handleClick }) => (
        <MenuItem active={false} key={chap.chapter} onClick={handleClick} text={chap.displayName} />
    );
   
    ChapterSelectComponent = Select.ofType<IChapter>();

    updateChapter = () => {

    }

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

        // function change to update
        // get is done

        return (
            <div> {this.chapSelect(this.props.sourceChapter, () => {} )} </div>
        )
    }
// export function DefaultChapter(props: ChapterSelectProps) {
    
//   const styliseChapter = (chap: number) => `Source \xa7${chap}`;
//   const chapters = sourceChapters.map(chap => ({
//     displayName: styliseChapter(chap),
//     chapter: chap
//   }));
//   const chapterRenderer: ItemRenderer<IChapter> = (chap, { handleClick }) => (
//     <MenuItem active={false} key={chap.chapter} onClick={handleClick} text={chap.displayName} />
//   );
//   const ChapterSelectComponent = Select.ofType<IChapter>();

//   const handleSelect = ({ chapter }: { chapter: number }, e: any) => {}

//   const chapSelect = (
//     currentChap: number,
//     // handleSelect = (i: IChapter, e: React.ChangeEvent<HTMLSelectElement>) => {}
//   ) => (
//     <ChapterSelectComponent
//       className={Classes.MINIMAL}
//       items={chapters}
//       onItemSelect={handleSelect}
//       itemRenderer={chapterRenderer}
//       filterable={false}
//     >
//       <Button
//         className={Classes.MINIMAL}
//         text={styliseChapter(currentChap)}
//         rightIcon={IconNames.DOUBLE_CARET_VERTICAL}
//       />
//     </ChapterSelectComponent>
//   );

//   return chapSelect(1);
  //return chapSelect(props.sourceChapter, props.handleChapterSelect);
  
}

export default DefaultChapter;
