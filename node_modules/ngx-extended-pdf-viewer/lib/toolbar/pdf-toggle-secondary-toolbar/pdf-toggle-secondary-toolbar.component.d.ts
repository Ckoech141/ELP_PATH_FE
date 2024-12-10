import { ResponsiveVisibility } from '../../responsive-visibility';
import { NgxExtendedPdfViewerService } from '../../ngx-extended-pdf-viewer.service';
import * as i0 from "@angular/core";
export declare class PdfToggleSecondaryToolbarComponent {
    service: NgxExtendedPdfViewerService;
    showSecondaryToolbarButton: ResponsiveVisibility;
    constructor(service: NgxExtendedPdfViewerService);
    onClick(event: Event): boolean;
    static ɵfac: i0.ɵɵFactoryDeclaration<PdfToggleSecondaryToolbarComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<PdfToggleSecondaryToolbarComponent, "pdf-toggle-secondary-toolbar", never, { "showSecondaryToolbarButton": "showSecondaryToolbarButton"; }, {}, never, never>;
}
