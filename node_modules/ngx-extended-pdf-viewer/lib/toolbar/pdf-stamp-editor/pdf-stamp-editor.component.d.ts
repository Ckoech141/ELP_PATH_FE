import { PDFNotificationService } from '../../pdf-notification-service';
import { ResponsiveVisibility } from '../../responsive-visibility';
import * as i0 from "@angular/core";
export declare class PdfStampEditorComponent {
    private notificationService;
    show: ResponsiveVisibility;
    isSelected: boolean;
    get pdfJsVersion(): string;
    constructor(notificationService: PDFNotificationService);
    private onPdfJsInit;
    onClick(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<PdfStampEditorComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<PdfStampEditorComponent, "pdf-stamp-editor", never, { "show": "show"; }, {}, never, never>;
}
