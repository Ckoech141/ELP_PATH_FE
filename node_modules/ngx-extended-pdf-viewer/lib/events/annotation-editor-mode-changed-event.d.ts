import { PDFPageView } from '../options/pdf_page_view';
export interface AnnotationEditorEditorModeChangedEvent {
    source: PDFPageView;
    mode: 0 | 3 | 13 | 15;
}
