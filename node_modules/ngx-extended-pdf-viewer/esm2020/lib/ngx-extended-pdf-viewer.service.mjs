import { Subject } from 'rxjs';
export class NgxExtendedPdfViewerService {
    constructor() {
        this.ngxExtendedPdfViewerInitialized = false;
        this.recalculateSize$ = new Subject();
        this.secondaryMenuIsEmpty = false;
    }
    find(text, options = {}) {
        if (!this.ngxExtendedPdfViewerInitialized) {
            // tslint:disable-next-line:quotemark
            console.error("The PDF viewer hasn't finished initializing. Please call find() later.");
            return false;
        }
        else {
            const highlightAllCheckbox = document.getElementById('findHighlightAll');
            if (highlightAllCheckbox) {
                highlightAllCheckbox.checked = options.highlightAll ?? false;
            }
            const matchCaseCheckbox = document.getElementById('findMatchCase');
            if (matchCaseCheckbox) {
                matchCaseCheckbox.checked = options.matchCase ?? false;
            }
            const entireWordCheckbox = document.getElementById('findEntireWord');
            if (entireWordCheckbox) {
                entireWordCheckbox.checked = options.wholeWords ?? false;
            }
            const matchDiacriticsCheckbox = document.getElementById('findMatchDiacritics');
            if (matchDiacriticsCheckbox) {
                matchDiacriticsCheckbox.checked = options.matchDiacritics ?? false;
            }
            const inputField = document.getElementById('findInput');
            if (inputField) {
                inputField.value = text;
                // todo dirty hack!
                inputField.classList.remove('hidden');
                // end of the dirty hack
                inputField.dispatchEvent(new Event('input'));
                return true;
            }
            else {
                // tslint:disable-next-line:quotemark
                console.error("Unexpected error: the input field used to search isn't part of the DOM.");
                return false;
            }
        }
    }
    findNext() {
        if (!this.ngxExtendedPdfViewerInitialized) {
            // tslint:disable-next-line:quotemark
            console.error("The PDF viewer hasn't finished initializing. Please call findNext() later.");
            return false;
        }
        else {
            const button = document.getElementById('findNext');
            if (button) {
                button.click();
                return true;
            }
            return false;
        }
    }
    findPrevious() {
        if (!this.ngxExtendedPdfViewerInitialized) {
            // tslint:disable-next-line:quotemark
            console.error("The PDF viewer hasn't finished initializing. Please call findPrevious() later.");
            return false;
        }
        else {
            const button = document.getElementById('findPrevious');
            if (button) {
                button.click();
                return true;
            }
            return false;
        }
    }
    print(printRange) {
        const PDFViewerApplication = window.PDFViewerApplication;
        const alreadyThere = !!window['isInPDFPrintRange'] && !printRange;
        if (!alreadyThere) {
            if (!printRange) {
                printRange = {};
            }
            this.setPrintRange(printRange);
        }
        window.printPDF();
        if (!alreadyThere) {
            PDFViewerApplication.eventBus.on('afterprint', () => {
                this.removePrintRange();
            });
        }
    }
    removePrintRange() {
        window['isInPDFPrintRange'] = undefined;
        window['filteredPageCount'] = undefined;
    }
    setPrintRange(printRange) {
        const PDFViewerApplication = window.PDFViewerApplication;
        window['isInPDFPrintRange'] = (page) => this.isInPDFPrintRange(page, printRange);
        window['filteredPageCount'] = this.filteredPageCount(PDFViewerApplication.pagesCount, printRange);
    }
    filteredPageCount(pageCount, range) {
        let result = 0;
        for (let page = 1; page <= pageCount; page++) {
            if (this.isInPDFPrintRange(page, range)) {
                result++;
            }
        }
        return result;
    }
    isInPDFPrintRange(pageIndex, printRange) {
        const page = pageIndex + 1;
        if (printRange.from) {
            if (page < printRange.from) {
                return false;
            }
        }
        if (printRange.to) {
            if (page > printRange.to) {
                return false;
            }
        }
        if (printRange.excluded) {
            if (printRange.excluded.some((p) => p === page)) {
                return false;
            }
        }
        if (printRange.included) {
            if (!printRange.included.some((p) => p === page)) {
                return false;
            }
        }
        return true;
    }
    async getPageAsLines(pageNumber) {
        const PDFViewerApplication = window.PDFViewerApplication;
        const pdfDocument = PDFViewerApplication.pdfDocument;
        const page = await pdfDocument.getPage(pageNumber);
        const textSnippets = (await page.getTextContent()).items //
            .filter((info) => !info['type']); // ignore the TextMarkedContent items
        const snippets = textSnippets;
        let minX = Number.MAX_SAFE_INTEGER;
        let minY = Number.MAX_SAFE_INTEGER;
        let maxX = Number.MIN_SAFE_INTEGER;
        let maxY = Number.MIN_SAFE_INTEGER;
        let countLTR = 0;
        let countRTL = 0;
        let text = '';
        let lines = new Array();
        for (let i = 0; i < snippets.length; i++) {
            const currentSnippet = snippets[i];
            if (!currentSnippet.hasEOL) {
                const x = currentSnippet.transform[4];
                const y = -currentSnippet.transform[5];
                const width = currentSnippet.width;
                const height = currentSnippet.height;
                minX = Math.min(minX, x);
                minY = Math.min(minY, y);
                maxX = Math.max(maxX, x + width);
                maxY = Math.max(maxY, y + height);
                text += currentSnippet.str;
                if (currentSnippet.dir === 'rtl') {
                    countRTL++;
                }
                if (currentSnippet.dir === 'ltr') {
                    countLTR++;
                }
            }
            let addIt = i === snippets.length - 1 || currentSnippet.hasEOL;
            if (addIt) {
                let direction = undefined;
                if (countLTR > 0 && countRTL > 0) {
                    direction = 'both';
                }
                else if (countLTR > 0) {
                    direction = 'ltr';
                }
                else if (countRTL > 0) {
                    direction = 'rtl';
                }
                const line = {
                    direction,
                    x: minX,
                    y: minY,
                    width: maxX - minX,
                    height: maxY - minY,
                    text: text.trim(),
                };
                lines.push(line);
                minX = Number.MAX_SAFE_INTEGER;
                minY = Number.MAX_SAFE_INTEGER;
                maxX = Number.MIN_SAFE_INTEGER;
                maxY = Number.MIN_SAFE_INTEGER;
                countLTR = 0;
                countRTL = 0;
                text = '';
            }
        }
        return lines;
    }
    async getPageAsText(pageNumber) {
        const PDFViewerApplication = window.PDFViewerApplication;
        const pdfDocument = PDFViewerApplication.pdfDocument;
        const page = await pdfDocument.getPage(pageNumber);
        const textSnippets = (await page.getTextContent()).items;
        return this.convertTextInfoToText(textSnippets);
    }
    convertTextInfoToText(textInfoItems) {
        if (!textInfoItems) {
            return '';
        }
        return textInfoItems
            .filter((info) => !info['type'])
            .map((info) => (info.hasEOL ? info.str + '\n' : info.str))
            .join('');
    }
    getPageAsImage(pageNumber, scale, background, backgroundColorToReplace = '#FFFFFF') {
        const PDFViewerApplication = window.PDFViewerApplication;
        const pdfDocument = PDFViewerApplication.pdfDocument;
        const pagePromise = pdfDocument.getPage(pageNumber);
        const imagePromise = (pdfPage) => Promise.resolve(this.draw(pdfPage, scale, background, backgroundColorToReplace));
        return pagePromise.then(imagePromise);
    }
    draw(pdfPage, scale, background, backgroundColorToReplace = '#FFFFFF') {
        let zoomFactor = 1;
        if (scale.scale) {
            zoomFactor = scale.scale;
        }
        else if (scale.width) {
            zoomFactor = scale.width / pdfPage.getViewport({ scale: 1 }).width;
        }
        else if (scale.height) {
            zoomFactor = scale.height / pdfPage.getViewport({ scale: 1 }).height;
        }
        const viewport = pdfPage.getViewport({
            scale: zoomFactor,
        });
        const { ctx, canvas } = this.getPageDrawContext(viewport.width, viewport.height);
        const drawViewport = viewport.clone();
        const renderContext = {
            canvasContext: ctx,
            viewport: drawViewport,
            background,
            backgroundColorToReplace,
        };
        const renderTask = pdfPage.render(renderContext);
        const dataUrlPromise = () => Promise.resolve(canvas.toDataURL());
        return renderTask.promise.then(dataUrlPromise);
    }
    getPageDrawContext(width, height) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d', { alpha: true });
        if (!ctx) {
            // tslint:disable-next-line: quotemark
            throw new Error("Couldn't create the 2d context");
        }
        canvas.width = width;
        canvas.height = height;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        return { ctx, canvas };
    }
    async getCurrentDocumentAsBlob() {
        const PDFViewerApplication = window.PDFViewerApplication;
        return await PDFViewerApplication.export();
    }
    async getFormData(currentFormValues = true) {
        const PDFViewerApplication = window.PDFViewerApplication;
        const pdf = PDFViewerApplication.pdfDocument;
        // screen DPI / PDF DPI
        const dpiRatio = 96 / 72;
        const result = [];
        for (let i = 1; i <= pdf?.numPages; i++) {
            // track the current page
            const currentPage /* : PDFPageProxy */ = await pdf.getPage(i);
            const annotations = await currentPage.getAnnotations();
            annotations
                .filter((a) => a.subtype === 'Widget') // get the form field annotations only
                .map((a) => ({ ...a })) // only expose copies of the annotations to avoid side-effects
                .forEach((a) => {
                // get the rectangle that represent the single field
                // and resize it according to the current DPI
                const fieldRect = currentPage.getViewport({ scale: dpiRatio }).convertToViewportRectangle(a.rect);
                // add the corresponding input
                if (currentFormValues && a.fieldName) {
                    try {
                        if (a.exportValue) {
                            const currentValue = PDFViewerApplication.pdfDocument.annotationStorage.getValue(a.id, a.fieldName + '/' + a.exportValue, '');
                            a.value = currentValue?.value;
                        }
                        else if (a.radioButton) {
                            const currentValue = PDFViewerApplication.pdfDocument.annotationStorage.getValue(a.id, a.fieldName + '/' + a.fieldValue, '');
                            a.value = currentValue?.value;
                        }
                        else {
                            const currentValue = PDFViewerApplication.pdfDocument.annotationStorage.getValue(a.id, a.fieldName, '');
                            a.value = currentValue?.value;
                        }
                    }
                    catch (exception) {
                        // just ignore it
                    }
                }
                result.push({ fieldAnnotation: a, fieldRect, pageNumber: i });
            });
        }
        return result;
    }
    /**
     * Adds a page to the rendering queue
     * @param {number} pageIndex Index of the page to render
     * @returns {boolean} false, if the page has already been rendered
     * or if it's out of range
     */
    addPageToRenderQueue(pageIndex) {
        const PDFViewerApplication = window.PDFViewerApplication;
        return PDFViewerApplication.pdfViewer.addPageToRenderQueue(pageIndex);
    }
    isRenderQueueEmpty() {
        const scrolledDown = true;
        const renderExtra = false;
        const PDFViewerApplication = window.PDFViewerApplication;
        const nextPage = PDFViewerApplication.pdfViewer.renderingQueue.getHighestPriority(PDFViewerApplication.pdfViewer._getVisiblePages(), PDFViewerApplication.pdfViewer._pages, scrolledDown, renderExtra);
        return !nextPage;
    }
    hasPageBeenRendered(pageIndex) {
        const PDFViewerApplication = window.PDFViewerApplication;
        const pages = PDFViewerApplication.pdfViewer._pages;
        if (pages.length > pageIndex && pageIndex >= 0) {
            const pageView = pages[pageIndex];
            const isLoading = pageView.renderingState === 3;
            return !isLoading;
        }
        return false;
    }
    currentlyRenderedPages() {
        const PDFViewerApplication = window.PDFViewerApplication;
        const pages = PDFViewerApplication.pdfViewer._pages;
        return pages.filter((page) => page.renderingState === 3).map((page) => page.id);
    }
    numberOfPages() {
        const PDFViewerApplication = window.PDFViewerApplication;
        const pages = PDFViewerApplication.pdfViewer._pages;
        return pages.length;
    }
    getCurrentlyVisiblePageNumbers() {
        const app = window.PDFViewerApplication;
        const pages = app.pdfViewer._getVisiblePages().views;
        return pages?.map((page) => page.id);
    }
    recalculateSize() {
        this.recalculateSize$.next();
    }
    async listLayers() {
        const PDFViewerApplication = window.PDFViewerApplication;
        const optionalContentConfig = await PDFViewerApplication.pdfViewer.optionalContentConfigPromise;
        if (optionalContentConfig) {
            const levelData = optionalContentConfig.getOrder();
            const layerIds = levelData.filter((groupId) => typeof groupId !== 'object');
            return layerIds.map((layerId) => {
                const config = optionalContentConfig.getGroup(layerId);
                return {
                    layerId: layerId,
                    name: config.name,
                    visible: config.visible,
                };
            });
        }
        return undefined;
    }
    async toggleLayer(layerId) {
        const PDFViewerApplication = window.PDFViewerApplication;
        const optionalContentConfig = await PDFViewerApplication.pdfViewer.optionalContentConfigPromise;
        if (optionalContentConfig) {
            let isVisible = optionalContentConfig.getGroup(layerId).visible;
            const checkbox = document.querySelector(`input[id='${layerId}']`);
            if (checkbox) {
                isVisible = checkbox.checked;
                checkbox.checked = !isVisible;
            }
            optionalContentConfig.setVisibility(layerId, !isVisible);
            PDFViewerApplication.eventBus.dispatch('optionalcontentconfig', {
                source: this,
                promise: Promise.resolve(optionalContentConfig),
            });
        }
    }
    scrollPageIntoView(pageNumber, pageSpot) {
        const PDFViewerApplication = window.PDFViewerApplication;
        const viewer = PDFViewerApplication.pdfViewer;
        viewer.scrollPagePosIntoView(pageNumber, pageSpot);
    }
    getSerializedAnnotations() {
        const PDFViewerApplication = window.PDFViewerApplication;
        return PDFViewerApplication.pdfViewer.getSerializedAnnotations();
    }
    addEditorAnnotation(serializedAnnotation) {
        const PDFViewerApplication = window.PDFViewerApplication;
        PDFViewerApplication.pdfViewer.addEditorAnnotation(serializedAnnotation);
    }
    removeEditorAnnotations(filter) {
        const PDFViewerApplication = window.PDFViewerApplication;
        PDFViewerApplication.pdfViewer.removeEditorAnnotations(filter);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWV4dGVuZGVkLXBkZi12aWV3ZXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL25neC1leHRlbmRlZC1wZGYtdmlld2VyL3NyYy9saWIvbmd4LWV4dGVuZGVkLXBkZi12aWV3ZXIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBMkMvQixNQUFNLE9BQU8sMkJBQTJCO0lBQXhDO1FBRVMsb0NBQStCLEdBQUcsS0FBSyxDQUFDO1FBRXhDLHFCQUFnQixHQUFHLElBQUksT0FBTyxFQUFRLENBQUM7UUFFdkMseUJBQW9CLEdBQUcsS0FBSyxDQUFDO0lBb2J0QyxDQUFDO0lBbGJRLElBQUksQ0FBQyxJQUFZLEVBQUUsVUFBdUIsRUFBRTtRQUNqRCxJQUFJLENBQUMsSUFBSSxDQUFDLCtCQUErQixFQUFFO1lBQ3pDLHFDQUFxQztZQUNyQyxPQUFPLENBQUMsS0FBSyxDQUFDLHdFQUF3RSxDQUFDLENBQUM7WUFDeEYsT0FBTyxLQUFLLENBQUM7U0FDZDthQUFNO1lBQ0wsTUFBTSxvQkFBb0IsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLGtCQUFrQixDQUFxQixDQUFDO1lBQzdGLElBQUksb0JBQW9CLEVBQUU7Z0JBQ3hCLG9CQUFvQixDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUMsWUFBWSxJQUFJLEtBQUssQ0FBQzthQUM5RDtZQUVELE1BQU0saUJBQWlCLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxlQUFlLENBQXFCLENBQUM7WUFDdkYsSUFBSSxpQkFBaUIsRUFBRTtnQkFDckIsaUJBQWlCLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQyxTQUFTLElBQUksS0FBSyxDQUFDO2FBQ3hEO1lBQ0QsTUFBTSxrQkFBa0IsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLGdCQUFnQixDQUFxQixDQUFDO1lBQ3pGLElBQUks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T0FBTyxvQkFBb0IsQ0FBQyxTQUFTLENBQUMsd0JBQXdCLEVBQUUsQ0FBQztJQUNuRSxDQUFDO0lBRU0sbUJBQW1CLENBQUMsb0JBQStDO1FBQ3hFLE1BQU0sb0JBQW9CLEdBQTJCLE1BQWMsQ0FBQyxvQkFBb0IsQ0FBQztRQUN6RixvQkFBb0IsQ0FBQyxTQUFTLENBQUMsbUJBQW1CLENBQUMsb0JBQW9CLENBQUMsQ0FBQztJQUMzRSxDQUFDO0lBRU0sdUJBQXVCLENBQUMsTUFBd0M7UUFDckUsTUFBTSxvQkFBb0IsR0FBMkIsTUFBYyxDQUFDLG9CQUFvQixDQUFDO1FBQ3pGLG9CQUFvQixDQUFDLFNBQVMsQ0FBQyx1QkFBdUIsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNqRSxDQUFDO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBTdWJqZWN0IH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBQZGZMYXllciB9IGZyb20gJy4vb3B0aW9ucy9vcHRpb25hbF9jb250ZW50X2NvbmZpZyc7XG5pbXBvcnQgeyBQREZQcmludFJhbmdlIH0gZnJvbSAnLi9vcHRpb25zL3BkZi1wcmludC1yYW5nZSc7XG5pbXBvcnQgeyBJUERGVmlld2VyQXBwbGljYXRpb24sIFBERkRvY3VtZW50UHJveHksIFRleHRJdGVtLCBUZXh0TWFya2VkQ29udGVudCB9IGZyb20gJy4vb3B0aW9ucy9wZGYtdmlld2VyLWFwcGxpY2F0aW9uJztcbmltcG9ydCB7IEVkaXRvckFubm90YXRpb24gfSBmcm9tICcuL29wdGlvbnMvcGRmLXZpZXdlcic7XG5cbmV4cG9ydCBpbnRlcmZhY2UgRmluZE9wdGlvbnMge1xuICBoaWdobGlnaHRBbGw/OiBib29sZWFuO1xuICBtYXRjaENhc2U/OiBib29sZWFuO1xuICB3aG9sZVdvcmRzPzogYm9vbGVhbjtcbiAgbWF0Y2hEaWFjcml0aWNzPzogYm9vbGVhbjtcbn1cblxuaW50ZXJmYWNlIERyYXdDb250ZXh0IHtcbiAgY3R4OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7XG4gIGNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQ7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgUERGRXhwb3J0U2NhbGVGYWN0b3Ige1xuICB3aWR0aD86IG51bWJlcjtcbiAgaGVpZ2h0PzogbnVtYmVyO1xuICBzY2FsZT86IG51bWJlcjtcbn1cblxudHlwZSBEaXJlY3Rpb25UeXBlID0gJ2x0cicgfCAncnRsJyB8ICdib3RoJyB8IHVuZGVmaW5lZDtcblxuZXhwb3J0IGludGVyZmFjZSBMaW5lIHtcbiAgeDogbnVtYmVyO1xuICB5OiBudW1iZXI7XG4gIHdpZHRoOiBudW1iZXI7XG4gIGhlaWdodDogbnVtYmVyO1xuICBkaXJlY3Rpb246IERpcmVjdGlvblR5cGU7XG4gIHRleHQ6IHN0cmluZztcbn1cbmV4cG9ydCBpbnRlcmZhY2UgU2VjdGlvbiB7XG4gIHg6IG51bWJlcjtcbiAgeTogbnVtYmVyO1xuICB3aWR0aDogbnVtYmVyO1xuICBoZWlnaHQ6IG51bWJlcjtcbiAgZGlyZWN0aW9uOiBEaXJlY3Rpb25UeXBlO1xuICBsaW5lczogQXJyYXk8TGluZT47XG59XG5cbmV4cG9ydCBjbGFzcyBOZ3hFeHRlbmRlZFBkZlZpZXdlclNlcnZpY2Uge1xuXG4gIHB1YmxpYyBuZ3hFeHRlbmRlZFBkZlZpZXdlckluaXRpYWxpemVkID0gZmFsc2U7XG5cbiAgcHVibGljIHJlY2FsY3VsYXRlU2l6ZSQgPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuXG4gIHB1YmxpYyBzZWNvbmRhcnlNZW51SXNFbXB0eSA9IGZhbHNlO1xuXG4gIHB1YmxpYyBmaW5kKHRleHQ6IHN0cmluZywgb3B0aW9uczogRmluZE9wdGlvbnMgPSB7fSk6IGJvb2xlYW4ge1xuICAgIGlmICghdGhpcy5uZ3hFeHRlbmRlZFBkZlZpZXdlckluaXRpYWxpemVkKSB7XG4gICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6cXVvdGVtYXJrXG4gICAgICBjb25zb2xlLmVycm9yKFwiVGhlIFBERiB2aWV3ZXIgaGFzbid0IGZpbmlzaGVkIGluaXRpYWxpemluZy4gUGxlYXNlIGNhbGwgZmluZCgpIGxhdGVyLlwiKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgaGlnaGxpZ2h0QWxsQ2hlY2tib3ggPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZmluZEhpZ2hsaWdodEFsbCcpIGFzIEhUTUxJbnB1dEVsZW1lbnQ7XG4gICAgICBpZiAoaGlnaGxpZ2h0QWxsQ2hlY2tib3gpIHtcbiAgICAgICAgaGlnaGxpZ2h0QWxsQ2hlY2tib3guY2hlY2tlZCA9IG9wdGlvbnMuaGlnaGxpZ2h0QWxsID8/IGZhbHNlO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBtYXRjaENhc2VDaGVja2JveCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmaW5kTWF0Y2hDYXNlJykgYXMgSFRNTElucHV0RWxlbWVudDtcbiAgICAgIGlmIChtYXRjaENhc2VDaGVja2JveCkge1xuICAgICAgICBtYXRjaENhc2VDaGVja2JveC5jaGVja2VkID0gb3B0aW9ucy5tYXRjaENhc2UgPz8gZmFsc2U7XG4gICAgICB9XG4gICAgICBjb25zdCBlbnRpcmVXb3JkQ2hlY2tib3ggPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZmluZEVudGlyZVdvcmQnKSBhcyBIVE1MSW5wdXRFbGVtZW50O1xuICAgICAgaWYgKGVudGlyZVdvcmRDaGVja2JveCkge1xuICAgICAgICBlbnRpcmVXb3JkQ2hlY2tib3guY2hlY2tlZCA9IG9wdGlvbnMud2hvbGVXb3JkcyA/PyBmYWxzZTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IG1hdGNoRGlhY3JpdGljc0NoZWNrYm94ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ZpbmRNYXRjaERpYWNyaXRpY3MnKSBhcyBIVE1MSW5wdXRFbGVtZW50O1xuICAgICAgaWYgKG1hdGNoRGlhY3JpdGljc0NoZWNrYm94KSB7XG4gICAgICAgIG1hdGNoRGlhY3JpdGljc0NoZWNrYm94LmNoZWNrZWQgPSBvcHRpb25zLm1hdGNoRGlhY3JpdGljcyA/PyBmYWxzZTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IGlucHV0RmllbGQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZmluZElucHV0JykgYXMgSFRNTElucHV0RWxlbWVudDtcbiAgICAgIGlmIChpbnB1dEZpZWxkKSB7XG4gICAgICAgIGlucHV0RmllbGQudmFsdWUgPSB0ZXh0O1xuICAgICAgICAvLyB0b2RvIGRpcnR5IGhhY2shXG4gICAgICAgIGlucHV0RmllbGQuY2xhc3NMaXN0LnJlbW92ZSgnaGlkZGVuJyk7XG4gICAgICAgIC8vIGVuZCBvZiB0aGUgZGlydHkgaGFja1xuICAgICAgICBpbnB1dEZpZWxkLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KCdpbnB1dCcpKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6cXVvdGVtYXJrXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCJVbmV4cGVjdGVkIGVycm9yOiB0aGUgaW5wdXQgZmllbGQgdXNlZCB0byBzZWFyY2ggaXNuJ3QgcGFydCBvZiB0aGUgRE9NLlwiKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBmaW5kTmV4dCgpOiBib29sZWFuIHtcbiAgICBpZiAoIXRoaXMubmd4RXh0ZW5kZWRQZGZWaWV3ZXJJbml0aWFsaXplZCkge1xuICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOnF1b3RlbWFya1xuICAgICAgY29uc29sZS5lcnJvcihcIlRoZSBQREYgdmlld2VyIGhhc24ndCBmaW5pc2hlZCBpbml0aWFsaXppbmcuIFBsZWFzZSBjYWxsIGZpbmROZXh0KCkgbGF0ZXIuXCIpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBidXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZmluZE5leHQnKTtcbiAgICAgIGlmIChidXR0b24pIHtcbiAgICAgICAgYnV0dG9uLmNsaWNrKCk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBmaW5kUHJldmlvdXMoKTogYm9vbGVhbiB7XG4gICAgaWYgKCF0aGlzLm5neEV4dGVuZGVkUGRmVmlld2VySW5pdGlhbGl6ZWQpIHtcbiAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpxdW90ZW1hcmtcbiAgICAgIGNvbnNvbGUuZXJyb3IoXCJUaGUgUERGIHZpZXdlciBoYXNuJ3QgZmluaXNoZWQgaW5pdGlhbGl6aW5nLiBQbGVhc2UgY2FsbCBmaW5kUHJldmlvdXMoKSBsYXRlci5cIik7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmaW5kUHJldmlvdXMnKTtcbiAgICAgIGlmIChidXR0b24pIHtcbiAgICAgICAgYnV0dG9uLmNsaWNrKCk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBwcmludChwcmludFJhbmdlPzogUERGUHJpbnRSYW5nZSkge1xuICAgIGNvbnN0IFBERlZpZXdlckFwcGxpY2F0aW9uOiBJUERGVmlld2VyQXBwbGljYXRpb24gPSAod2luZG93IGFzIGFueSkuUERGVmlld2VyQXBwbGljYXRpb247XG4gICAgY29uc3QgYWxyZWFkeVRoZXJlID0gISF3aW5kb3dbJ2lzSW5QREZQcmludFJhbmdlJ10gJiYgIXByaW50UmFuZ2U7XG4gICAgaWYgKCFhbHJlYWR5VGhlcmUpIHtcbiAgICAgIGlmICghcHJpbnRSYW5nZSkge1xuICAgICAgICBwcmludFJhbmdlID0ge30gYXMgUERGUHJpbnRSYW5nZTtcbiAgICAgIH1cbiAgICAgIHRoaXMuc2V0UHJpbnRSYW5nZShwcmludFJhbmdlKTtcbiAgICB9XG4gICAgKHdpbmRvdyBhcyBhbnkpLnByaW50UERGKCk7XG4gICAgaWYgKCFhbHJlYWR5VGhlcmUpIHtcbiAgICAgIFBERlZpZXdlckFwcGxpY2F0aW9uLmV2ZW50QnVzLm9uKCdhZnRlcnByaW50JywgKCkgPT4ge1xuICAgICAgICB0aGlzLnJlbW92ZVByaW50UmFuZ2UoKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyByZW1vdmVQcmludFJhbmdlKCkge1xuICAgIHdpbmRvd1snaXNJblBERlByaW50UmFuZ2UnXSA9IHVuZGVmaW5lZDtcbiAgICB3aW5kb3dbJ2ZpbHRlcmVkUGFnZUNvdW50J10gPSB1bmRlZmluZWQ7XG4gIH1cblxuICBwdWJsaWMgc2V0UHJpbnRSYW5nZShwcmludFJhbmdlOiBQREZQcmludFJhbmdlKSB7XG4gICAgY29uc3QgUERGVmlld2VyQXBwbGljYXRpb246IElQREZWaWV3ZXJBcHBsaWNhdGlvbiA9ICh3aW5kb3cgYXMgYW55KS5QREZWaWV3ZXJBcHBsaWNhdGlvbjtcbiAgICB3aW5kb3dbJ2lzSW5QREZQcmludFJhbmdlJ10gPSAocGFnZTogbnVtYmVyKSA9PiB0aGlzLmlzSW5QREZQcmludFJhbmdlKHBhZ2UsIHByaW50UmFuZ2UpO1xuICAgIHdpbmRvd1snZmlsdGVyZWRQYWdlQ291bnQnXSA9IHRoaXMuZmlsdGVyZWRQYWdlQ291bnQoUERGVmlld2VyQXBwbGljYXRpb24ucGFnZXNDb3VudCwgcHJpbnRSYW5nZSk7XG4gIH1cblxuICBwdWJsaWMgZmlsdGVyZWRQYWdlQ291bnQocGFnZUNvdW50OiBudW1iZXIsIHJhbmdlOiBQREZQcmludFJhbmdlKTogbnVtYmVyIHtcbiAgICBsZXQgcmVzdWx0ID0gMDtcbiAgICBmb3IgKGxldCBwYWdlID0gMTsgcGFnZSA8PSBwYWdlQ291bnQ7IHBhZ2UrKykge1xuICAgICAgaWYgKHRoaXMuaXNJblBERlByaW50UmFuZ2UocGFnZSwgcmFuZ2UpKSB7XG4gICAgICAgIHJlc3VsdCsrO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgcHVibGljIGlzSW5QREZQcmludFJhbmdlKHBhZ2VJbmRleDogbnVtYmVyLCBwcmludFJhbmdlOiBQREZQcmludFJhbmdlKSB7XG4gICAgY29uc3QgcGFnZSA9IHBhZ2VJbmRleCArIDE7XG4gICAgaWYgKHByaW50UmFuZ2UuZnJvbSkge1xuICAgICAgaWYgKHBhZ2UgPCBwcmludFJhbmdlLmZyb20pIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAocHJpbnRSYW5nZS50bykge1xuICAgICAgaWYgKHBhZ2UgPiBwcmludFJhbmdlLnRvKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHByaW50UmFuZ2UuZXhjbHVkZWQpIHtcbiAgICAgIGlmIChwcmludFJhbmdlLmV4Y2x1ZGVkLnNvbWUoKHApID0+IHAgPT09IHBhZ2UpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHByaW50UmFuZ2UuaW5jbHVkZWQpIHtcbiAgICAgIGlmICghcHJpbnRSYW5nZS5pbmNsdWRlZC5zb21lKChwKSA9PiBwID09PSBwYWdlKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgcHVibGljIGFzeW5jIGdldFBhZ2VBc0xpbmVzKHBhZ2VOdW1iZXI6IG51bWJlcik6IFByb21pc2U8QXJyYXk8TGluZT4+IHtcbiAgICBjb25zdCBQREZWaWV3ZXJBcHBsaWNhdGlvbjogSVBERlZpZXdlckFwcGxpY2F0aW9uID0gKHdpbmRvdyBhcyBhbnkpLlBERlZpZXdlckFwcGxpY2F0aW9uO1xuICAgIGNvbnN0IHBkZkRvY3VtZW50ID0gUERGVmlld2VyQXBwbGljYXRpb24ucGRmRG9jdW1lbnQ7XG5cbiAgICBjb25zdCBwYWdlID0gYXdhaXQgcGRmRG9jdW1lbnQuZ2V0UGFnZShwYWdlTnVtYmVyKTtcbiAgICBjb25zdCB0ZXh0U25pcHBldHMgPSAoYXdhaXQgcGFnZS5nZXRUZXh0Q29udGVudCgpKS5pdGVtcyAvL1xuICAgICAgLmZpbHRlcigoaW5mbykgPT4gIWluZm9bJ3R5cGUnXSk7IC8vIGlnbm9yZSB0aGUgVGV4dE1hcmtlZENvbnRlbnQgaXRlbXNcblxuICAgIGNvbnN0IHNuaXBwZXRzID0gdGV4dFNuaXBwZXRzIGFzIEFycmF5PFRleHRJdGVtPjtcblxuICAgIGxldCBtaW5YID0gTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVI7XG4gICAgbGV0IG1pblkgPSBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUjtcbiAgICBsZXQgbWF4WCA9IE51bWJlci5NSU5fU0FGRV9JTlRFR0VSO1xuICAgIGxldCBtYXhZID0gTnVtYmVyLk1JTl9TQUZFX0lOVEVHRVI7XG4gICAgbGV0IGNvdW50TFRSID0gMDtcbiAgICBsZXQgY291bnRSVEwgPSAwO1xuICAgIGxldCB0ZXh0ID0gJyc7XG4gICAgbGV0IGxpbmVzID0gbmV3IEFycmF5PExpbmU+KCk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzbmlwcGV0cy5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgY3VycmVudFNuaXBwZXQgPSBzbmlwcGV0c1tpXTtcbiAgICAgIGlmICghY3VycmVudFNuaXBwZXQuaGFzRU9MKSB7XG4gICAgICAgIGNvbnN0IHggPSBjdXJyZW50U25pcHBldC50cmFuc2Zvcm1bNF07XG4gICAgICAgIGNvbnN0IHkgPSAtY3VycmVudFNuaXBwZXQudHJhbnNmb3JtWzVdO1xuICAgICAgICBjb25zdCB3aWR0aCA9IGN1cnJlbnRTbmlwcGV0LndpZHRoO1xuICAgICAgICBjb25zdCBoZWlnaHQgPSBjdXJyZW50U25pcHBldC5oZWlnaHQ7XG4gICAgICAgIG1pblggPSBNYXRoLm1pbihtaW5YLCB4KTtcbiAgICAgICAgbWluWSA9IE1hdGgubWluKG1pblksIHkpO1xuICAgICAgICBtYXhYID0gTWF0aC5tYXgobWF4WCwgeCArIHdpZHRoKTtcbiAgICAgICAgbWF4WSA9IE1hdGgubWF4KG1heFksIHkgKyBoZWlnaHQpO1xuICAgICAgICB0ZXh0ICs9IGN1cnJlbnRTbmlwcGV0LnN0cjtcbiAgICAgICAgaWYgKGN1cnJlbnRTbmlwcGV0LmRpciA9PT0gJ3J0bCcpIHtcbiAgICAgICAgICBjb3VudFJUTCsrO1xuICAgICAgICB9XG4gICAgICAgIGlmIChjdXJyZW50U25pcHBldC5kaXIgPT09ICdsdHInKSB7XG4gICAgICAgICAgY291bnRMVFIrKztcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBsZXQgYWRkSXQgPSBpID09PSBzbmlwcGV0cy5sZW5ndGggLSAxIHx8IGN1cnJlbnRTbmlwcGV0Lmhhc0VPTDtcbiAgICAgIGlmIChhZGRJdCkge1xuICAgICAgICBsZXQgZGlyZWN0aW9uOiBEaXJlY3Rpb25UeXBlID0gdW5kZWZpbmVkO1xuICAgICAgICBpZiAoY291bnRMVFIgPiAwICYmIGNvdW50UlRMID4gMCkge1xuICAgICAgICAgIGRpcmVjdGlvbiA9ICdib3RoJztcbiAgICAgICAgfSBlbHNlIGlmIChjb3VudExUUiA+IDApIHtcbiAgICAgICAgICBkaXJlY3Rpb24gPSAnbHRyJztcbiAgICAgICAgfSBlbHNlIGlmIChjb3VudFJUTCA+IDApIHtcbiAgICAgICAgICBkaXJlY3Rpb24gPSAncnRsJztcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBsaW5lID0ge1xuICAgICAgICAgIGRpcmVjdGlvbixcbiAgICAgICAgICB4OiBtaW5YLFxuICAgICAgICAgIHk6IG1pblksXG4gICAgICAgICAgd2lkdGg6IG1heFggLSBtaW5YLFxuICAgICAgICAgIGhlaWdodDogbWF4WSAtIG1pblksXG4gICAgICAgICAgdGV4dDogdGV4dC50cmltKCksXG4gICAgICAgIH0gYXMgTGluZTtcbiAgICAgICAgbGluZXMucHVzaChsaW5lKTtcbiAgICAgICAgbWluWCA9IE51bWJlci5NQVhfU0FGRV9JTlRFR0VSO1xuICAgICAgICBtaW5ZID0gTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVI7XG4gICAgICAgIG1heFggPSBOdW1iZXIuTUlOX1NBRkVfSU5URUdFUjtcbiAgICAgICAgbWF4WSA9IE51bWJlci5NSU5fU0FGRV9JTlRFR0VSO1xuICAgICAgICBjb3VudExUUiA9IDA7XG4gICAgICAgIGNvdW50UlRMID0gMDtcbiAgICAgICAgdGV4dCA9ICcnO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbGluZXM7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgZ2V0UGFnZUFzVGV4dChwYWdlTnVtYmVyOiBudW1iZXIpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgIGNvbnN0IFBERlZpZXdlckFwcGxpY2F0aW9uOiBJUERGVmlld2VyQXBwbGljYXRpb24gPSAod2luZG93IGFzIGFueSkuUERGVmlld2VyQXBwbGljYXRpb247XG4gICAgY29uc3QgcGRmRG9jdW1lbnQgPSBQREZWaWV3ZXJBcHBsaWNhdGlvbi5wZGZEb2N1bWVudDtcblxuICAgIGNvbnN0IHBhZ2UgPSBhd2FpdCBwZGZEb2N1bWVudC5nZXRQYWdlKHBhZ2VOdW1iZXIpO1xuICAgIGNvbnN0IHRleHRTbmlwcGV0cyA9IChhd2FpdCBwYWdlLmdldFRleHRDb250ZW50KCkpLml0ZW1zO1xuICAgIHJldHVybiB0aGlzLmNvbnZlcnRUZXh0SW5mb1RvVGV4dCh0ZXh0U25pcHBldHMpO1xuICB9XG5cbiAgcHJpdmF0ZSBjb252ZXJ0VGV4dEluZm9Ub1RleHQodGV4dEluZm9JdGVtczogQXJyYXk8VGV4dEl0ZW0gfCBUZXh0TWFya2VkQ29udGVudD4pOiBzdHJpbmcge1xuICAgIGlmICghdGV4dEluZm9JdGVtcykge1xuICAgICAgcmV0dXJuICcnO1xuICAgIH1cbiAgICByZXR1cm4gdGV4dEluZm9JdGVtc1xuICAgICAgLmZpbHRlcigoaW5mbykgPT4gIWluZm9bJ3R5cGUnXSlcbiAgICAgIC5tYXAoKGluZm86IFRleHRJdGVtKSA9PiAoaW5mby5oYXNFT0wgPyBpbmZvLnN0ciArICdcXG4nIDogaW5mby5zdHIpKVxuICAgICAgLmpvaW4oJycpO1xuICB9XG5cbiAgcHVibGljIGdldFBhZ2VBc0ltYWdlKHBhZ2VOdW1iZXI6IG51bWJlciwgc2NhbGU6IFBERkV4cG9ydFNjYWxlRmFjdG9yLCBiYWNrZ3JvdW5kPzogc3RyaW5nLCBiYWNrZ3JvdW5kQ29sb3JUb1JlcGxhY2U6IHN0cmluZyA9ICcjRkZGRkZGJyk6IFByb21pc2U8YW55PiB7XG4gICAgY29uc3QgUERGVmlld2VyQXBwbGljYXRpb246IElQREZWaWV3ZXJBcHBsaWNhdGlvbiA9ICh3aW5kb3cgYXMgYW55KS5QREZWaWV3ZXJBcHBsaWNhdGlvbjtcbiAgICBjb25zdCBwZGZEb2N1bWVudCA9IFBERlZpZXdlckFwcGxpY2F0aW9uLnBkZkRvY3VtZW50O1xuICAgIGNvbnN0IHBhZ2VQcm9taXNlOiBQcm9taXNlPGFueT4gPSBwZGZEb2N1bWVudC5nZXRQYWdlKHBhZ2VOdW1iZXIpO1xuICAgIGNvbnN0IGltYWdlUHJvbWlzZSA9IChwZGZQYWdlKSA9PiBQcm9taXNlLnJlc29sdmUodGhpcy5kcmF3KHBkZlBhZ2UsIHNjYWxlLCBiYWNrZ3JvdW5kLCBiYWNrZ3JvdW5kQ29sb3JUb1JlcGxhY2UpKTtcblxuICAgIHJldHVybiBwYWdlUHJvbWlzZS50aGVuKGltYWdlUHJvbWlzZSk7XG4gIH1cblxuICBwcml2YXRlIGRyYXcocGRmUGFnZTogYW55LCBzY2FsZTogUERGRXhwb3J0U2NhbGVGYWN0b3IsIGJhY2tncm91bmQ/OiBzdHJpbmcsIGJhY2tncm91bmRDb2xvclRvUmVwbGFjZTogc3RyaW5nID0gJyNGRkZGRkYnKTogUHJvbWlzZTxIVE1MQ2FudmFzRWxlbWVudD4ge1xuICAgIGxldCB6b29tRmFjdG9yID0gMTtcbiAgICBpZiAoc2NhbGUuc2NhbGUpIHtcbiAgICAgIHpvb21GYWN0b3IgPSBzY2FsZS5zY2FsZTtcbiAgICB9IGVsc2UgaWYgKHNjYWxlLndpZHRoKSB7XG4gICAgICB6b29tRmFjdG9yID0gc2NhbGUud2lkdGggLyBwZGZQYWdlLmdldFZpZXdwb3J0KHsgc2NhbGU6IDEgfSkud2lkdGg7XG4gICAgfSBlbHNlIGlmIChzY2FsZS5oZWlnaHQpIHtcbiAgICAgIHpvb21GYWN0b3IgPSBzY2FsZS5oZWlnaHQgLyBwZGZQYWdlLmdldFZpZXdwb3J0KHsgc2NhbGU6IDEgfSkuaGVpZ2h0O1xuICAgIH1cbiAgICBjb25zdCB2aWV3cG9ydCA9IHBkZlBhZ2UuZ2V0Vmlld3BvcnQoe1xuICAgICAgc2NhbGU6IHpvb21GYWN0b3IsXG4gICAgfSk7XG4gICAgY29uc3QgeyBjdHgsIGNhbnZhcyB9ID0gdGhpcy5nZXRQYWdlRHJhd0NvbnRleHQodmlld3BvcnQud2lkdGgsIHZpZXdwb3J0LmhlaWdodCk7XG4gICAgY29uc3QgZHJhd1ZpZXdwb3J0ID0gdmlld3BvcnQuY2xvbmUoKTtcblxuICAgIGNvbnN0IHJlbmRlckNvbnRleHQgPSB7XG4gICAgICBjYW52YXNDb250ZXh0OiBjdHgsXG4gICAgICB2aWV3cG9ydDogZHJhd1ZpZXdwb3J0LFxuICAgICAgYmFja2dyb3VuZCxcbiAgICAgIGJhY2tncm91bmRDb2xvclRvUmVwbGFjZSxcbiAgICB9O1xuICAgIGNvbnN0IHJlbmRlclRhc2sgPSBwZGZQYWdlLnJlbmRlcihyZW5kZXJDb250ZXh0KTtcblxuICAgIGNvbnN0IGRhdGFVcmxQcm9taXNlID0gKCkgPT4gUHJvbWlzZS5yZXNvbHZlKGNhbnZhcy50b0RhdGFVUkwoKSk7XG5cbiAgICByZXR1cm4gcmVuZGVyVGFzay5wcm9taXNlLnRoZW4oZGF0YVVybFByb21pc2UpO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRQYWdlRHJhd0NvbnRleHQod2lkdGg6IG51bWJlciwgaGVpZ2h0OiBudW1iZXIpOiBEcmF3Q29udGV4dCB7XG4gICAgY29uc3QgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG4gICAgY29uc3QgY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJywgeyBhbHBoYTogdHJ1ZSB9KTtcbiAgICBpZiAoIWN0eCkge1xuICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOiBxdW90ZW1hcmtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkNvdWxkbid0IGNyZWF0ZSB0aGUgMmQgY29udGV4dFwiKTtcbiAgICB9XG5cbiAgICBjYW52YXMud2lkdGggPSB3aWR0aDtcbiAgICBjYW52YXMuaGVpZ2h0ID0gaGVpZ2h0O1xuICAgIGNhbnZhcy5zdHlsZS53aWR0aCA9IGAke3dpZHRofXB4YDtcbiAgICBjYW52YXMuc3R5bGUuaGVpZ2h0ID0gYCR7aGVpZ2h0fXB4YDtcblxuICAgIHJldHVybiB7IGN0eCwgY2FudmFzIH07XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgZ2V0Q3VycmVudERvY3VtZW50QXNCbG9iKCk6IFByb21pc2U8QmxvYj4ge1xuICAgIGNvbnN0IFBERlZpZXdlckFwcGxpY2F0aW9uOiBJUERGVmlld2VyQXBwbGljYXRpb24gPSAod2luZG93IGFzIGFueSkuUERGVmlld2VyQXBwbGljYXRpb247XG4gICAgcmV0dXJuIGF3YWl0IFBERlZpZXdlckFwcGxpY2F0aW9uLmV4cG9ydCgpO1xuICB9XG5cbiAgcHVibGljIGFzeW5jIGdldEZvcm1EYXRhKGN1cnJlbnRGb3JtVmFsdWVzID0gdHJ1ZSk6IFByb21pc2U8QXJyYXk8T2JqZWN0Pj4ge1xuICAgIGNvbnN0IFBERlZpZXdlckFwcGxpY2F0aW9uOiBJUERGVmlld2VyQXBwbGljYXRpb24gPSAod2luZG93IGFzIGFueSkuUERGVmlld2VyQXBwbGljYXRpb247XG4gICAgY29uc3QgcGRmOiBQREZEb2N1bWVudFByb3h5IHwgdW5kZWZpbmVkID0gUERGVmlld2VyQXBwbGljYXRpb24ucGRmRG9jdW1lbnQ7XG4gICAgLy8gc2NyZWVuIERQSSAvIFBERiBEUElcbiAgICBjb25zdCBkcGlSYXRpbyA9IDk2IC8gNzI7XG4gICAgY29uc3QgcmVzdWx0OiBBcnJheTxPYmplY3Q+ID0gW107XG4gICAgZm9yIChsZXQgaSA9IDE7IGkgPD0gcGRmPy5udW1QYWdlczsgaSsrKSB7XG4gICAgICAvLyB0cmFjayB0aGUgY3VycmVudCBwYWdlXG4gICAgICBjb25zdCBjdXJyZW50UGFnZSAvKiA6IFBERlBhZ2VQcm94eSAqLyA9IGF3YWl0IHBkZi5nZXRQYWdlKGkpO1xuICAgICAgY29uc3QgYW5ub3RhdGlvbnMgPSBhd2FpdCBjdXJyZW50UGFnZS5nZXRBbm5vdGF0aW9ucygpO1xuXG4gICAgICBhbm5vdGF0aW9uc1xuICAgICAgICAuZmlsdGVyKChhKSA9PiBhLnN1YnR5cGUgPT09ICdXaWRnZXQnKSAvLyBnZXQgdGhlIGZvcm0gZmllbGQgYW5ub3RhdGlvbnMgb25seVxuICAgICAgICAubWFwKChhKSA9PiAoeyAuLi5hIH0pKSAvLyBvbmx5IGV4cG9zZSBjb3BpZXMgb2YgdGhlIGFubm90YXRpb25zIHRvIGF2b2lkIHNpZGUtZWZmZWN0c1xuICAgICAgICAuZm9yRWFjaCgoYSkgPT4ge1xuICAgICAgICAgIC8vIGdldCB0aGUgcmVjdGFuZ2xlIHRoYXQgcmVwcmVzZW50IHRoZSBzaW5nbGUgZmllbGRcbiAgICAgICAgICAvLyBhbmQgcmVzaXplIGl0IGFjY29yZGluZyB0byB0aGUgY3VycmVudCBEUElcbiAgICAgICAgICBjb25zdCBmaWVsZFJlY3Q6IEFycmF5PG51bWJlcj4gPSBjdXJyZW50UGFnZS5nZXRWaWV3cG9ydCh7IHNjYWxlOiBkcGlSYXRpbyB9KS5jb252ZXJ0VG9WaWV3cG9ydFJlY3RhbmdsZShhLnJlY3QpO1xuXG4gICAgICAgICAgLy8gYWRkIHRoZSBjb3JyZXNwb25kaW5nIGlucHV0XG4gICAgICAgICAgaWYgKGN1cnJlbnRGb3JtVmFsdWVzICYmIGEuZmllbGROYW1lKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICBpZiAoYS5leHBvcnRWYWx1ZSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRWYWx1ZTogYW55ID0gUERGVmlld2VyQXBwbGljYXRpb24ucGRmRG9jdW1lbnQuYW5ub3RhdGlvblN0b3JhZ2UuZ2V0VmFsdWUoYS5pZCwgYS5maWVsZE5hbWUgKyAnLycgKyBhLmV4cG9ydFZhbHVlLCAnJyk7XG4gICAgICAgICAgICAgICAgYS52YWx1ZSA9IGN1cnJlbnRWYWx1ZT8udmFsdWU7XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoYS5yYWRpb0J1dHRvbikge1xuICAgICAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRWYWx1ZTogYW55ID0gUERGVmlld2VyQXBwbGljYXRpb24ucGRmRG9jdW1lbnQuYW5ub3RhdGlvblN0b3JhZ2UuZ2V0VmFsdWUoYS5pZCwgYS5maWVsZE5hbWUgKyAnLycgKyBhLmZpZWxkVmFsdWUsICcnKTtcbiAgICAgICAgICAgICAgICBhLnZhbHVlID0gY3VycmVudFZhbHVlPy52YWx1ZTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zdCBjdXJyZW50VmFsdWU6IGFueSA9IFBERlZpZXdlckFwcGxpY2F0aW9uLnBkZkRvY3VtZW50LmFubm90YXRpb25TdG9yYWdlLmdldFZhbHVlKGEuaWQsIGEuZmllbGROYW1lLCAnJyk7XG4gICAgICAgICAgICAgICAgYS52YWx1ZSA9IGN1cnJlbnRWYWx1ZT8udmFsdWU7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gY2F0Y2ggKGV4Y2VwdGlvbikge1xuICAgICAgICAgICAgICAvLyBqdXN0IGlnbm9yZSBpdFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICByZXN1bHQucHVzaCh7IGZpZWxkQW5ub3RhdGlvbjogYSwgZmllbGRSZWN0LCBwYWdlTnVtYmVyOiBpIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGEgcGFnZSB0byB0aGUgcmVuZGVyaW5nIHF1ZXVlXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBwYWdlSW5kZXggSW5kZXggb2YgdGhlIHBhZ2UgdG8gcmVuZGVyXG4gICAqIEByZXR1cm5zIHtib29sZWFufSBmYWxzZSwgaWYgdGhlIHBhZ2UgaGFzIGFscmVhZHkgYmVlbiByZW5kZXJlZFxuICAgKiBvciBpZiBpdCdzIG91dCBvZiByYW5nZVxuICAgKi9cbiAgcHVibGljIGFkZFBhZ2VUb1JlbmRlclF1ZXVlKHBhZ2VJbmRleDogbnVtYmVyKTogYm9vbGVhbiB7XG4gICAgY29uc3QgUERGVmlld2VyQXBwbGljYXRpb246IElQREZWaWV3ZXJBcHBsaWNhdGlvbiA9ICh3aW5kb3cgYXMgYW55KS5QREZWaWV3ZXJBcHBsaWNhdGlvbjtcbiAgICByZXR1cm4gUERGVmlld2VyQXBwbGljYXRpb24ucGRmVmlld2VyLmFkZFBhZ2VUb1JlbmRlclF1ZXVlKHBhZ2VJbmRleCk7XG4gIH1cblxuICBwdWJsaWMgaXNSZW5kZXJRdWV1ZUVtcHR5KCk6IGJvb2xlYW4ge1xuICAgIGNvbnN0IHNjcm9sbGVkRG93biA9IHRydWU7XG4gICAgY29uc3QgcmVuZGVyRXh0cmEgPSBmYWxzZTtcbiAgICBjb25zdCBQREZWaWV3ZXJBcHBsaWNhdGlvbjogSVBERlZpZXdlckFwcGxpY2F0aW9uID0gKHdpbmRvdyBhcyBhbnkpLlBERlZpZXdlckFwcGxpY2F0aW9uO1xuICAgIGNvbnN0IG5leHRQYWdlID0gUERGVmlld2VyQXBwbGljYXRpb24ucGRmVmlld2VyLnJlbmRlcmluZ1F1ZXVlLmdldEhpZ2hlc3RQcmlvcml0eShcbiAgICAgIFBERlZpZXdlckFwcGxpY2F0aW9uLnBkZlZpZXdlci5fZ2V0VmlzaWJsZVBhZ2VzKCksXG4gICAgICBQREZWaWV3ZXJBcHBsaWNhdGlvbi5wZGZWaWV3ZXIuX3BhZ2VzLFxuICAgICAgc2Nyb2xsZWREb3duLFxuICAgICAgcmVuZGVyRXh0cmFcbiAgICApO1xuICAgIHJldHVybiAhbmV4dFBhZ2U7XG4gIH1cblxuICBwdWJsaWMgaGFzUGFnZUJlZW5SZW5kZXJlZChwYWdlSW5kZXg6IG51bWJlcik6IGJvb2xlYW4ge1xuICAgIGNvbnN0IFBERlZpZXdlckFwcGxpY2F0aW9uOiBJUERGVmlld2VyQXBwbGljYXRpb24gPSAod2luZG93IGFzIGFueSkuUERGVmlld2VyQXBwbGljYXRpb247XG4gICAgY29uc3QgcGFnZXMgPSBQREZWaWV3ZXJBcHBsaWNhdGlvbi5wZGZWaWV3ZXIuX3BhZ2VzO1xuICAgIGlmIChwYWdlcy5sZW5ndGggPiBwYWdlSW5kZXggJiYgcGFnZUluZGV4ID49IDApIHtcbiAgICAgIGNvbnN0IHBhZ2VWaWV3ID0gcGFnZXNbcGFnZUluZGV4XTtcbiAgICAgIGNvbnN0IGlzTG9hZGluZyA9IHBhZ2VWaWV3LnJlbmRlcmluZ1N0YXRlID09PSAzO1xuICAgICAgcmV0dXJuICFpc0xvYWRpbmc7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHB1YmxpYyBjdXJyZW50bHlSZW5kZXJlZFBhZ2VzKCk6IEFycmF5PG51bWJlcj4ge1xuICAgIGNvbnN0IFBERlZpZXdlckFwcGxpY2F0aW9uOiBJUERGVmlld2VyQXBwbGljYXRpb24gPSAod2luZG93IGFzIGFueSkuUERGVmlld2VyQXBwbGljYXRpb247XG4gICAgY29uc3QgcGFnZXMgPSBQREZWaWV3ZXJBcHBsaWNhdGlvbi5wZGZWaWV3ZXIuX3BhZ2VzO1xuICAgIHJldHVybiBwYWdlcy5maWx0ZXIoKHBhZ2UpID0+IHBhZ2UucmVuZGVyaW5nU3RhdGUgPT09IDMpLm1hcCgocGFnZSkgPT4gcGFnZS5pZCk7XG4gIH1cblxuICBwdWJsaWMgbnVtYmVyT2ZQYWdlcygpOiBudW1iZXIge1xuICAgIGNvbnN0IFBERlZpZXdlckFwcGxpY2F0aW9uOiBJUERGVmlld2VyQXBwbGljYXRpb24gPSAod2luZG93IGFzIGFueSkuUERGVmlld2VyQXBwbGljYXRpb247XG4gICAgY29uc3QgcGFnZXMgPSBQREZWaWV3ZXJBcHBsaWNhdGlvbi5wZGZWaWV3ZXIuX3BhZ2VzO1xuICAgIHJldHVybiBwYWdlcy5sZW5ndGg7XG4gIH1cblxuICBwdWJsaWMgZ2V0Q3VycmVudGx5VmlzaWJsZVBhZ2VOdW1iZXJzKCk6IEFycmF5PG51bWJlcj4ge1xuICAgIGNvbnN0IGFwcCA9ICh3aW5kb3cgYXMgYW55KS5QREZWaWV3ZXJBcHBsaWNhdGlvbiBhcyBJUERGVmlld2VyQXBwbGljYXRpb247XG4gICAgY29uc3QgcGFnZXMgPSAoYXBwLnBkZlZpZXdlci5fZ2V0VmlzaWJsZVBhZ2VzKCkgYXMgYW55KS52aWV3cyBhcyBBcnJheTxhbnk+O1xuICAgIHJldHVybiBwYWdlcz8ubWFwKChwYWdlKSA9PiBwYWdlLmlkKTtcbiAgfVxuXG4gIHB1YmxpYyByZWNhbGN1bGF0ZVNpemUoKTogdm9pZCB7XG4gICAgdGhpcy5yZWNhbGN1bGF0ZVNpemUkLm5leHQoKTtcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBsaXN0TGF5ZXJzKCk6IFByb21pc2U8QXJyYXk8UGRmTGF5ZXI+IHwgdW5kZWZpbmVkPiB7XG4gICAgY29uc3QgUERGVmlld2VyQXBwbGljYXRpb246IElQREZWaWV3ZXJBcHBsaWNhdGlvbiA9ICh3aW5kb3cgYXMgYW55KS5QREZWaWV3ZXJBcHBsaWNhdGlvbjtcblxuICAgIGNvbnN0IG9wdGlvbmFsQ29udGVudENvbmZpZyA9IGF3YWl0IFBERlZpZXdlckFwcGxpY2F0aW9uLnBkZlZpZXdlci5vcHRpb25hbENvbnRlbnRDb25maWdQcm9taXNlO1xuICAgIGlmIChvcHRpb25hbENvbnRlbnRDb25maWcpIHtcbiAgICAgIGNvbnN0IGxldmVsRGF0YSA9IG9wdGlvbmFsQ29udGVudENvbmZpZy5nZXRPcmRlcigpO1xuICAgICAgY29uc3QgbGF5ZXJJZHMgPSBsZXZlbERhdGEuZmlsdGVyKChncm91cElkKSA9PiB0eXBlb2YgZ3JvdXBJZCAhPT0gJ29iamVjdCcpO1xuICAgICAgcmV0dXJuIGxheWVySWRzLm1hcCgobGF5ZXJJZCkgPT4ge1xuICAgICAgICBjb25zdCBjb25maWcgPSBvcHRpb25hbENvbnRlbnRDb25maWcuZ2V0R3JvdXAobGF5ZXJJZCk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgbGF5ZXJJZDogbGF5ZXJJZCxcbiAgICAgICAgICBuYW1lOiBjb25maWcubmFtZSxcbiAgICAgICAgICB2aXNpYmxlOiBjb25maWcudmlzaWJsZSxcbiAgICAgICAgfSBhcyBQZGZMYXllcjtcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgcHVibGljIGFzeW5jIHRvZ2dsZUxheWVyKGxheWVySWQ6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IFBERlZpZXdlckFwcGxpY2F0aW9uOiBJUERGVmlld2VyQXBwbGljYXRpb24gPSAod2luZG93IGFzIGFueSkuUERGVmlld2VyQXBwbGljYXRpb247XG4gICAgY29uc3Qgb3B0aW9uYWxDb250ZW50Q29uZmlnID0gYXdhaXQgUERGVmlld2VyQXBwbGljYXRpb24ucGRmVmlld2VyLm9wdGlvbmFsQ29udGVudENvbmZpZ1Byb21pc2U7XG4gICAgaWYgKG9wdGlvbmFsQ29udGVudENvbmZpZykge1xuICAgICAgbGV0IGlzVmlzaWJsZSA9IG9wdGlvbmFsQ29udGVudENvbmZpZy5nZXRHcm91cChsYXllcklkKS52aXNpYmxlO1xuICAgICAgY29uc3QgY2hlY2tib3ggPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGBpbnB1dFtpZD0nJHtsYXllcklkfSddYCk7XG4gICAgICBpZiAoY2hlY2tib3gpIHtcbiAgICAgICAgaXNWaXNpYmxlID0gKGNoZWNrYm94IGFzIEhUTUxJbnB1dEVsZW1lbnQpLmNoZWNrZWQ7XG4gICAgICAgIChjaGVja2JveCBhcyBIVE1MSW5wdXRFbGVtZW50KS5jaGVja2VkID0gIWlzVmlzaWJsZTtcbiAgICAgIH1cbiAgICAgIG9wdGlvbmFsQ29udGVudENvbmZpZy5zZXRWaXNpYmlsaXR5KGxheWVySWQsICFpc1Zpc2libGUpO1xuICAgICAgUERGVmlld2VyQXBwbGljYXRpb24uZXZlbnRCdXMuZGlzcGF0Y2goJ29wdGlvbmFsY29udGVudGNvbmZpZycsIHtcbiAgICAgICAgc291cmNlOiB0aGlzLFxuICAgICAgICBwcm9taXNlOiBQcm9taXNlLnJlc29sdmUob3B0aW9uYWxDb250ZW50Q29uZmlnKSxcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBzY3JvbGxQYWdlSW50b1ZpZXcocGFnZU51bWJlcjogbnVtYmVyLCBwYWdlU3BvdD86IHsgdG9wPzogbnVtYmVyIHwgc3RyaW5nOyBsZWZ0PzogbnVtYmVyIHwgc3RyaW5nIH0pOiB2b2lkIHtcbiAgICBjb25zdCBQREZWaWV3ZXJBcHBsaWNhdGlvbjogSVBERlZpZXdlckFwcGxpY2F0aW9uID0gKHdpbmRvdyBhcyBhbnkpLlBERlZpZXdlckFwcGxpY2F0aW9uO1xuICAgIGNvbnN0IHZpZXdlciA9IFBERlZpZXdlckFwcGxpY2F0aW9uLnBkZlZpZXdlciBhcyBhbnk7XG4gICAgdmlld2VyLnNjcm9sbFBhZ2VQb3NJbnRvVmlldyhwYWdlTnVtYmVyLCBwYWdlU3BvdCk7XG4gIH1cblxuICBwdWJsaWMgZ2V0U2VyaWFsaXplZEFubm90YXRpb25zKCk6IEVkaXRvckFubm90YXRpb25bXSB8IG51bGwge1xuICAgIGNvbnN0IFBERlZpZXdlckFwcGxpY2F0aW9uOiBJUERGVmlld2VyQXBwbGljYXRpb24gPSAod2luZG93IGFzIGFueSkuUERGVmlld2VyQXBwbGljYXRpb247XG4gICAgcmV0dXJuIFBERlZpZXdlckFwcGxpY2F0aW9uLnBkZlZpZXdlci5nZXRTZXJpYWxpemVkQW5ub3RhdGlvbnMoKTtcbiAgfVxuXG4gIHB1YmxpYyBhZGRFZGl0b3JBbm5vdGF0aW9uKHNlcmlhbGl6ZWRBbm5vdGF0aW9uOiBzdHJpbmcgfCBFZGl0b3JBbm5vdGF0aW9uKTogdm9pZCB7XG4gICAgY29uc3QgUERGVmlld2VyQXBwbGljYXRpb246IElQREZWaWV3ZXJBcHBsaWNhdGlvbiA9ICh3aW5kb3cgYXMgYW55KS5QREZWaWV3ZXJBcHBsaWNhdGlvbjtcbiAgICBQREZWaWV3ZXJBcHBsaWNhdGlvbi5wZGZWaWV3ZXIuYWRkRWRpdG9yQW5ub3RhdGlvbihzZXJpYWxpemVkQW5ub3RhdGlvbik7XG4gIH1cblxuICBwdWJsaWMgcmVtb3ZlRWRpdG9yQW5ub3RhdGlvbnMoZmlsdGVyPzogKHNlcmlhbGl6ZWQ6IG9iamVjdCkgPT4gYm9vbGVhbik6IHZvaWQge1xuICAgIGNvbnN0IFBERlZpZXdlckFwcGxpY2F0aW9uOiBJUERGVmlld2VyQXBwbGljYXRpb24gPSAod2luZG93IGFzIGFueSkuUERGVmlld2VyQXBwbGljYXRpb247XG4gICAgUERGVmlld2VyQXBwbGljYXRpb24ucGRmVmlld2VyLnJlbW92ZUVkaXRvckFubm90YXRpb25zKGZpbHRlcik7XG4gIH1cbn1cbiJdfQ==