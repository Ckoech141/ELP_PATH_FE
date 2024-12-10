import { PDFNotificationService } from '../../pdf-notification-service';
import { ResponsiveVisibility } from '../../responsive-visibility';
import * as i0 from "@angular/core";
export declare class PdfTextEditorComponent {
    private notificationService;
    show: ResponsiveVisibility;
    isSelected: boolean;
    constructor(notificationService: PDFNotificationService);
    private onPdfJsInit;
    onClick(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<PdfTextEditorComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<PdfTextEditorComponent, "pdf-text-editor", never, { "show": "show"; }, {}, never, never>;
}
