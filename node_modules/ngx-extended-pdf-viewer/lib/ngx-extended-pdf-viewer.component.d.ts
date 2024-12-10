import { Location, PlatformLocation } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, ElementRef, EventEmitter, NgZone, OnChanges, OnDestroy, OnInit, Renderer2, SimpleChanges, TemplateRef } from '@angular/core';
import { FindResultMatchesCount, FindState } from './events/find-result';
import { PageRenderEvent } from './events/page-render-event';
import { PageRenderedEvent } from './events/page-rendered-event';
import { PagesLoadedEvent } from './events/pages-loaded-event';
import { PdfDownloadedEvent } from './events/pdf-downloaded-event';
import { PdfLoadedEvent } from './events/pdf-loaded-event';
import { PdfLoadingStartsEvent } from './events/pdf-loading-starts-event';
import { PdfThumbnailDrawnEvent } from './events/pdf-thumbnail-drawn-event';
import { ProgressBarEvent } from './events/progress-bar-event';
import { TextLayerRenderedEvent } from './events/textlayer-rendered';
import { NgxExtendedPdfViewerService } from './ngx-extended-pdf-viewer.service';
import { PageViewModeType, ScrollModeType } from './options/pdf-viewer';
import { PDFDocumentProxy } from './options/pdf-viewer-application';
import { VerbosityLevel } from './options/verbosity-level';
import { PdfDummyComponentsComponent } from './pdf-dummy-components/pdf-dummy-components.component';
import { PDFNotificationService } from './pdf-notification-service';
import { AnnotationEditorLayerRenderedEvent } from './events/annotation-editor-layer-rendered-event';
import { AnnotationEditorEditorModeChangedEvent } from './events/annotation-editor-mode-changed-event';
import { AnnotationLayerRenderedEvent } from './events/annotation-layer-rendered-event';
import { AttachmentLoadedEvent } from './events/attachment-loaded-event';
import { LayersLoadedEvent } from './events/layers-loaded-event';
import { OutlineLoadedEvent } from './events/outline-loaded-event';
import { XfaLayerRenderedEvent } from './events/xfa-layer-rendered-event';
import { PdfSidebarView } from './options/pdf-sidebar-views';
import { SpreadType } from './options/spread-type';
import { ResponsiveVisibility } from './responsive-visibility';
import * as i0 from "@angular/core";
export interface FormDataType {
    [fieldName: string]: null | string | number | boolean | string[];
}
export declare class NgxExtendedPdfViewerComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {
    private ngZone;
    private platformId;
    private notificationService;
    private location;
    private elementRef;
    private platformLocation;
    private cdr;
    service: NgxExtendedPdfViewerService;
    private renderer;
    private static originalPrint;
    ngxExtendedPdfViewerIncompletelyInitialized: boolean;
    private formSupport;
    /**
     * The dummy components are inserted automatically when the user customizes the toolbar
     * without adding every original toolbar item. Without the dummy components, the
     * initialization code of pdf.js crashes because it assume that every standard widget is there.
     */
    dummyComponents: PdfDummyComponentsComponent;
    root: ElementRef;
    customFindbarInputArea: TemplateRef<any> | undefined;
    customToolbar: TemplateRef<any> | undefined;
    customFindbar: TemplateRef<any> | undefined;
    customFindbarButtons: TemplateRef<any> | undefined;
    customPdfViewer: TemplateRef<any> | undefined;
    customSecondaryToolbar: TemplateRef<any> | undefined;
    customSidebar: TemplateRef<any> | undefined;
    customThumbnail: TemplateRef<any> | undefined;
    customFreeFloatingBar: TemplateRef<any> | undefined;
    showFreeFloatingBar: boolean;
    enableDragAndDrop: boolean;
    localizationInitialized: boolean;
    set formData(formData: FormDataType);
    disableForms: boolean;
    get formDataChange(): EventEmitter<FormDataType>;
    _pageViewMode: PageViewModeType;
    baseHref: string;
    /** This flag prevents trying to load a file twice if the user uploads it using the file upload dialog or via drag'n'drop */
    private srcChangeTriggeredByUser;
    get pageViewMode(): PageViewModeType;
    set pageViewMode(viewMode: PageViewModeType);
    pageViewModeChange: EventEmitter<PageViewModeType>;
    progress: EventEmitter<ProgressBarEvent>;
    private secondaryToolbarComponent;
    private sidebarComponent;
    private _src;
    srcChange: EventEmitter<string>;
    private _scrollMode;
    get scrollMode(): ScrollModeType;
    set scrollMode(value: ScrollModeType);
    scrollModeChange: EventEmitter<ScrollModeType>;
    authorization: Object | boolean | undefined;
    httpHeaders: Object | undefined;
    contextMenuAllowed: boolean;
    afterPrint: EventEmitter<void>;
    beforePrint: EventEmitter<void>;
    currentZoomFactor: EventEmitter<number>;
    /** This field stores the previous zoom level if the page is enlarged with a double-tap or double-click */
    private previousZoom;
    enablePrint: boolean;
    /**
     * Number of milliseconds to wait between initializing the PDF viewer and loading the PDF file.
     * Most users can let this parameter safely at it's default value of zero.
     * Set this to 1000 or higher if you run into timing problems (typically caused by loading the locale files
     * after the PDF files, so they are not available when the PDF viewer is initialized).
     */
    delayFirstView: number;
    showTextEditor: ResponsiveVisibility;
    showStampEditor: ResponsiveVisibility;
    showDrawEditor: ResponsiveVisibility;
    /** store the timeout id so it can be canceled if user leaves the page before the PDF is shown */
    private initTimeout;
    /** How many log messages should be printed?
     * Legal values: VerbosityLevel.INFOS (= 5), VerbosityLevel.WARNINGS (= 1), VerbosityLevel.ERRORS (= 0) */
    logLevel: VerbosityLevel;
    relativeCoordsOptions: Object;
    /** Use the minified (minifiedJSLibraries="true", which is the default) or the user-readable pdf.js library (minifiedJSLibraries="false") */
    minifiedJSLibraries: boolean;
    primaryMenuVisible: boolean;
    /** option to increase (or reduce) print resolution. Default is 150 (dpi). Sensible values
     * are 300, 600, and 1200. Note the increase memory consumption, which may even result in a browser crash. */
    printResolution: any;
    rotation: 0 | 90 | 180 | 270;
    rotationChange: EventEmitter<0 | 90 | 180 | 270>;
    annotationLayerRendered: EventEmitter<AnnotationLayerRenderedEvent>;
    annotationEditorLayerRendered: EventEmitter<AnnotationEditorLayerRenderedEvent>;
    xfaLayerRendered: EventEmitter<XfaLayerRenderedEvent>;
    outlineLoaded: EventEmitter<OutlineLoadedEvent>;
    attachmentsloaded: EventEmitter<AttachmentLoadedEvent>;
    layersloaded: EventEmitter<LayersLoadedEvent>;
    hasSignature: boolean;
    set src(url: string | ArrayBuffer | Blob | Uint8Array | URL | {
        range: any;
    });
    set base64Src(base64: string | null | undefined);
    /**
     * The combination of height, minHeight, and autoHeight ensures the PDF height of the PDF viewer is calculated correctly when the height is a percentage.
     * By default, many CSS frameworks make a div with 100% have a height or zero pixels. checkHeigth() fixes this.
     */
    private autoHeight;
    minHeight: string | undefined;
    private _height;
    set height(h: string);
    get height(): string;
    private _useBrowserLocale;
    get useBrowserLocale(): boolean;
    /**
     * If this flag is true, this components adds a link to the locale assets. The pdf viewer
     * sees this link and uses it to load the locale files automatically.
     * @param useBrowserLocale boolean
     */
    set useBrowserLocale(value: boolean);
    forceUsingLegacyES5: boolean;
    backgroundColor: string;
    /** Allows the user to define the name of the file after clicking "download" */
    filenameForDownload: string | undefined;
    /** Allows the user to disable the keyboard bindings completely */
    ignoreKeyboard: boolean;
    /** Allows the user to disable a list of key bindings. */
    ignoreKeys: Array<string>;
    /** Allows the user to enable a list of key bindings explicitly. If this property is set, every other key binding is ignored. */
    acceptKeys: Array<string>;
    /** Allows the user to put the viewer's svg images into an arbitrary folder */
    imageResourcesPath: string;
    /** Allows the user to put their locale folder into an arbitrary folder */
    localeFolderPath: string;
    /** Override the default locale. This must be the complete locale name, such as "es-ES". The string is allowed to be all lowercase.
     */
    language: string | undefined;
    /** By default, listening to the URL is deactivated because often the anchor tag is used for the Angular router */
    listenToURL: boolean;
    /** Navigate to a certain "named destination" */
    nameddest: string | undefined;
    /** allows you to pass a password to read password-protected files */
    password: string | undefined;
    replaceBrowserPrint: boolean;
    _showSidebarButton: ResponsiveVisibility;
    viewerPositionTop: string;
    /** pdf.js can show signatures, but fails to verify them. So they are switched off by default.
     * Set "[showUnverifiedSignatures]"="true" to display e-signatures nonetheless.
     */
    showUnverifiedSignatures: boolean;
    startTabindex: number | undefined;
    get showSidebarButton(): ResponsiveVisibility;
    set showSidebarButton(show: ResponsiveVisibility);
    private _sidebarVisible;
    get sidebarVisible(): boolean | undefined;
    set sidebarVisible(value: boolean | undefined);
    sidebarVisibleChange: EventEmitter<boolean>;
    activeSidebarView: PdfSidebarView;
    activeSidebarViewChange: EventEmitter<PdfSidebarView>;
    findbarVisible: boolean;
    findbarVisibleChange: EventEmitter<boolean>;
    propertiesDialogVisible: boolean;
    propertiesDialogVisibleChange: EventEmitter<boolean>;
    showFindButton: ResponsiveVisibility | undefined;
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
    showPagingButtons: ResponsiveVisibility;
    showZoomButtons: ResponsiveVisibility;
    showPresentationModeButton: ResponsiveVisibility;
    showOpenFileButton: ResponsiveVisibility;
    showPrintButton: ResponsiveVisibility;
    showDownloadButton: ResponsiveVisibility;
    theme: 'dark' | 'light' | 'custom' | string;
    showToolbar: boolean;
    showSecondaryToolbarButton: ResponsiveVisibility;
    showSinglePageModeButton: ResponsiveVisibility;
    showVerticalScrollButton: ResponsiveVisibility;
    showHorizontalScrollButton: ResponsiveVisibility;
    showWrappedScrollButton: ResponsiveVisibility;
    showInfiniteScrollButton: ResponsiveVisibility;
    showBookModeButton: ResponsiveVisibility;
    showRotateButton: ResponsiveVisibility;
    private _handTool;
    set handTool(handTool: boolean);
    get handTool(): boolean;
    handToolChange: EventEmitter<boolean>;
    showHandToolButton: ResponsiveVisibility;
    private _showScrollingButton;
    get showScrollingButton(): ResponsiveVisibility;
    set showScrollingButton(val: ResponsiveVisibility);
    showSpreadButton: ResponsiveVisibility;
    showPropertiesButton: ResponsiveVisibility;
    showBorders: boolean;
    spread: SpreadType;
    spreadChange: EventEmitter<"off" | "even" | "odd">;
    thumbnailDrawn: EventEmitter<PdfThumbnailDrawnEvent>;
    private _page;
    get page(): number | undefined;
    set page(p: number | undefined);
    pageChange: EventEmitter<number>;
    pageLabel: string | undefined;
    pageLabelChange: EventEmitter<string>;
    pagesLoaded: EventEmitter<PagesLoadedEvent>;
    pageRender: EventEmitter<PageRenderEvent>;
    pageRendered: EventEmitter<PageRenderedEvent>;
    pdfDownloaded: EventEmitter<PdfDownloadedEvent>;
    pdfLoaded: EventEmitter<PdfLoadedEvent>;
    pdfLoadingStarts: EventEmitter<PdfLoadingStartsEvent>;
    pdfLoadingFailed: EventEmitter<Error>;
    textLayer: boolean | undefined;
    textLayerRendered: EventEmitter<TextLayerRenderedEvent>;
    annotationEditorModeChanged: EventEmitter<AnnotationEditorEditorModeChangedEvent>;
    updateFindMatchesCount: EventEmitter<FindResultMatchesCount>;
    updateFindState: EventEmitter<FindState>;
    /** Legal values: undefined, 'auto', 'page-actual', 'page-fit', 'page-width', or '50' (or any other percentage) */
    zoom: string | number | undefined;
    zoomChange: EventEmitter<string | number>;
    zoomLevels: (string | number)[];
    maxZoom: number;
    minZoom: number;
    /** This attribute allows you to increase the size of the UI elements so you can use them on small mobile devices.
     * This attribute is a string with a percent character at the end (e.g. "150%").
     */
    _mobileFriendlyZoom: string;
    mobileFriendlyZoomScale: number;
    toolbarMarginTop: string;
    toolbarWidth: string;
    private toolbar;
    onToolbarLoaded(toolbarElement: HTMLElement): void;
    toolbarWidthInPixels: number;
    secondaryToolbarTop: string | undefined;
    sidebarPositionTop: string | undefined;
    findbarTop: string | undefined;
    findbarLeft: string | undefined;
    get mobileFriendlyZoom(): string;
    get pdfJsVersion(): string;
    get majorMinorPdfJsVersion(): string;
    /**
     * This attributes allows you to increase the size of the UI elements so you can use them on small mobile devices.
     * This attribute is a string with a percent character at the end (e.g. "150%").
     */
    set mobileFriendlyZoom(zoom: string);
    private shuttingDown;
    serverSideRendering: boolean;
    calcViewerPositionTop(): void;
    constructor(ngZone: NgZone, platformId: any, notificationService: PDFNotificationService, location: Location, elementRef: ElementRef, platformLocation: PlatformLocation, cdr: ChangeDetectorRef, service: NgxExtendedPdfViewerService, renderer: Renderer2);
    private iOSVersionRequiresES5;
    private needsES5;
    private supportsOptionalChaining;
    private addScriptOpChainingSupport;
    private createScriptElement;
    private getPdfJsPath;
    private loadViewer;
    private addFeatures;
    ngOnInit(): void;
    private loadPdfJs;
    ngAfterViewInit(): void;
    private assignTabindexes;
    private showElementsRecursively;
    private collectElementPositions;
    private doInitPDFViewer;
    private addTranslationsUnlessProvidedByTheUser;
    private hideToolbarIfItIsEmpty;
    /** Notifies every widget that implements onLibraryInit() that the PDF viewer objects are available */
    private afterLibraryInit;
    checkHeight(): void;
    private calculateBorderMargin;
    onSpreadChange(newSpread: 'off' | 'even' | 'odd'): void;
    private activateTextlayerIfNecessary;
    private overrideDefaultSettings;
    private openPDF;
    private removeScrollbarInInfiniteScrollMode;
    openPDF2(): Promise<void>;
    private selectCursorTool;
    ngOnDestroy(): Promise<void>;
    private isPrimaryMenuVisible;
    ngOnChanges(changes: SimpleChanges): Promise<void>;
    private setZoom;
    onResize(): void;
    onContextMenu(): boolean;
    scrollSignatureWarningIntoView(pdf: PDFDocumentProxy): Promise<void>;
    zoomToPageWidth(event: MouseEvent): Promise<void>;
    private enableOrDisableForms;
    static ɵfac: i0.ɵɵFactoryDeclaration<NgxExtendedPdfViewerComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<NgxExtendedPdfViewerComponent, "ngx-extended-pdf-viewer", never, { "customFindbarInputArea": "customFindbarInputArea"; "customToolbar": "customToolbar"; "customFindbar": "customFindbar"; "customFindbarButtons": "customFindbarButtons"; "customPdfViewer": "customPdfViewer"; "customSecondaryToolbar": "customSecondaryToolbar"; "customSidebar": "customSidebar"; "customThumbnail": "customThumbnail"; "customFreeFloatingBar": "customFreeFloatingBar"; "showFreeFloatingBar": "showFreeFloatingBar"; "enableDragAndDrop": "enableDragAndDrop"; "formData": "formData"; "disableForms": "disableForms"; "pageViewMode": "pageViewMode"; "scrollMode": "scrollMode"; "authorization": "authorization"; "httpHeaders": "httpHeaders"; "contextMenuAllowed": "contextMenuAllowed"; "enablePrint": "enablePrint"; "delayFirstView": "delayFirstView"; "showTextEditor": "showTextEditor"; "showStampEditor": "showStampEditor"; "showDrawEditor": "showDrawEditor"; "logLevel": "logLevel"; "relativeCoordsOptions": "relativeCoordsOptions"; "minifiedJSLibraries": "minifiedJSLibraries"; "printResolution": "printResolution"; "rotation": "rotation"; "src": "src"; "base64Src": "base64Src"; "minHeight": "minHeight"; "height": "height"; "useBrowserLocale": "useBrowserLocale"; "forceUsingLegacyES5": "forceUsingLegacyES5"; "backgroundColor": "backgroundColor"; "filenameForDownload": "filenameForDownload"; "ignoreKeyboard": "ignoreKeyboard"; "ignoreKeys": "ignoreKeys"; "acceptKeys": "acceptKeys"; "imageResourcesPath": "imageResourcesPath"; "localeFolderPath": "localeFolderPath"; "language": "language"; "listenToURL": "listenToURL"; "nameddest": "nameddest"; "password": "password"; "replaceBrowserPrint": "replaceBrowserPrint"; "showUnverifiedSignatures": "showUnverifiedSignatures"; "startTabindex": "startTabindex"; "showSidebarButton": "showSidebarButton"; "sidebarVisible": "sidebarVisible"; "activeSidebarView": "activeSidebarView"; "findbarVisible": "findbarVisible"; "propertiesDialogVisible": "propertiesDialogVisible"; "showFindButton": "showFindButton"; "showFindHighlightAll": "showFindHighlightAll"; "showFindMatchCase": "showFindMatchCase"; "showFindCurrentPageOnly": "showFindCurrentPageOnly"; "showFindPageRange": "showFindPageRange"; "showFindEntireWord": "showFindEntireWord"; "showFindEntirePhrase": "showFindEntirePhrase"; "showFindMatchDiacritics": "showFindMatchDiacritics"; "showFindFuzzySearch": "showFindFuzzySearch"; "showFindResultsCount": "showFindResultsCount"; "showFindMessages": "showFindMessages"; "showPagingButtons": "showPagingButtons"; "showZoomButtons": "showZoomButtons"; "showPresentationModeButton": "showPresentationModeButton"; "showOpenFileButton": "showOpenFileButton"; "showPrintButton": "showPrintButton"; "showDownloadButton": "showDownloadButton"; "theme": "theme"; "showToolbar": "showToolbar"; "showSecondaryToolbarButton": "showSecondaryToolbarButton"; "showSinglePageModeButton": "showSinglePageModeButton"; "showVerticalScrollButton": "showVerticalScrollButton"; "showHorizontalScrollButton": "showHorizontalScrollButton"; "showWrappedScrollButton": "showWrappedScrollButton"; "showInfiniteScrollButton": "showInfiniteScrollButton"; "showBookModeButton": "showBookModeButton"; "showRotateButton": "showRotateButton"; "handTool": "handTool"; "showHandToolButton": "showHandToolButton"; "showScrollingButton": "showScrollingButton"; "showSpreadButton": "showSpreadButton"; "showPropertiesButton": "showPropertiesButton"; "showBorders": "showBorders"; "spread": "spread"; "page": "page"; "pageLabel": "pageLabel"; "textLayer": "textLayer"; "zoom": "zoom"; "zoomLevels": "zoomLevels"; "maxZoom": "maxZoom"; "minZoom": "minZoom"; "mobileFriendlyZoom": "mobileFriendlyZoom"; }, { "formDataChange": "formDataChange"; "pageViewModeChange": "pageViewModeChange"; "progress": "progress"; "srcChange": "srcChange"; "scrollModeChange": "scrollModeChange"; "afterPrint": "afterPrint"; "beforePrint": "beforePrint"; "currentZoomFactor": "currentZoomFactor"; "rotationChange": "rotationChange"; "annotationLayerRendered": "annotationLayerRendered"; "annotationEditorLayerRendered": "annotationEditorLayerRendered"; "xfaLayerRendered": "xfaLayerRendered"; "outlineLoaded": "outlineLoaded"; "attachmentsloaded": "attachmentsloaded"; "layersloaded": "layersloaded"; "sidebarVisibleChange": "sidebarVisibleChange"; "activeSidebarViewChange": "activeSidebarViewChange"; "findbarVisibleChange": "findbarVisibleChange"; "propertiesDialogVisibleChange": "propertiesDialogVisibleChange"; "handToolChange": "handToolChange"; "spreadChange": "spreadChange"; "thumbnailDrawn": "thumbnailDrawn"; "pageChange": "pageChange"; "pageLabelChange": "pageLabelChange"; "pagesLoaded": "pagesLoaded"; "pageRender": "pageRender"; "pageRendered": "pageRendered"; "pdfDownloaded": "pdfDownloaded"; "pdfLoaded": "pdfLoaded"; "pdfLoadingStarts": "pdfLoadingStarts"; "pdfLoadingFailed": "pdfLoadingFailed"; "textLayerRendered": "textLayerRendered"; "annotationEditorModeChanged": "annotationEditorModeChanged"; "updateFindMatchesCount": "updateFindMatchesCount"; "updateFindState": "updateFindState"; "zoomChange": "zoomChange"; }, never, ["*", "*"]>;
}
