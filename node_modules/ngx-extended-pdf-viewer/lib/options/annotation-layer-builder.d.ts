import { AnnotationStorage } from './pdf-annotation-storage';
import { PDFPageProxy } from './pdf-viewer-application';
export interface AnnotationLayerBuilder {
    pageDiv: HTMLDivElement;
    pdfPage: PDFPageProxy;
    annotationStorage: AnnotationStorage;
    imageResourcesPath: string;
    renderForms: boolean;
    enableScripting: boolean;
    annotationCanvasMap: Map<string, HTMLCanvasElement>;
}
