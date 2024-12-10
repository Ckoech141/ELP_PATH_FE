import { TemplateRef } from '@angular/core';
import { ResponsiveVisibility } from '../../responsive-visibility';
import * as i0 from "@angular/core";
export declare class PdfFindbarComponent {
    showFindButton: ResponsiveVisibility;
    mobileFriendlyZoomScale: number;
    findbarLeft: string | undefined;
    findbarTop: string | undefined;
    customFindbarInputArea: TemplateRef<any> | undefined;
    customFindbar: TemplateRef<any>;
    customFindbarButtons: TemplateRef<any> | undefined;
    showFindHighlightAll: boolean;
    showFindMatchCase: boolean;
    showFindCurrentPageOnly: boolean;
    showFindPageRange: boolean;
    showFindEntireWord: boolean;
    showFindEntirePhrase: boolean;
    showFindMatchDiacritics: boolean;
    showFindFuzzySearch: boolean;
    showFindResultsCount: boolean;
    showFindMessages: boolean;
    static ɵfac: i0.ɵɵFactoryDeclaration<PdfFindbarComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<PdfFindbarComponent, "pdf-findbar", never, { "showFindButton": "showFindButton"; "mobileFriendlyZoomScale": "mobileFriendlyZoomScale"; "findbarLeft": "findbarLeft"; "findbarTop": "findbarTop"; "customFindbarInputArea": "customFindbarInputArea"; "customFindbar": "customFindbar"; "customFindbarButtons": "customFindbarButtons"; "showFindHighlightAll": "showFindHighlightAll"; "showFindMatchCase": "showFindMatchCase"; "showFindCurrentPageOnly": "showFindCurrentPageOnly"; "showFindPageRange": "showFindPageRange"; "showFindEntireWord": "showFindEntireWord"; "showFindEntirePhrase": "showFindEntirePhrase"; "showFindMatchDiacritics": "showFindMatchDiacritics"; "showFindFuzzySearch": "showFindFuzzySearch"; "showFindResultsCount": "showFindResultsCount"; "showFindMessages": "showFindMessages"; }, {}, never, never>;
}
