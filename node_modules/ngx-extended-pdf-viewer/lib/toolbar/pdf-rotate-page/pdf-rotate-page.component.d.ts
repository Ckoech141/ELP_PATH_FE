import { ChangeDetectorRef } from '@angular/core';
import { UpdateUIStateEvent } from '../../events/update-ui-state-event';
import { ResponsiveVisibility } from '../../responsive-visibility';
import { PDFNotificationService } from './../../pdf-notification-service';
import * as i0 from "@angular/core";
export declare class PdfRotatePageComponent {
    private notificationService;
    private changeDetectorRef;
    showRotateButton: ResponsiveVisibility;
    disableRotate: boolean;
    clockwise: boolean;
    counterClockwise: boolean;
    constructor(notificationService: PDFNotificationService, changeDetectorRef: ChangeDetectorRef);
    rotateCW(): void;
    rotateCCW(): void;
    onPdfJsInit(): void;
    updateUIState(event: UpdateUIStateEvent): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<PdfRotatePageComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<PdfRotatePageComponent, "pdf-rotate-page", never, { "showRotateButton": "showRotateButton"; "clockwise": "clockwise"; "counterClockwise": "counterClockwise"; }, {}, never, never>;
}
