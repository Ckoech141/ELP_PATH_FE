import { OnChanges, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import * as i0 from "@angular/core";
export declare class DynamicCssComponent implements OnInit, OnChanges, OnDestroy {
    private renderer;
    private document;
    private platformId;
    zoom: number;
    width: number;
    xxs: number;
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
    get style(): string;
    constructor(renderer: Renderer2, document: Document, platformId: any);
    ngOnInit(): void;
    ngOnChanges(): void;
    private injectStyle;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<DynamicCssComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<DynamicCssComponent, "pdf-dynamic-css", never, { "zoom": "zoom"; "width": "width"; }, {}, never, never>;
}
