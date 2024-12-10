import { PdfSidebarView } from './pdf-sidebar-views';
export interface IPDFViewerAppConfig {
    defaultUrl: string;
    filenameForDownload: string | undefined;
    sidebarViewOnLoad: PdfSidebarView;
    get(name: any): any;
    getAll(kind?: null): any;
    set(name: any, value: any): void;
    setAll(options: any): void;
    remove(name: any): void;
    /**
     * @ignore
     */
    _hasUserOptions(): boolean;
    openFileInput?: HTMLInputElement;
}
