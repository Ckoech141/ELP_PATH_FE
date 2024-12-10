import { EventEmitter, NgZone } from '@angular/core';
import { PageViewModeType, ScrollModeType } from '../../options/pdf-viewer';
import { ResponsiveVisibility } from '../../responsive-visibility';
import * as i0 from "@angular/core";
export declare class PdfInfiniteScrollComponent {
    private ngZone;
    show: ResponsiveVisibility;
    pageViewMode: PageViewModeType;
    scrollMode: ScrollModeType;
    pageViewModeChange: EventEmitter<PageViewModeType>;
    onClick: () => void;
    constructor(ngZone: NgZone);
    static ɵfac: i0.ɵɵFactoryDeclaration<PdfInfiniteScrollComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<PdfInfiniteScrollComponent, "pdf-infinite-scroll", never, { "show": "show"; "pageViewMode": "pageViewMode"; "scrollMode": "scrollMode"; }, { "pageViewModeChange": "pageViewModeChange"; }, never, never>;
}
