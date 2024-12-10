import { ChangeDetectorRef } from '@angular/core';
import { UpdateUIStateEvent } from '../../../events/update-ui-state-event';
import { PDFNotificationService } from '../../../pdf-notification-service';
import * as i0 from "@angular/core";
export declare class PdfNextPageComponent {
    private notificationService;
    private changeDetectorRef;
    disableNextPage: boolean;
    constructor(notificationService: PDFNotificationService, changeDetectorRef: ChangeDetectorRef);
    onPdfJsInit(): void;
    updateUIState(event: UpdateUIStateEvent): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<PdfNextPageComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<PdfNextPageComponent, "pdf-next-page", never, {}, {}, never, never>;
}
