import { PipeTransform } from '@angular/core';
import * as i0 from "@angular/core";
export declare type ResponsiveVisibility = boolean | 'always-visible' | 'always-in-secondary-menu' | 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
export declare class PdfBreakpoints {
    static xs: number;
    static sm: number;
    static md: number;
    static lg: number;
    static xl: number;
    static xxl: number;
}
export declare type ResponsiveCSSClass = 'hiddenXXSView' | 'hiddenTinyView' | 'hiddenSmallView' | 'hiddenMediumView' | 'hiddenLargeView' | 'hiddenXLView' | 'hiddenXXLView' | 'invisible' | 'always-visible' | 'always-in-secondary-menu';
export declare type ResponsiveCSSClassInSecondaryToolbar = 'visibleXXSView' | 'visibleTinyView' | 'visibleSmallView' | 'visibleMediumView' | 'visibleLargeView' | 'visibleXLView' | 'visibleXXLView' | 'invisible' | 'always-visible' | 'always-in-secondary-menu';
export declare class ResponsiveCSSClassPipe implements PipeTransform {
    transform(visible: ResponsiveVisibility | undefined, defaultClass?: ResponsiveCSSClass): ResponsiveCSSClass;
    static ɵfac: i0.ɵɵFactoryDeclaration<ResponsiveCSSClassPipe, never>;
    static ɵpipe: i0.ɵɵPipeDeclaration<ResponsiveCSSClassPipe, "responsiveCSSClass">;
}
export declare class NegativeResponsiveCSSClassPipe implements PipeTransform {
    transform(visible: ResponsiveCSSClass | ResponsiveVisibility): ResponsiveCSSClassInSecondaryToolbar;
    static ɵfac: i0.ɵɵFactoryDeclaration<NegativeResponsiveCSSClassPipe, never>;
    static ɵpipe: i0.ɵɵPipeDeclaration<NegativeResponsiveCSSClassPipe, "invertForSecondaryToolbar">;
}
