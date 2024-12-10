import { ChangeDetectorRef } from '@angular/core';
import { UpdateUIStateEvent } from '../../../events/update-ui-state-event';
import { ResponsiveVisibility } from '../../../responsive-visibility';
import { PDFNotificationService } from './../../../pdf-notification-service';
import * as i0 from "@angular/core";
export declare class PdfFirstPageComponent {
    private notificationService;
    private changeDetectorRef;
    show: ResponsiveVisibility;
    disableFirstPage: boolean;
    constructor(notificationService: PDFNotificationService, changeDetectorRef: ChangeDetectorRef);
    firstPage(): void;
    onPdfJsInit(): void;
    updateUIState(event: UpdateUIStateEvent): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<PdfFirstPageComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<PdfFirstPageComponent, "pdf-first-page", never, { "show": "show"; }, {}, never, never>;
}
