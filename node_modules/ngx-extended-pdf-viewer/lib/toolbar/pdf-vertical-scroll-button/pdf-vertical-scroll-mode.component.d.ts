import { EventEmitter, NgZone } from '@angular/core';
import { PageViewModeType, ScrollModeType } from '../../options/pdf-viewer';
import { PDFNotificationService } from '../../pdf-notification-service';
import { ResponsiveVisibility } from '../../responsive-visibility';
import * as i0 from "@angular/core";
export declare class PdfVerticalScrollModeComponent {
    private notificationService;
    private ngZone;
    show: ResponsiveVisibility;
    scrollMode: ScrollModeType;
    pageViewMode: PageViewModeType;
    pageViewModeChange: EventEmitter<PageViewModeType>;
    onClick: () => void;
    constructor(notificationService: PDFNotificationService, ngZone: NgZone);
    onPdfJsInit(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<PdfVerticalScrollModeComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<PdfVerticalScrollModeComponent, "pdf-vertical-scroll-mode", never, { "show": "show"; "scrollMode": "scrollMode"; "pageViewMode": "pageViewMode"; }, { "pageViewModeChange": "pageViewModeChange"; }, never, never>;
}
