export interface UpdateUIStateEvent {
    source: any;
    widget: 'SecondaryToolbar' | 'Toolbar';
    pageNumber: number;
    pagesCount: number;
    pageScale?: number;
    pageScaleValue?: number | string;
}
