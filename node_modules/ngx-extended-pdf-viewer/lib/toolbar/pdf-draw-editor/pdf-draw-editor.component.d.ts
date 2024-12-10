import { PDFNotificationService } from '../../pdf-notification-service';
import { ResponsiveVisibility } from '../../responsive-visibility';
import * as i0 from "@angular/core";
export declare class PdfDrawEditorComponent {
    private notificationService;
    show: ResponsiveVisibility;
    isSelected: boolean;
    constructor(notificationService: PDFNotificationService);
    private onPdfJsInit;
    onClick(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<PdfDrawEditorComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<PdfDrawEditorComponent, "pdf-draw-editor", never, { "show": "show"; }, {}, never, never>;
}
