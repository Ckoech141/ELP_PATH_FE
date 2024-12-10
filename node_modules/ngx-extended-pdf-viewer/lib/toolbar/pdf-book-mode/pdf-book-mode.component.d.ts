import { EventEmitter } from '@angular/core';
import { PageViewModeType, ScrollModeType } from '../../options/pdf-viewer';
import { ResponsiveVisibility } from '../../responsive-visibility';
import * as i0 from "@angular/core";
export declare class PdfBookModeComponent {
    show: ResponsiveVisibility;
    pageViewMode: PageViewModeType;
    scrollMode: ScrollModeType;
    pageViewModeChange: EventEmitter<PageViewModeType>;
    onClick: () => void;
    constructor();
    static ɵfac: i0.ɵɵFactoryDeclaration<PdfBookModeComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<PdfBookModeComponent, "pdf-book-mode", never, { "show": "show"; "pageViewMode": "pageViewMode"; "scrollMode": "scrollMode"; }, { "pageViewModeChange": "pageViewModeChange"; }, never, never>;
}
