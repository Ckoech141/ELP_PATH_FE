import { ChangeDetectorRef, NgZone } from '@angular/core';
import { UpdateUIStateEvent } from '../../../events/update-ui-state-event';
import { PDFNotificationService } from '../../../pdf-notification-service';
import * as i0 from "@angular/core";
export declare class PdfPreviousPageComponent {
    private notificationService;
    private ngZone;
    private changeDetectorRef;
    disablePreviousPage: boolean;
    constructor(notificationService: PDFNotificationService, ngZone: NgZone, changeDetectorRef: ChangeDetectorRef);
    onPdfJsInit(): void;
    updateUIState(event: UpdateUIStateEvent): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<PdfPreviousPageComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<PdfPreviousPageComponent, "pdf-previous-page", never, {}, {}, never, never>;
}
