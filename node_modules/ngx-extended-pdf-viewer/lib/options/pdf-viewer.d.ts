import { OptionalContentConfig } from './optional_content_config';
import { PDFPageView } from './pdf_page_view';
export declare enum ScrollModeType {
    vertical = 0,
    horizontal = 1,
    wrapped = 2,
    page = 3
}
export declare enum SpreadModeType {
    UNKNOWN = -1,
    NONE = 0,
    ODD = 1,
    EVEN = 2
}
export declare type PageViewModeType = 'single' | 'book' | 'multiple' | 'infinite-scroll';
export interface ScrollModeChangedEvent {
    mode: ScrollModeType;
}
export interface IPDFRenderingQueue {
    getHighestPriority(visiblePage: Array<any>, pages: Array<any>, scrolledDown: boolean, preRenderExtra: boolean): any;
}
export declare type FreeTextEditorAnnotation = {
    annotationType: 3;
    color: Array<number>;
    fontSize: number;
    value: string;
    pageIndex: number;
    rect: Array<number>;
    rotation: 0 | 90 | 180 | 270;
};
export declare type BezierPath = {
    bezier: Array<number>;
    points: Array<number>;
};
export declare type InkEditorAnnotation = {
    annotationType: 15;
    color: Array<number>;
    thickness: number;
    opacity: number;
    paths: Array<BezierPath>;
    pageIndex: number;
    rect: Array<number>;
    rotation: 0 | 90 | 180 | 270;
};
export declare type EditorAnnotation = InkEditorAnnotation | FreeTextEditorAnnotation;
export interface IPDFViewer {
    currentPageLabel: string | undefined;
    currentPageNumber: number;
    currentScaleValue: string | number;
    pagesRotation: 0 | 90 | 180 | 270;
    removePageBorders: boolean;
    renderingQueue: IPDFRenderingQueue;
    scrollMode: ScrollModeType;
    pageViewMode: PageViewModeType;
    spreadMode: 0 | 1 | 2;
    _pages: Array<PDFPageView>;
    addPageToRenderQueue(pageIndex: number): boolean;
    _getVisiblePages(): Array<any>;
    optionalContentConfigPromise: Promise<OptionalContentConfig> | null;
    _scrollPageIntoView({ pageDiv: HTMLElement, pageSpot: any, pageNumber: number }: {
        pageDiv: any;
        pageSpot: any;
        pageNumber: any;
    }): void;
    getSerializedAnnotations(): EditorAnnotation[] | null;
    addEditorAnnotation(serialized: string | EditorAnnotation): void;
    removeEditorAnnotations(filter?: (serialized: EditorAnnotation) => boolean): void;
    getPageView(index: number): PDFPageView;
    destroyBookMode(): void;
    stopRendering(): void;
}
