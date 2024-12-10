import { Component, forwardRef, Input, Output, EventEmitter, ContentChild, TemplateRef, ViewEncapsulation, HostListener, HostBinding, ViewChild, ChangeDetectionStrategy, Inject, ContentChildren, InjectionToken, Attribute } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { takeUntil, startWith, tap, debounceTime, map, filter } from 'rxjs/operators';
import { Subject, merge } from 'rxjs';
import { NgOptionTemplateDirective, NgLabelTemplateDirective, NgHeaderTemplateDirective, NgFooterTemplateDirective, NgOptgroupTemplateDirective, NgNotFoundTemplateDirective, NgTypeToSearchTemplateDirective, NgLoadingTextTemplateDirective, NgMultiLabelTemplateDirective, NgTagTemplateDirective, NgLoadingSpinnerTemplateDirective } from './ng-templates.directive';
import { isDefined, isFunction, isPromise, isObject } from './value-utils';
import { ItemsList } from './items-list';
import { KeyCode } from './ng-select.types';
import { newId } from './id';
import { NgDropdownPanelComponent } from './ng-dropdown-panel.component';
import { NgOptionComponent } from './ng-option.component';
import { NgDropdownPanelService } from './ng-dropdown-panel.service';
import * as i0 from "@angular/core";
import * as i1 from "./config.service";
import * as i2 from "./console.service";
import * as i3 from "@angular/common";
import * as i4 from "./ng-dropdown-panel.component";
import * as i5 from "./ng-templates.directive";
export const SELECTION_MODEL_FACTORY = new InjectionToken('ng-select-selection-model');
export class NgSelectComponent {
    get items() { return this._items; }
    ;
    set items(value) {
        if (value === null) {
            value = [];
        }
        this._itemsAreUsed = true;
        this._items = value;
    }
    ;
    get compareWith() { return this._compareWith; }
    set compareWith(fn) {
        if (fn !== undefined && fn !== null && !isFunction(fn)) {
            throw Error('`compareWith` must be a function.');
        }
        this._compareWith = fn;
    }
    get clearSearchOnAdd() {
        if (isDefined(this._clearSearchOnAdd)) {
            return this._clearSearchOnAdd;
        }
        else if (isDefined(this.config.clearSearchOnAdd)) {
            return this.config.clearSearchOnAdd;
        }
        return this.closeOnSelect;
    }
    ;
    set clearSearchOnAdd(value) {
        this._clearSearchOnAdd = value;
    }
    ;
    get deselectOnClick() {
        if (isDefined(this._deselectOnClick)) {
            return this._deselectOnClick;
        }
        else if (isDefined(this.config.deselectOnClick)) {
            return this.config.deselectOnClick;
        }
        return this.multiple;
    }
    ;
    set deselectOnClick(value) {
        this._deselectOnClick = value;
    }
    ;
    get disabled() { return this.readonly || this._disabled; }
    ;
    get filtered() { return (!!this.searchTerm && this.searchable || this._isComposing); }
    ;
    get single() { return !this.multiple; }
    ;
    get _editableSearchTerm() {
        return this.editableSearchTerm && !this.multiple;
    }
    constructor(classes, autoFocus, config, newSelectionModel, _elementRef, _cd, _console) {
        this.classes = classes;
        this.autoFocus = autoFocus;
        this.config = config;
        this._cd = _cd;
        this._console = _console;
        this.markFirst = true;
        this.dropdownPosition = 'auto';
        this.loading = false;
        this.closeOnSelect = true;
        this.hideSelected = false;
        this.selectOnTab = false;
        this.bufferAmount = 4;
        this.selectableGroup = false;
        this.selectableGroupAsModel = true;
        this.searchFn = null;
        this.trackByFn = null;
        this.clearOnBackspace = true;
        this.labelForId = null;
        this.inputAttrs = {};
        this.readonly = false;
        this.searchWhileComposing = true;
        this.minTermLength = 0;
        this.editableSearchTerm = false;
        this.keyDownFn = (_) => true;
        this.multiple = false;
        this.addTag = false;
        this.searchable = true;
        this.clearable = true;
        this.isOpen = false;
        // output events
        this.blurEvent = new EventEmitter();
        this.focusEvent = new EventEmitter();
        this.changeEvent = new EventEmitter();
        this.openEvent = new EventEmitter();
        this.closeEvent = new EventEmitter();
        this.searchEvent = new EventEmitter();
        this.clearEvent = new EventEmitter();
        this.addEvent = new EventEmitter();
        this.removeEvent = new EventEmitter();
        this.scroll = new EventEmitter();
        this.scrollToEnd = new EventEmitter();
        this.useDefaultClass = true;
        this.viewPortItems = [];
        this.searchTerm = null;
        this.dropdownId = newId();
        this.escapeHTML = true;
        this._items = [];
        this._defaultLabel = 'label';
        this._pressedKeys = [];
        this._isComposing = false;
        this._destroy$ = new Subject();
        this._keyPress$ = new Subject();
        this._onChange = (_) => { };
        this._onTouched = () => { };
        this.clearItem = (item) => {
            const option = this.selectedItems.find(x => x.value === item);
            this.unselect(option);
        };
        this.trackByOption = (_, item) => {
            if (this.trackByFn) {
                return this.trackByFn(item.value);
            }
            return item;
        };
        this._mergeGlobalConfig(config);
        this.itemsList = new ItemsList(this, newSelectionModel());
        this.element = _elementRef.nativeElement;
    }
    get selectedItems() {
        return this.itemsList.selectedItems;
    }
    get selectedValues() {
        return this.selectedItems.map(x => x.value);
    }
    get hasValue() {
        return this.selectedItems.length > 0;
    }
    get currentPanelPosition() {
        if (this.dropdownPanel) {
            return this.dropdownPanel.currentPosition;
        }
        return undefined;
    }
    ngOnInit() {
        this._handleKeyPresses();
        this._setInputAttributes();
    }
    ngOnChanges(changes) {
        if (changes.multiple) {
            this.itemsList.clearSelected();
        }
        if (changes.items) {
            this._setItems(changes.items.currentValue || []);
        }
        if (changes.isOpen) {
            this._manualOpen = isDefined(changes.isOpen.currentValue);
        }
    }
    ngAfterViewInit() {
        if (!this._itemsAreUsed) {
            this.escapeHTML = false;
            this._setItemsFromNgOptions();
        }
        if (isDefined(this.autoFocus)) {
            this.focus();
        }
    }
    ngOnDestroy() {
        this._destroy$.next();
        this._destroy$.complete();
    }
    handleKeyDown($event) {
        const keyCode = KeyCode[$event.which];
        if (keyCode) {
            if (this.keyDownFn($event) === false) {
                return;
            }
            this.handleKeyCode($event);
        }
        else if ($event.key && $event.key.length === 1) {
            this._keyPress$.next($event.key.toLocaleLowerCase());
        }
    }
    handleKeyCode($event) {
        const target = $event.target;
        if (this.clearButton && this.clearButton.nativeElement === target) {
            this.handleKeyCodeClear($event);
        }
        else {
            this.handleKeyCodeInput($event);
        }
    }
    handleKeyCodeInput($event) {
        switch ($event.which) {
            case KeyCode.ArrowDown:
                this._handleArrowDown($event);
                break;
            case KeyCode.ArrowUp:
                this._handleArrowUp($event);
                break;
            case KeyCode.Space:
                this._handleSpace($event);
                break;
            case KeyCode.Enter:
                this._handleEnter($event);
                break;
            case KeyCode.Tab:
                this._handleTab($event);
                break;
            case KeyCode.Esc:
                this.close();
                $event.preventDefault();
                break;
            case KeyCode.Backspace:
                this._handleBackspace();
                break;
        }
    }
    handleKeyCodeClear($event) {
        switch ($event.which) {
            case KeyCode.Enter:
                this.handleClearClick();
                $event.preventDefault();
                break;
        }
    }
    handleMousedown($event) {
        const target = $event.target;
        if (target.tagName !== 'INPUT') {
            $event.preventDefault();
        }
        if (target.classList.contains('ng-clear-wrapper')) {
            this.handleClearClick();
            return;
        }
        if (target.classList.contains('ng-arrow-wrapper')) {
            this.handleArrowClick();
            return;
        }
        if (target.classList.contains('ng-value-icon')) {
            return;
        }
        if (!this.focused) {
            this.focus();
        }
        if (this.searchable) {
            this.open();
        }
        else {
            this.toggle();
        }
    }
    handleArrowClick() {
        if (this.isOpen) {
            this.close();
        }
        else {
            this.open();
        }
    }
    handleClearClick() {
        if (this.hasValue) {
            this.itemsList.clearSelected(true);
            this._updateNgModel();
        }
        this._clearSearch();
        this.focus();
        this.clearEvent.emit();
        this._onSelectionChanged();
    }
    clearModel() {
        if (!this.clearable) {
            return;
        }
        this.itemsList.clearSelected();
        this._updateNgModel();
    }
    writeValue(value) {
        this.itemsList.clearSelected();
        this._handleWriteValue(value);
        this._cd.markForCheck();
    }
    registerOnChange(fn) {
        this._onChange = fn;
    }
    registerOnTouched(fn) {
        this._onTouched = fn;
    }
    setDisabledState(state) {
        this._disabled = state;
        this._cd.markForCheck();
    }
    toggle() {
        if (!this.isOpen) {
            this.open();
        }
        else {
            this.close();
        }
    }
    open() {
        if (this.disabled || this.isOpen || this._manualOpen) {
            return;
        }
        if (!this._isTypeahead && !this.addTag && this.itemsList.noItemsToSelect) {
            return;
        }
        this.isOpen = true;
        this.itemsList.markSelectedOrDefault(this.markFirst);
        this.openEvent.emit();
        if (!this.searchTerm) {
            this.focus();
        }
        this.detectChanges();
    }
    close() {
        if (!this.isOpen || this._manualOpen) {
            return;
        }
        this.isOpen = false;
        this._isComposing = false;
        if (!this._editableSearchTerm) {
            this._clearSearch();
        }
        else {
            this.itemsList.resetFilteredItems();
        }
        this.itemsList.unmarkItem();
        this._onTouched();
        this.closeEvent.emit();
        this._cd.markForCheck();
    }
    toggleItem(item) {
        if (!item || item.disabled || this.disabled) {
            return;
        }
        if (this.deselectOnClick && item.selected) {
            this.unselect(item);
        }
        else {
            this.select(item);
        }
        if (this._editableSearchTerm) {
            this._setSearchTermFromItems();
        }
        this._onSelectionChanged();
    }
    select(item) {
        if (!item.selected) {
            this.itemsList.select(item);
            if (this.clearSearchOnAdd && !this._editableSearchTerm) {
                this._clearSearch();
            }
            this._updateNgModel();
            if (this.multiple) {
                this.addEvent.emit(item.value);
            }
        }
        if (this.closeOnSelect || this.itemsList.noItemsToSelect) {
            this.close();
        }
    }
    focus() {
        this.searchInput.nativeElement.focus();
    }
    blur() {
        this.searchInput.nativeElement.blur();
    }
    unselect(item) {
        if (!item) {
            return;
        }
        this.itemsList.unselect(item);
        this.focus();
        this._updateNgModel();
        this.removeEvent.emit(item.value);
    }
    selectTag() {
        let tag;
        if (isFunction(this.addTag)) {
            tag = this.addTag(this.searchTerm);
        }
        else {
            tag = this._primitive ? this.searchTerm : { [this.bindLabel]: this.searchTerm };
        }
        const handleTag = (item) => this._isTypeahead || !this.isOpen ? this.itemsList.mapItem(item, null) : this.itemsList.addItem(item);
        if (isPromise(tag)) {
            tag.then(item => this.select(handleTag(item))).catch(() => { });
        }
        else if (tag) {
            this.select(handleTag(tag));
        }
    }
    showClear() {
        return this.clearable && (this.hasValue || this.searchTerm) && !this.disabled;
    }
    focusOnClear() {
        this.blur();
        if (this.clearButton) {
            this.clearButton.nativeElement.focus();
        }
    }
    get showAddTag() {
        if (!this._validTerm) {
            return false;
        }
        const term = this.searchTerm.toLowerCase().trim();
        return this.addTag &&
            (!this.itemsList.filteredItems.some(x => x.label.toLowerCase() === term) &&
                (!this.hideSelected && this.isOpen || !this.selectedItems.some(x => x.label.toLowerCase() === term))) &&
            !this.loading;
    }
    showNoItemsFound() {
        const empty = this.itemsList.filteredItems.length === 0;
        return ((empty && !this._isTypeahead && !this.loading) ||
            (empty && this._isTypeahead && this._validTerm && !this.loading)) &&
            !this.showAddTag;
    }
    showTypeToSearch() {
        const empty = this.itemsList.filteredItems.length === 0;
        return empty && this._isTypeahead && !this._validTerm && !this.loading;
    }
    onCompositionStart() {
        this._isComposing = true;
    }
    onCompositionEnd(term) {
        this._isComposing = false;
        if (this.searchWhileComposing) {
            return;
        }
        this.filter(term);
    }
    filter(term) {
        if (this._isComposing && !this.searchWhileComposing) {
            return;
        }
        this.searchTerm = term;
        if (this._isTypeahead && (this._validTerm || this.minTermLength === 0)) {
            this.typeahead.next(term);
        }
        if (!this._isTypeahead) {
            this.itemsList.filter(this.searchTerm);
            if (this.isOpen) {
                this.itemsList.markSelectedOrDefault(this.markFirst);
            }
        }
        this.searchEvent.emit({ term, items: this.itemsList.filteredItems.map(x => x.value) });
        this.open();
    }
    onInputFocus($event) {
        if (this.focused) {
            return;
        }
        if (this._editableSearchTerm) {
            this._setSearchTermFromItems();
        }
        this.element.classList.add('ng-select-focused');
        this.focusEvent.emit($event);
        this.focused = true;
    }
    onInputBlur($event) {
        this.element.classList.remove('ng-select-focused');
        this.blurEvent.emit($event);
        if (!this.isOpen && !this.disabled) {
            this._onTouched();
        }
        if (this._editableSearchTerm) {
            this._setSearchTermFromItems();
        }
        this.focused = false;
    }
    onItemHover(item) {
        if (item.disabled) {
            return;
        }
        this.itemsList.markItem(item);
    }
    detectChanges() {
        if (!this._cd.destroyed) {
            this._cd.detectChanges();
        }
    }
    _setSearchTermFromItems() {
        const selected = this.selectedItems && this.selectedItems[0];
        this.searchTerm = (selected && selected.label) || null;
    }
    _setItems(items) {
        const firstItem = items[0];
        this.bindLabel = this.bindLabel || this._defaultLabel;
        this._primitive = isDefined(firstItem) ? !isObject(firstItem) : this._primitive || this.bindLabel === this._defaultLabel;
        this.itemsList.setItems(items);
        if (items.length > 0 && this.hasValue) {
            this.itemsList.mapSelectedItems();
        }
        if (this.isOpen && isDefined(this.searchTerm) && !this._isTypeahead) {
            this.itemsList.filter(this.searchTerm);
        }
        if (this._isTypeahead || this.isOpen) {
            this.itemsList.markSelectedOrDefault(this.markFirst);
        }
    }
    _setItemsFromNgOptions() {
        const mapNgOptions = (options) => {
            this.items = options.map(option => ({
                $ngOptionValue: option.value,
                $ngOptionLabel: option.elementRef.nativeElement.innerHTML,
                disabled: option.disabled
            }));
            this.itemsList.setItems(this.items);
            if (this.hasValue) {
                this.itemsList.mapSelectedItems();
            }
            this.detectChanges();
        };
        const handleOptionChange = () => {
            const changedOrDestroyed = merge(this.ngOptions.changes, this._destroy$);
            merge(...this.ngOptions.map(option => option.stateChange$))
                .pipe(takeUntil(changedOrDestroyed))
                .subscribe(option => {
                const item = this.itemsList.findItem(option.value);
                item.disabled = option.disabled;
                item.label = option.label || item.label;
                this._cd.detectChanges();
            });
        };
        this.ngOptions.changes
            .pipe(startWith(this.ngOptions), takeUntil(this._destroy$))
            .subscribe(options => {
            this.bindLabel = this._defaultLabel;
            mapNgOptions(options);
            handleOptionChange();
        });
    }
    _isValidWriteValue(value) {
        if (!isDefined(value) || (this.multiple && value === '') || Array.isArray(value) && value.length === 0) {
            return false;
        }
        const validateBinding = (item) => {
            if (!isDefined(this.compareWith) && isObject(item) && this.bindValue) {
                this._console.warn(`Setting object(${JSON.stringify(item)}) as your model with bindValue is not allowed unless [compareWith] is used.`);
                return false;
            }
            return true;
        };
        if (this.multiple) {
            if (!Array.isArray(value)) {
                this._console.warn('Multiple select ngModel should be array.');
                return false;
            }
            return value.every(item => validateBinding(item));
        }
        else {
            return validateBinding(value);
        }
    }
    _handleWriteValue(ngModel) {
        if (!this._isValidWriteValue(ngModel)) {
            return;
        }
        const select = (val) => {
            let item = this.itemsList.findItem(val);
            if (item) {
                this.itemsList.select(item);
            }
            else {
                const isValObject = isObject(val);
                const isPrimitive = !isValObject && !this.bindValue;
                if ((isValObject || isPrimitive)) {
                    this.itemsList.select(this.itemsList.mapItem(val, null));
                }
                else if (this.bindValue) {
                    item = {
                        [this.bindLabel]: null,
                        [this.bindValue]: val
                    };
                    this.itemsList.select(this.itemsList.mapItem(item, null));
                }
            }
        };
        if (this.multiple) {
            ngModel.forEach(item => select(item));
        }
        else {
            select(ngModel);
        }
    }
    _handleKeyPresses() {
        if (this.searchable) {
            return;
        }
        this._keyPress$
            .pipe(takeUntil(this._destroy$), tap(letter => this._pressedKeys.push(letter)), debounceTime(200), filter(() => this._pressedKeys.length > 0), map(() => this._pressedKeys.join('')))
            .subscribe(term => {
            const item = this.itemsList.findByLabel(term);
            if (item) {
                if (this.isOpen) {
                    this.itemsList.markItem(item);
                    this._scrollToMarked();
                    this._cd.markForCheck();
                }
                else {
                    this.select(item);
                }
            }
            this._pressedKeys = [];
        });
    }
    _setInputAttributes() {
        const input = this.searchInput.nativeElement;
        const attributes = {
            type: 'text',
            autocorrect: 'off',
            autocapitalize: 'off',
            autocomplete: this.labelForId ? 'off' : this.dropdownId,
            ...this.inputAttrs
        };
        for (const key of Object.keys(attributes)) {
            input.setAttribute(key, attributes[key]);
        }
    }
    _updateNgModel() {
        const model = [];
        for (const item of this.selectedItems) {
            if (this.bindValue) {
                let value = null;
                if (item.children) {
                    const groupKey = this.groupValue ? this.bindValue : this.groupBy;
                    value = item.value[groupKey || this.groupBy];
                }
                else {
                    value = this.itemsList.resolveNested(item.value, this.bindValue);
                }
                model.push(value);
            }
            else {
                model.push(item.value);
            }
        }
        const selected = this.selectedItems.map(x => x.value);
        if (this.multiple) {
            this._onChange(model);
            this.changeEvent.emit(selected);
        }
        else {
            this._onChange(isDefined(model[0]) ? model[0] : null);
            this.changeEvent.emit(selected[0]);
        }
        this._cd.markForCheck();
    }
    _clearSearch() {
        if (!this.searchTerm) {
            return;
        }
        this._changeSearch(null);
        this.itemsList.resetFilteredItems();
    }
    _changeSearch(searchTerm) {
        this.searchTerm = searchTerm;
        if (this._isTypeahead) {
            this.typeahead.next(searchTerm);
        }
    }
    _scrollToMarked() {
        if (!this.isOpen || !this.dropdownPanel) {
            return;
        }
        this.dropdownPanel.scrollTo(this.itemsList.markedItem);
    }
    _scrollToTag() {
        if (!this.isOpen || !this.dropdownPanel) {
            return;
        }
        this.dropdownPanel.scrollToTag();
    }
    _onSelectionChanged() {
        if (this.isOpen && this.deselectOnClick && this.appendTo) {
            // Make sure items are rendered.
            this._cd.detectChanges();
            this.dropdownPanel.adjustPosition();
        }
    }
    _handleTab($event) {
        if (this.isOpen === false) {
            if (this.showClear()) {
                this.focusOnClear();
                $event.preventDefault();
            }
            else if (!this.addTag) {
                return;
            }
        }
        if (this.selectOnTab) {
            if (this.itemsList.markedItem) {
                this.toggleItem(this.itemsList.markedItem);
                $event.preventDefault();
            }
            else if (this.showAddTag) {
                this.selectTag();
                $event.preventDefault();
            }
            else {
                this.close();
            }
        }
        else {
            this.close();
        }
    }
    _handleEnter($event) {
        if (this.isOpen || this._manualOpen) {
            if (this.itemsList.markedItem) {
                this.toggleItem(this.itemsList.markedItem);
            }
            else if (this.showAddTag) {
                this.selectTag();
            }
        }
        else if (this.openOnEnter) {
            this.open();
        }
        else {
            return;
        }
        $event.preventDefault();
    }
    _handleSpace($event) {
        if (this.isOpen || this._manualOpen) {
            return;
        }
        this.open();
        $event.preventDefault();
    }
    _handleArrowDown($event) {
        if (this._nextItemIsTag(+1)) {
            this.itemsList.unmarkItem();
            this._scrollToTag();
        }
        else {
            this.itemsList.markNextItem();
            this._scrollToMarked();
        }
        this.open();
        $event.preventDefault();
    }
    _handleArrowUp($event) {
        if (!this.isOpen) {
            return;
        }
        if (this._nextItemIsTag(-1)) {
            this.itemsList.unmarkItem();
            this._scrollToTag();
        }
        else {
            this.itemsList.markPreviousItem();
            this._scrollToMarked();
        }
        $event.preventDefault();
    }
    _nextItemIsTag(nextStep) {
        const nextIndex = this.itemsList.markedIndex + nextStep;
        return this.addTag && this.searchTerm
            && this.itemsList.markedItem
            && (nextIndex < 0 || nextIndex === this.itemsList.filteredItems.length);
    }
    _handleBackspace() {
        if (this.searchTerm || !this.clearable || !this.clearOnBackspace || !this.hasValue) {
            return;
        }
        if (this.multiple) {
            this.unselect(this.itemsList.lastSelectedItem);
        }
        else {
            this.clearModel();
        }
    }
    get _isTypeahead() {
        return this.typeahead && this.typeahead.observers.length > 0;
    }
    get _validTerm() {
        const term = this.searchTerm && this.searchTerm.trim();
        return term && term.length >= this.minTermLength;
    }
    _mergeGlobalConfig(config) {
        this.placeholder = this.placeholder || config.placeholder;
        this.notFoundText = this.notFoundText || config.notFoundText;
        this.typeToSearchText = this.typeToSearchText || config.typeToSearchText;
        this.addTagText = this.addTagText || config.addTagText;
        this.loadingText = this.loadingText || config.loadingText;
        this.clearAllText = this.clearAllText || config.clearAllText;
        this.virtualScroll = isDefined(this.virtualScroll)
            ? this.virtualScroll
            : isDefined(config.disableVirtualScroll) ? !config.disableVirtualScroll : false;
        this.openOnEnter = isDefined(this.openOnEnter) ? this.openOnEnter : config.openOnEnter;
        this.appendTo = this.appendTo || config.appendTo;
        this.bindValue = this.bindValue || config.bindValue;
        this.bindLabel = this.bindLabel || config.bindLabel;
        this.appearance = this.appearance || config.appearance;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: NgSelectComponent, deps: [{ token: 'class', attribute: true }, { token: 'autofocus', attribute: true }, { token: i1.NgSelectConfig }, { token: SELECTION_MODEL_FACTORY }, { token: i0.ElementRef }, { token: i0.ChangeDetectorRef }, { token: i2.ConsoleService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "17.0.0", type: NgSelectComponent, selector: "ng-select", inputs: { bindLabel: "bindLabel", bindValue: "bindValue", markFirst: "markFirst", placeholder: "placeholder", notFoundText: "notFoundText", typeToSearchText: "typeToSearchText", addTagText: "addTagText", loadingText: "loadingText", clearAllText: "clearAllText", appearance: "appearance", dropdownPosition: "dropdownPosition", appendTo: "appendTo", loading: "loading", closeOnSelect: "closeOnSelect", hideSelected: "hideSelected", selectOnTab: "selectOnTab", openOnEnter: "openOnEnter", maxSelectedItems: "maxSelectedItems", groupBy: "groupBy", groupValue: "groupValue", bufferAmount: "bufferAmount", virtualScroll: "virtualScroll", selectableGroup: "selectableGroup", selectableGroupAsModel: "selectableGroupAsModel", searchFn: "searchFn", trackByFn: "trackByFn", clearOnBackspace: "clearOnBackspace", labelForId: "labelForId", inputAttrs: "inputAttrs", tabIndex: "tabIndex", readonly: "readonly", searchWhileComposing: "searchWhileComposing", minTermLength: "minTermLength", editableSearchTerm: "editableSearchTerm", keyDownFn: "keyDownFn", typeahead: "typeahead", multiple: "multiple", addTag: "addTag", searchable: "searchable", clearable: "clearable", isOpen: "isOpen", items: "items", compareWith: "compareWith", clearSearchOnAdd: "clearSearchOnAdd", deselectOnClick: "deselectOnClick" }, outputs: { blurEvent: "blur", focusEvent: "focus", changeEvent: "change", openEvent: "open", closeEvent: "close", searchEvent: "search", clearEvent: "clear", addEvent: "add", removeEvent: "remove", scroll: "scroll", scrollToEnd: "scrollToEnd" }, host: { listeners: { "keydown": "handleKeyDown($event)" }, properties: { "class.ng-select-typeahead": "this.typeahead", "class.ng-select-multiple": "this.multiple", "class.ng-select-taggable": "this.addTag", "class.ng-select-searchable": "this.searchable", "class.ng-select-clearable": "this.clearable", "class.ng-select-opened": "this.isOpen", "class.ng-select": "this.useDefaultClass", "class.ng-select-disabled": "this.disabled", "class.ng-select-filtered": "this.filtered", "class.ng-select-single": "this.single" } }, providers: [{
                provide: NG_VALUE_ACCESSOR,
                useExisting: forwardRef(() => NgSelectComponent),
                multi: true
            }, NgDropdownPanelService], queries: [{ propertyName: "optionTemplate", first: true, predicate: NgOptionTemplateDirective, descendants: true, read: TemplateRef }, { propertyName: "optgroupTemplate", first: true, predicate: NgOptgroupTemplateDirective, descendants: true, read: TemplateRef }, { propertyName: "labelTemplate", first: true, predicate: NgLabelTemplateDirective, descendants: true, read: TemplateRef }, { propertyName: "multiLabelTemplate", first: true, predicate: NgMultiLabelTemplateDirective, descendants: true, read: TemplateRef }, { propertyName: "headerTemplate", first: true, predicate: NgHeaderTemplateDirective, descendants: true, read: TemplateRef }, { propertyName: "footerTemplate", first: true, predicate: NgFooterTemplateDirective, descendants: true, read: TemplateRef }, { propertyName: "notFoundTemplate", first: true, predicate: NgNotFoundTemplateDirective, descendants: true, read: TemplateRef }, { propertyName: "typeToSearchTemplate", first: true, predicate: NgTypeToSearchTemplateDirective, descendants: true, read: TemplateRef }, { propertyName: "loadingTextTemplate", first: true, predicate: NgLoadingTextTemplateDirective, descendants: true, read: TemplateRef }, { propertyName: "tagTemplate", first: true, predicate: NgTagTemplateDirective, descendants: true, read: TemplateRef }, { propertyName: "loadingSpinnerTemplate", first: true, predicate: NgLoadingSpinnerTemplateDirective, descendants: true, read: TemplateRef }, { propertyName: "ngOptions", predicate: NgOptionComponent, descendants: true }], viewQueries: [{ propertyName: "dropdownPanel", first: true, predicate: i0.forwardRef(() => NgDropdownPanelComponent), descendants: true }, { propertyName: "searchInput", first: true, predicate: ["searchInput"], descendants: true, static: true }, { propertyName: "clearButton", first: true, predicate: ["clearButton"], descendants: true }], usesOnChanges: true, ngImport: i0, template: "<div\n    (mousedown)=\"handleMousedown($event)\"\n    [class.ng-appearance-outline]=\"appearance === 'outline'\"\n    [class.ng-has-value]=\"hasValue\"\n    class=\"ng-select-container\">\n\n    <div class=\"ng-value-container\">\n        <div class=\"ng-placeholder\">{{placeholder}}</div>\n\n        <ng-container *ngIf=\"(!multiLabelTemplate  || !multiple ) && selectedItems.length > 0\">\n            <div [class.ng-value-disabled]=\"item.disabled\" class=\"ng-value\" *ngFor=\"let item of selectedItems; trackBy: trackByOption\">\n                <ng-template #defaultLabelTemplate>\n                    <span class=\"ng-value-icon left\" (click)=\"unselect(item);\" aria-hidden=\"true\">\u00D7</span>\n                    <span class=\"ng-value-label\" [ngItemLabel]=\"item.label\" [escape]=\"escapeHTML\"></span>\n                </ng-template>\n\n                <ng-template\n                    [ngTemplateOutlet]=\"labelTemplate || defaultLabelTemplate\"\n                    [ngTemplateOutletContext]=\"{ item: item.value, clear: clearItem, label: item.label }\">\n                </ng-template>\n            </div>\n        </ng-container>\n\n        <ng-template *ngIf=\"multiple && multiLabelTemplate && selectedValues.length > 0\"\n                [ngTemplateOutlet]=\"multiLabelTemplate\"\n                [ngTemplateOutletContext]=\"{ items: selectedValues, clear: clearItem }\">\n        </ng-template>\n\n        <div class=\"ng-input\"\n            role=\"combobox\" \n            [attr.aria-expanded]=\"isOpen\" \n            [attr.aria-owns]=\"isOpen ? dropdownId : null\" \n            aria-haspopup=\"listbox\">\n\n            <input #searchInput\n                   [attr.id]=\"labelForId\"\n                   [attr.tabindex]=\"tabIndex\"\n                   [readOnly]=\"!searchable || itemsList.maxItemsSelected\"\n                   [disabled]=\"disabled\"\n                   [value]=\"searchTerm ? searchTerm : ''\"\n                   (input)=\"filter(searchInput.value)\"\n                   (compositionstart)=\"onCompositionStart()\"\n                   (compositionend)=\"onCompositionEnd(searchInput.value)\"\n                   (focus)=\"onInputFocus($event)\"\n                   (blur)=\"onInputBlur($event)\"\n                   (change)=\"$event.stopPropagation()\"\n                   [attr.aria-activedescendant]=\"isOpen ? itemsList?.markedItem?.htmlId : null\"\n                   aria-autocomplete=\"list\"\n                   [attr.aria-controls]=\"isOpen ? dropdownId : null\">\n        </div>\n    </div>\n\n    <ng-container *ngIf=\"loading\">\n        <ng-template #defaultLoadingSpinnerTemplate>\n            <div class=\"ng-spinner-loader\"></div>\n        </ng-template>\n\n        <ng-template\n            [ngTemplateOutlet]=\"loadingSpinnerTemplate || defaultLoadingSpinnerTemplate\">\n        </ng-template>\n    </ng-container>\n\n    <span *ngIf=\"showClear()\" class=\"ng-clear-wrapper\" tabindex=\"0\" title=\"{{clearAllText}}\" #clearButton>\n        <span class=\"ng-clear\" aria-hidden=\"true\">\u00D7</span>\n    </span>\n\n    <span class=\"ng-arrow-wrapper\">\n        <span class=\"ng-arrow\"></span>\n    </span>\n</div>\n\n<ng-dropdown-panel *ngIf=\"isOpen\"\n                   class=\"ng-dropdown-panel\"\n                   [virtualScroll]=\"virtualScroll\"\n                   [bufferAmount]=\"bufferAmount\"\n                   [appendTo]=\"appendTo\"\n                   [position]=\"dropdownPosition\"\n                   [headerTemplate]=\"headerTemplate\"\n                   [footerTemplate]=\"footerTemplate\"\n                   [filterValue]=\"searchTerm\"\n                   [items]=\"itemsList.filteredItems\"\n                   [markedItem]=\"itemsList.markedItem\"\n                   (update)=\"viewPortItems = $event\"\n                   (scroll)=\"scroll.emit($event)\"\n                   (scrollToEnd)=\"scrollToEnd.emit($event)\"\n                   (outsideClick)=\"close()\"\n                   [class.ng-select-multiple]=\"multiple\"\n                   [ngClass]=\"appendTo ? classes : null\"\n                   [id]=\"dropdownId\"\n                   role=\"listbox\"\n                   aria-label=\"Options list\">\n\n    <ng-container>\n        <div class=\"ng-option\" [attr.role]=\"item.children ? 'group' : 'option'\" (click)=\"toggleItem(item)\" (mouseover)=\"onItemHover(item)\"\n                *ngFor=\"let item of viewPortItems; trackBy: trackByOption\"\n                [class.ng-option-disabled]=\"item.disabled\"\n                [class.ng-option-selected]=\"item.selected\"\n                [class.ng-optgroup]=\"item.children\"\n                [class.ng-option]=\"!item.children\"\n                [class.ng-option-child]=\"!!item.parent\"\n                [class.ng-option-marked]=\"item === itemsList.markedItem\"\n                [attr.aria-selected]=\"item.selected\"\n                [attr.id]=\"item?.htmlId\">\n\n            <ng-template #defaultOptionTemplate>\n                <span class=\"ng-option-label\" [ngItemLabel]=\"item.label\" [escape]=\"escapeHTML\"></span>\n            </ng-template>\n\n            <ng-template\n                [ngTemplateOutlet]=\"item.children ? (optgroupTemplate || defaultOptionTemplate) : (optionTemplate || defaultOptionTemplate)\"\n                [ngTemplateOutletContext]=\"{ item: item.value, item$:item, index: item.index, searchTerm: searchTerm }\">\n            </ng-template>\n        </div>\n\n        <div class=\"ng-option\" [class.ng-option-marked]=\"!itemsList.markedItem\" (mouseover)=\"itemsList.unmarkItem()\" role=\"option\" (click)=\"selectTag()\" *ngIf=\"showAddTag\">\n            <ng-template #defaultTagTemplate>\n                <span><span class=\"ng-tag-label\">{{addTagText}}</span>\"{{searchTerm}}\"</span>\n            </ng-template>\n\n            <ng-template\n                [ngTemplateOutlet]=\"tagTemplate || defaultTagTemplate\"\n                [ngTemplateOutletContext]=\"{ searchTerm: searchTerm }\">\n            </ng-template>\n        </div>\n    </ng-container>\n\n    <ng-container *ngIf=\"showNoItemsFound()\">\n        <ng-template #defaultNotFoundTemplate>\n            <div class=\"ng-option ng-option-disabled\">{{notFoundText}}</div>\n        </ng-template>\n\n        <ng-template\n            [ngTemplateOutlet]=\"notFoundTemplate || defaultNotFoundTemplate\"\n            [ngTemplateOutletContext]=\"{ searchTerm: searchTerm }\">\n        </ng-template>\n    </ng-container>\n\n    <ng-container *ngIf=\"showTypeToSearch()\">\n        <ng-template #defaultTypeToSearchTemplate>\n            <div class=\"ng-option ng-option-disabled\">{{typeToSearchText}}</div>\n        </ng-template>\n\n        <ng-template\n            [ngTemplateOutlet]=\"typeToSearchTemplate || defaultTypeToSearchTemplate\">\n        </ng-template>\n    </ng-container>\n\n    <ng-container *ngIf=\"loading && itemsList.filteredItems.length === 0\">\n        <ng-template #defaultLoadingTextTemplate>\n            <div class=\"ng-option ng-option-disabled\">{{loadingText}}</div>\n        </ng-template>\n\n        <ng-template\n            [ngTemplateOutlet]=\"loadingTextTemplate || defaultLoadingTextTemplate\"\n            [ngTemplateOutletContext]=\"{ searchTerm: searchTerm }\">\n        </ng-template>\n    </ng-container>\n\n</ng-dropdown-panel>\n", styles: ["@charset \"UTF-8\";.ng-select{position:relative;display:block;box-sizing:border-box}.ng-select div,.ng-select input,.ng-select span{box-sizing:border-box}.ng-select [hidden]{display:none}.ng-select.ng-select-searchable .ng-select-container .ng-value-container .ng-input{opacity:1}.ng-select.ng-select-opened .ng-select-container{z-index:1001}.ng-select.ng-select-disabled .ng-select-container .ng-value-container .ng-placeholder,.ng-select.ng-select-disabled .ng-select-container .ng-value-container .ng-value{-webkit-user-select:none;user-select:none;cursor:default}.ng-select.ng-select-disabled .ng-arrow-wrapper{cursor:default}.ng-select.ng-select-filtered .ng-placeholder{display:none}.ng-select .ng-select-container{cursor:default;display:flex;outline:none;overflow:hidden;position:relative;width:100%}.ng-select .ng-select-container .ng-value-container{display:flex;flex:1}.ng-select .ng-select-container .ng-value-container .ng-input{opacity:0}.ng-select .ng-select-container .ng-value-container .ng-input>input{box-sizing:content-box;background:none transparent;border:0 none;box-shadow:none;outline:none;padding:0;cursor:default;width:100%}.ng-select .ng-select-container .ng-value-container .ng-input>input::-ms-clear{display:none}.ng-select .ng-select-container .ng-value-container .ng-input>input[readonly]{-webkit-user-select:none;user-select:none;width:0;padding:0}.ng-select.ng-select-single.ng-select-filtered .ng-select-container .ng-value-container .ng-value{visibility:hidden}.ng-select.ng-select-single .ng-select-container .ng-value-container,.ng-select.ng-select-single .ng-select-container .ng-value-container .ng-value{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ng-select.ng-select-single .ng-select-container .ng-value-container .ng-value .ng-value-icon{display:none}.ng-select.ng-select-single .ng-select-container .ng-value-container .ng-input{position:absolute;left:0;width:100%}.ng-select.ng-select-multiple.ng-select-disabled>.ng-select-container .ng-value-container .ng-value .ng-value-icon{display:none}.ng-select.ng-select-multiple .ng-select-container .ng-value-container{flex-wrap:wrap}.ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-placeholder{position:absolute}.ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-value{white-space:nowrap}.ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-value.ng-value-disabled .ng-value-icon{display:none}.ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-value .ng-value-icon{cursor:pointer}.ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-input{flex:1;z-index:2}.ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-placeholder{z-index:1}.ng-select .ng-clear-wrapper{cursor:pointer;position:relative;width:17px;-webkit-user-select:none;user-select:none}.ng-select .ng-clear-wrapper .ng-clear{display:inline-block;font-size:18px;line-height:1;pointer-events:none}.ng-select .ng-spinner-loader{border-radius:50%;width:17px;height:17px;margin-right:5px;font-size:10px;position:relative;text-indent:-9999em;border-top:2px solid rgba(66,66,66,.2);border-right:2px solid rgba(66,66,66,.2);border-bottom:2px solid rgba(66,66,66,.2);border-left:2px solid #424242;transform:translateZ(0);animation:load8 .8s infinite linear}.ng-select .ng-spinner-loader:after{border-radius:50%;width:17px;height:17px}@keyframes load8{0%{transform:rotate(0)}to{transform:rotate(360deg)}}.ng-select .ng-arrow-wrapper{cursor:pointer;position:relative;text-align:center;-webkit-user-select:none;user-select:none}.ng-select .ng-arrow-wrapper .ng-arrow{pointer-events:none;display:inline-block;height:0;width:0;position:relative}.ng-dropdown-panel{box-sizing:border-box;position:absolute;opacity:0;width:100%;z-index:1050;-webkit-overflow-scrolling:touch}.ng-dropdown-panel .ng-dropdown-panel-items{display:block;height:auto;box-sizing:border-box;max-height:240px;overflow-y:auto}.ng-dropdown-panel .ng-dropdown-panel-items .ng-optgroup{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ng-dropdown-panel .ng-dropdown-panel-items .ng-option{box-sizing:border-box;cursor:pointer;display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ng-dropdown-panel .ng-dropdown-panel-items .ng-option .ng-option-label:empty:before{content:\"\\200b\"}.ng-dropdown-panel .ng-dropdown-panel-items .ng-option .highlighted{font-weight:700;text-decoration:underline}.ng-dropdown-panel .ng-dropdown-panel-items .ng-option.disabled{cursor:default}.ng-dropdown-panel .scroll-host{overflow:hidden;overflow-y:auto;position:relative;display:block;-webkit-overflow-scrolling:touch}.ng-dropdown-panel .scrollable-content{top:0;left:0;width:100%;height:100%;position:absolute}.ng-dropdown-panel .total-padding{width:1px;opacity:0}\n"], dependencies: [{ kind: "directive", type: i3.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i3.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i3.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i3.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "component", type: i4.NgDropdownPanelComponent, selector: "ng-dropdown-panel", inputs: ["items", "markedItem", "position", "appendTo", "bufferAmount", "virtualScroll", "headerTemplate", "footerTemplate", "filterValue"], outputs: ["update", "scroll", "scrollToEnd", "outsideClick"] }, { kind: "directive", type: i5.NgItemLabelDirective, selector: "[ngItemLabel]", inputs: ["ngItemLabel", "escape"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: NgSelectComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ng-select', providers: [{
                            provide: NG_VALUE_ACCESSOR,
                            useExisting: forwardRef(() => NgSelectComponent),
                            multi: true
                        }, NgDropdownPanelService], encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.OnPush, template: "<div\n    (mousedown)=\"handleMousedown($event)\"\n    [class.ng-appearance-outline]=\"appearance === 'outline'\"\n    [class.ng-has-value]=\"hasValue\"\n    class=\"ng-select-container\">\n\n    <div class=\"ng-value-container\">\n        <div class=\"ng-placeholder\">{{placeholder}}</div>\n\n        <ng-container *ngIf=\"(!multiLabelTemplate  || !multiple ) && selectedItems.length > 0\">\n            <div [class.ng-value-disabled]=\"item.disabled\" class=\"ng-value\" *ngFor=\"let item of selectedItems; trackBy: trackByOption\">\n                <ng-template #defaultLabelTemplate>\n                    <span class=\"ng-value-icon left\" (click)=\"unselect(item);\" aria-hidden=\"true\">\u00D7</span>\n                    <span class=\"ng-value-label\" [ngItemLabel]=\"item.label\" [escape]=\"escapeHTML\"></span>\n                </ng-template>\n\n                <ng-template\n                    [ngTemplateOutlet]=\"labelTemplate || defaultLabelTemplate\"\n                    [ngTemplateOutletContext]=\"{ item: item.value, clear: clearItem, label: item.label }\">\n                </ng-template>\n            </div>\n        </ng-container>\n\n        <ng-template *ngIf=\"multiple && multiLabelTemplate && selectedValues.length > 0\"\n                [ngTemplateOutlet]=\"multiLabelTemplate\"\n                [ngTemplateOutletContext]=\"{ items: selectedValues, clear: clearItem }\">\n        </ng-template>\n\n        <div class=\"ng-input\"\n            role=\"combobox\" \n            [attr.aria-expanded]=\"isOpen\" \n            [attr.aria-owns]=\"isOpen ? dropdownId : null\" \n            aria-haspopup=\"listbox\">\n\n            <input #searchInput\n                   [attr.id]=\"labelForId\"\n                   [attr.tabindex]=\"tabIndex\"\n                   [readOnly]=\"!searchable || itemsList.maxItemsSelected\"\n                   [disabled]=\"disabled\"\n                   [value]=\"searchTerm ? searchTerm : ''\"\n                   (input)=\"filter(searchInput.value)\"\n                   (compositionstart)=\"onCompositionStart()\"\n                   (compositionend)=\"onCompositionEnd(searchInput.value)\"\n                   (focus)=\"onInputFocus($event)\"\n                   (blur)=\"onInputBlur($event)\"\n                   (change)=\"$event.stopPropagation()\"\n                   [attr.aria-activedescendant]=\"isOpen ? itemsList?.markedItem?.htmlId : null\"\n                   aria-autocomplete=\"list\"\n                   [attr.aria-controls]=\"isOpen ? dropdownId : null\">\n        </div>\n    </div>\n\n    <ng-container *ngIf=\"loading\">\n        <ng-template #defaultLoadingSpinnerTemplate>\n            <div class=\"ng-spinner-loader\"></div>\n        </ng-template>\n\n        <ng-template\n            [ngTemplateOutlet]=\"loadingSpinnerTemplate || defaultLoadingSpinnerTemplate\">\n        </ng-template>\n    </ng-container>\n\n    <span *ngIf=\"showClear()\" class=\"ng-clear-wrapper\" tabindex=\"0\" title=\"{{clearAllText}}\" #clearButton>\n        <span class=\"ng-clear\" aria-hidden=\"true\">\u00D7</span>\n    </span>\n\n    <span class=\"ng-arrow-wrapper\">\n        <span class=\"ng-arrow\"></span>\n    </span>\n</div>\n\n<ng-dropdown-panel *ngIf=\"isOpen\"\n                   class=\"ng-dropdown-panel\"\n                   [virtualScroll]=\"virtualScroll\"\n                   [bufferAmount]=\"bufferAmount\"\n                   [appendTo]=\"appendTo\"\n                   [position]=\"dropdownPosition\"\n                   [headerTemplate]=\"headerTemplate\"\n                   [footerTemplate]=\"footerTemplate\"\n                   [filterValue]=\"searchTerm\"\n                   [items]=\"itemsList.filteredItems\"\n                   [markedItem]=\"itemsList.markedItem\"\n                   (update)=\"viewPortItems = $event\"\n                   (scroll)=\"scroll.emit($event)\"\n                   (scrollToEnd)=\"scrollToEnd.emit($event)\"\n                   (outsideClick)=\"close()\"\n                   [class.ng-select-multiple]=\"multiple\"\n                   [ngClass]=\"appendTo ? classes : null\"\n                   [id]=\"dropdownId\"\n                   role=\"listbox\"\n                   aria-label=\"Options list\">\n\n    <ng-container>\n        <div class=\"ng-option\" [attr.role]=\"item.children ? 'group' : 'option'\" (click)=\"toggleItem(item)\" (mouseover)=\"onItemHover(item)\"\n                *ngFor=\"let item of viewPortItems; trackBy: trackByOption\"\n                [class.ng-option-disabled]=\"item.disabled\"\n                [class.ng-option-selected]=\"item.selected\"\n                [class.ng-optgroup]=\"item.children\"\n                [class.ng-option]=\"!item.children\"\n                [class.ng-option-child]=\"!!item.parent\"\n                [class.ng-option-marked]=\"item === itemsList.markedItem\"\n                [attr.aria-selected]=\"item.selected\"\n                [attr.id]=\"item?.htmlId\">\n\n            <ng-template #defaultOptionTemplate>\n                <span class=\"ng-option-label\" [ngItemLabel]=\"item.label\" [escape]=\"escapeHTML\"></span>\n            </ng-template>\n\n            <ng-template\n                [ngTemplateOutlet]=\"item.children ? (optgroupTemplate || defaultOptionTemplate) : (optionTemplate || defaultOptionTemplate)\"\n                [ngTemplateOutletContext]=\"{ item: item.value, item$:item, index: item.index, searchTerm: searchTerm }\">\n            </ng-template>\n        </div>\n\n        <div class=\"ng-option\" [class.ng-option-marked]=\"!itemsList.markedItem\" (mouseover)=\"itemsList.unmarkItem()\" role=\"option\" (click)=\"selectTag()\" *ngIf=\"showAddTag\">\n            <ng-template #defaultTagTemplate>\n                <span><span class=\"ng-tag-label\">{{addTagText}}</span>\"{{searchTerm}}\"</span>\n            </ng-template>\n\n            <ng-template\n                [ngTemplateOutlet]=\"tagTemplate || defaultTagTemplate\"\n                [ngTemplateOutletContext]=\"{ searchTerm: searchTerm }\">\n            </ng-template>\n        </div>\n    </ng-container>\n\n    <ng-container *ngIf=\"showNoItemsFound()\">\n        <ng-template #defaultNotFoundTemplate>\n            <div class=\"ng-option ng-option-disabled\">{{notFoundText}}</div>\n        </ng-template>\n\n        <ng-template\n            [ngTemplateOutlet]=\"notFoundTemplate || defaultNotFoundTemplate\"\n            [ngTemplateOutletContext]=\"{ searchTerm: searchTerm }\">\n        </ng-template>\n    </ng-container>\n\n    <ng-container *ngIf=\"showTypeToSearch()\">\n        <ng-template #defaultTypeToSearchTemplate>\n            <div class=\"ng-option ng-option-disabled\">{{typeToSearchText}}</div>\n        </ng-template>\n\n        <ng-template\n            [ngTemplateOutlet]=\"typeToSearchTemplate || defaultTypeToSearchTemplate\">\n        </ng-template>\n    </ng-container>\n\n    <ng-container *ngIf=\"loading && itemsList.filteredItems.length === 0\">\n        <ng-template #defaultLoadingTextTemplate>\n            <div class=\"ng-option ng-option-disabled\">{{loadingText}}</div>\n        </ng-template>\n\n        <ng-template\n            [ngTemplateOutlet]=\"loadingTextTemplate || defaultLoadingTextTemplate\"\n            [ngTemplateOutletContext]=\"{ searchTerm: searchTerm }\">\n        </ng-template>\n    </ng-container>\n\n</ng-dropdown-panel>\n", styles: ["@charset \"UTF-8\";.ng-select{position:relative;display:block;box-sizing:border-box}.ng-select div,.ng-select input,.ng-select span{box-sizing:border-box}.ng-select [hidden]{display:none}.ng-select.ng-select-searchable .ng-select-container .ng-value-container .ng-input{opacity:1}.ng-select.ng-select-opened .ng-select-container{z-index:1001}.ng-select.ng-select-disabled .ng-select-container .ng-value-container .ng-placeholder,.ng-select.ng-select-disabled .ng-select-container .ng-value-container .ng-value{-webkit-user-select:none;user-select:none;cursor:default}.ng-select.ng-select-disabled .ng-arrow-wrapper{cursor:default}.ng-select.ng-select-filtered .ng-placeholder{display:none}.ng-select .ng-select-container{cursor:default;display:flex;outline:none;overflow:hidden;position:relative;width:100%}.ng-select .ng-select-container .ng-value-container{display:flex;flex:1}.ng-select .ng-select-container .ng-value-container .ng-input{opacity:0}.ng-select .ng-select-container .ng-value-container .ng-input>input{box-sizing:content-box;background:none transparent;border:0 none;box-shadow:none;outline:none;padding:0;cursor:default;width:100%}.ng-select .ng-select-container .ng-value-container .ng-input>input::-ms-clear{display:none}.ng-select .ng-select-container .ng-value-container .ng-input>input[readonly]{-webkit-user-select:none;user-select:none;width:0;padding:0}.ng-select.ng-select-single.ng-select-filtered .ng-select-container .ng-value-container .ng-value{visibility:hidden}.ng-select.ng-select-single .ng-select-container .ng-value-container,.ng-select.ng-select-single .ng-select-container .ng-value-container .ng-value{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ng-select.ng-select-single .ng-select-container .ng-value-container .ng-value .ng-value-icon{display:none}.ng-select.ng-select-single .ng-select-container .ng-value-container .ng-input{position:absolute;left:0;width:100%}.ng-select.ng-select-multiple.ng-select-disabled>.ng-select-container .ng-value-container .ng-value .ng-value-icon{display:none}.ng-select.ng-select-multiple .ng-select-container .ng-value-container{flex-wrap:wrap}.ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-placeholder{position:absolute}.ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-value{white-space:nowrap}.ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-value.ng-value-disabled .ng-value-icon{display:none}.ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-value .ng-value-icon{cursor:pointer}.ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-input{flex:1;z-index:2}.ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-placeholder{z-index:1}.ng-select .ng-clear-wrapper{cursor:pointer;position:relative;width:17px;-webkit-user-select:none;user-select:none}.ng-select .ng-clear-wrapper .ng-clear{display:inline-block;font-size:18px;line-height:1;pointer-events:none}.ng-select .ng-spinner-loader{border-radius:50%;width:17px;height:17px;margin-right:5px;font-size:10px;position:relative;text-indent:-9999em;border-top:2px solid rgba(66,66,66,.2);border-right:2px solid rgba(66,66,66,.2);border-bottom:2px solid rgba(66,66,66,.2);border-left:2px solid #424242;transform:translateZ(0);animation:load8 .8s infinite linear}.ng-select .ng-spinner-loader:after{border-radius:50%;width:17px;height:17px}@keyframes load8{0%{transform:rotate(0)}to{transform:rotate(360deg)}}.ng-select .ng-arrow-wrapper{cursor:pointer;position:relative;text-align:center;-webkit-user-select:none;user-select:none}.ng-select .ng-arrow-wrapper .ng-arrow{pointer-events:none;display:inline-block;height:0;width:0;position:relative}.ng-dropdown-panel{box-sizing:border-box;position:absolute;opacity:0;width:100%;z-index:1050;-webkit-overflow-scrolling:touch}.ng-dropdown-panel .ng-dropdown-panel-items{display:block;height:auto;box-sizing:border-box;max-height:240px;overflow-y:auto}.ng-dropdown-panel .ng-dropdown-panel-items .ng-optgroup{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ng-dropdown-panel .ng-dropdown-panel-items .ng-option{box-sizing:border-box;cursor:pointer;display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ng-dropdown-panel .ng-dropdown-panel-items .ng-option .ng-option-label:empty:before{content:\"\\200b\"}.ng-dropdown-panel .ng-dropdown-panel-items .ng-option .highlighted{font-weight:700;text-decoration:underline}.ng-dropdown-panel .ng-dropdown-panel-items .ng-option.disabled{cursor:default}.ng-dropdown-panel .scroll-host{overflow:hidden;overflow-y:auto;position:relative;display:block;-webkit-overflow-scrolling:touch}.ng-dropdown-panel .scrollable-content{top:0;left:0;width:100%;height:100%;position:absolute}.ng-dropdown-panel .total-padding{width:1px;opacity:0}\n"] }]
        }], ctorParameters: () => [{ type: undefined, decorators: [{
                    type: Attribute,
                    args: ['class']
                }] }, { type: undefined, decorators: [{
                    type: Attribute,
                    args: ['autofocus']
                }] }, { type: i1.NgSelectConfig }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [SELECTION_MODEL_FACTORY]
                }] }, { type: i0.ElementRef }, { type: i0.ChangeDetectorRef }, { type: i2.ConsoleService }], propDecorators: { bindLabel: [{
                type: Input
            }], bindValue: [{
                type: Input
            }], markFirst: [{
                type: Input
            }], placeholder: [{
                type: Input
            }], notFoundText: [{
                type: Input
            }], typeToSearchText: [{
                type: Input
            }], addTagText: [{
                type: Input
            }], loadingText: [{
                type: Input
            }], clearAllText: [{
                type: Input
            }], appearance: [{
                type: Input
            }], dropdownPosition: [{
                type: Input
            }], appendTo: [{
                type: Input
            }], loading: [{
                type: Input
            }], closeOnSelect: [{
                type: Input
            }], hideSelected: [{
                type: Input
            }], selectOnTab: [{
                type: Input
            }], openOnEnter: [{
                type: Input
            }], maxSelectedItems: [{
                type: Input
            }], groupBy: [{
                type: Input
            }], groupValue: [{
                type: Input
            }], bufferAmount: [{
                type: Input
            }], virtualScroll: [{
                type: Input
            }], selectableGroup: [{
                type: Input
            }], selectableGroupAsModel: [{
                type: Input
            }], searchFn: [{
                type: Input
            }], trackByFn: [{
                type: Input
            }], clearOnBackspace: [{
                type: Input
            }], labelForId: [{
                type: Input
            }], inputAttrs: [{
                type: Input
            }], tabIndex: [{
                type: Input
            }], readonly: [{
                type: Input
            }], searchWhileComposing: [{
                type: Input
            }], minTermLength: [{
                type: Input
            }], editableSearchTerm: [{
                type: Input
            }], keyDownFn: [{
                type: Input
            }], typeahead: [{
                type: Input
            }, {
                type: HostBinding,
                args: ['class.ng-select-typeahead']
            }], multiple: [{
                type: Input
            }, {
                type: HostBinding,
                args: ['class.ng-select-multiple']
            }], addTag: [{
                type: Input
            }, {
                type: HostBinding,
                args: ['class.ng-select-taggable']
            }], searchable: [{
                type: Input
            }, {
                type: HostBinding,
                args: ['class.ng-select-searchable']
            }], clearable: [{
                type: Input
            }, {
                type: HostBinding,
                args: ['class.ng-select-clearable']
            }], isOpen: [{
                type: Input
            }, {
                type: HostBinding,
                args: ['class.ng-select-opened']
            }], items: [{
                type: Input
            }], compareWith: [{
                type: Input
            }], clearSearchOnAdd: [{
                type: Input
            }], deselectOnClick: [{
                type: Input
            }], blurEvent: [{
                type: Output,
                args: ['blur']
            }], focusEvent: [{
                type: Output,
                args: ['focus']
            }], changeEvent: [{
                type: Output,
                args: ['change']
            }], openEvent: [{
                type: Output,
                args: ['open']
            }], closeEvent: [{
                type: Output,
                args: ['close']
            }], searchEvent: [{
                type: Output,
                args: ['search']
            }], clearEvent: [{
                type: Output,
                args: ['clear']
            }], addEvent: [{
                type: Output,
                args: ['add']
            }], removeEvent: [{
                type: Output,
                args: ['remove']
            }], scroll: [{
                type: Output,
                args: ['scroll']
            }], scrollToEnd: [{
                type: Output,
                args: ['scrollToEnd']
            }], optionTemplate: [{
                type: ContentChild,
                args: [NgOptionTemplateDirective, { read: TemplateRef }]
            }], optgroupTemplate: [{
                type: ContentChild,
                args: [NgOptgroupTemplateDirective, { read: TemplateRef }]
            }], labelTemplate: [{
                type: ContentChild,
                args: [NgLabelTemplateDirective, { read: TemplateRef }]
            }], multiLabelTemplate: [{
                type: ContentChild,
                args: [NgMultiLabelTemplateDirective, { read: TemplateRef }]
            }], headerTemplate: [{
                type: ContentChild,
                args: [NgHeaderTemplateDirective, { read: TemplateRef }]
            }], footerTemplate: [{
                type: ContentChild,
                args: [NgFooterTemplateDirective, { read: TemplateRef }]
            }], notFoundTemplate: [{
                type: ContentChild,
                args: [NgNotFoundTemplateDirective, { read: TemplateRef }]
            }], typeToSearchTemplate: [{
                type: ContentChild,
                args: [NgTypeToSearchTemplateDirective, { read: TemplateRef }]
            }], loadingTextTemplate: [{
                type: ContentChild,
                args: [NgLoadingTextTemplateDirective, { read: TemplateRef }]
            }], tagTemplate: [{
                type: ContentChild,
                args: [NgTagTemplateDirective, { read: TemplateRef }]
            }], loadingSpinnerTemplate: [{
                type: ContentChild,
                args: [NgLoadingSpinnerTemplateDirective, { read: TemplateRef }]
            }], dropdownPanel: [{
                type: ViewChild,
                args: [forwardRef(() => NgDropdownPanelComponent)]
            }], searchInput: [{
                type: ViewChild,
                args: ['searchInput', { static: true }]
            }], clearButton: [{
                type: ViewChild,
                args: ['clearButton']
            }], ngOptions: [{
                type: ContentChildren,
                args: [NgOptionComponent, { descendants: true }]
            }], useDefaultClass: [{
                type: HostBinding,
                args: ['class.ng-select']
            }], disabled: [{
                type: HostBinding,
                args: ['class.ng-select-disabled']
            }], filtered: [{
                type: HostBinding,
                args: ['class.ng-select-filtered']
            }], single: [{
                type: HostBinding,
                args: ['class.ng-select-single']
            }], handleKeyDown: [{
                type: HostListener,
                args: ['keydown', ['$event']]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmctc2VsZWN0LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9uZy1zZWxlY3QvbGliL25nLXNlbGVjdC5jb21wb25lbnQudHMiLCIuLi8uLi8uLi8uLi9zcmMvbmctc2VsZWN0L2xpYi9uZy1zZWxlY3QuY29tcG9uZW50Lmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNILFNBQVMsRUFLVCxVQUFVLEVBRVYsS0FBSyxFQUNMLE1BQU0sRUFDTixZQUFZLEVBQ1osWUFBWSxFQUNaLFdBQVcsRUFDWCxpQkFBaUIsRUFDakIsWUFBWSxFQUNaLFdBQVcsRUFDWCxTQUFTLEVBRVQsdUJBQXVCLEVBQ3ZCLE1BQU0sRUFFTixlQUFlLEVBRWYsY0FBYyxFQUNkLFNBQVMsRUFDWixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQXdCLGlCQUFpQixFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDekUsT0FBTyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsR0FBRyxFQUFFLFlBQVksRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDdEYsT0FBTyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFFdEMsT0FBTyxFQUNILHlCQUF5QixFQUN6Qix3QkFBd0IsRUFDeEIseUJBQXlCLEVBQ3pCLHlCQUF5QixFQUN6QiwyQkFBMkIsRUFDM0IsMkJBQTJCLEVBQzNCLCtCQUErQixFQUMvQiw4QkFBOEIsRUFDOUIsNkJBQTZCLEVBQzdCLHNCQUFzQixFQUN0QixpQ0FBaUMsRUFDcEMsTUFBTSwwQkFBMEIsQ0FBQztBQUdsQyxPQUFPLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNFLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxjQUFjLENBQUM7QUFDekMsT0FBTyxFQUFZLE9B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QkFDYSxzQkFBc0I7c0JBQTdGLFlBQVk7dUJBQUMsaUNBQWlDLEVBQUUsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFO2dCQUVmLGFBQWE7c0JBQW5FLFNBQVM7dUJBQUMsVUFBVSxDQUFDLEdBQUcsRUFBRSxDQUFDLHdCQUF3QixDQUFDO2dCQUNULFdBQVc7c0JBQXRELFNBQVM7dUJBQUMsYUFBYSxFQUFFLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRTtnQkFDaEIsV0FBVztzQkFBcEMsU0FBUzt1QkFBQyxhQUFhO2dCQUNtQyxTQUFTO3NCQUFuRSxlQUFlO3VCQUFDLGlCQUFpQixFQUFFLEVBQUUsV0FBVyxFQUFFLElBQUksRUFBRTtnQkFFekIsZUFBZTtzQkFBOUMsV0FBVzt1QkFBQyxpQkFBaUI7Z0JBRWUsUUFBUTtzQkFBcEQsV0FBVzt1QkFBQywwQkFBMEI7Z0JBRU0sUUFBUTtzQkFBcEQsV0FBVzt1QkFBQywwQkFBMEI7Z0JBRUksTUFBTTtzQkFBaEQsV0FBVzt1QkFBQyx3QkFBd0I7Z0JBdUdyQyxhQUFhO3NCQURaLFlBQVk7dUJBQUMsU0FBUyxFQUFFLENBQUMsUUFBUSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgICBDb21wb25lbnQsXG4gICAgT25DaGFuZ2VzLFxuICAgIE9uRGVzdHJveSxcbiAgICBPbkluaXQsXG4gICAgQWZ0ZXJWaWV3SW5pdCxcbiAgICBmb3J3YXJkUmVmLFxuICAgIENoYW5nZURldGVjdG9yUmVmLFxuICAgIElucHV0LFxuICAgIE91dHB1dCxcbiAgICBFdmVudEVtaXR0ZXIsXG4gICAgQ29udGVudENoaWxkLFxuICAgIFRlbXBsYXRlUmVmLFxuICAgIFZpZXdFbmNhcHN1bGF0aW9uLFxuICAgIEhvc3RMaXN0ZW5lcixcbiAgICBIb3N0QmluZGluZyxcbiAgICBWaWV3Q2hpbGQsXG4gICAgRWxlbWVudFJlZixcbiAgICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgICBJbmplY3QsXG4gICAgU2ltcGxlQ2hhbmdlcyxcbiAgICBDb250ZW50Q2hpbGRyZW4sXG4gICAgUXVlcnlMaXN0LFxuICAgIEluamVjdGlvblRva2VuLFxuICAgIEF0dHJpYnV0ZVxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENvbnRyb2xWYWx1ZUFjY2Vzc29yLCBOR19WQUxVRV9BQ0NFU1NPUiB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7IHRha2VVbnRpbCwgc3RhcnRXaXRoLCB0YXAsIGRlYm91bmNlVGltZSwgbWFwLCBmaWx0ZXIgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQgeyBTdWJqZWN0LCBtZXJnZSB9IGZyb20gJ3J4anMnO1xuXG5pbXBvcnQge1xuICAgIE5nT3B0aW9uVGVtcGxhdGVEaXJlY3RpdmUsXG4gICAgTmdMYWJlbFRlbXBsYXRlRGlyZWN0aXZlLFxuICAgIE5nSGVhZGVyVGVtcGxhdGVEaXJlY3RpdmUsXG4gICAgTmdGb290ZXJUZW1wbGF0ZURpcmVjdGl2ZSxcbiAgICBOZ09wdGdyb3VwVGVtcGxhdGVEaXJlY3RpdmUsXG4gICAgTmdOb3RGb3VuZFRlbXBsYXRlRGlyZWN0aXZlLFxuICAgIE5nVHlwZVRvU2VhcmNoVGVtcGxhdGVEaXJlY3RpdmUsXG4gICAgTmdMb2FkaW5nVGV4dFRlbXBsYXRlRGlyZWN0aXZlLFxuICAgIE5nTXVsdGlMYWJlbFRlbXBsYXRlRGlyZWN0aXZlLFxuICAgIE5nVGFnVGVtcGxhdGVEaXJlY3RpdmUsXG4gICAgTmdMb2FkaW5nU3Bpbm5lclRlbXBsYXRlRGlyZWN0aXZlXG59IGZyb20gJy4vbmctdGVtcGxhdGVzLmRpcmVjdGl2ZSc7XG5cbmltcG9ydCB7IENvbnNvbGVTZXJ2aWNlIH0gZnJvbSAnLi9jb25zb2xlLnNlcnZpY2UnO1xuaW1wb3J0IHsgaXNEZWZpbmVkLCBpc0Z1bmN0aW9uLCBpc1Byb21pc2UsIGlzT2JqZWN0IH0gZnJvbSAnLi92YWx1ZS11dGlscyc7XG5pbXBvcnQgeyBJdGVtc0xpc3QgfSBmcm9tICcuL2l0ZW1zLWxpc3QnO1xuaW1wb3J0IHsgTmdPcHRpb24sIEtleUNvZGUsIERyb3Bkb3duUG9zaXRpb24gfSBmcm9tICcuL25nLXNlbGVjdC50eXBlcyc7XG5pbXBvcnQgeyBuZXdJZCB9IGZyb20gJy4vaWQnO1xuaW1wb3J0IHsgTmdEcm9wZG93blBhbmVsQ29tcG9uZW50IH0gZnJvbSAnLi9uZy1kcm9wZG93bi1wYW5lbC5jb21wb25lbnQnO1xuaW1wb3J0IHsgTmdPcHRpb25Db21wb25lbnQgfSBmcm9tICcuL25nLW9wdGlvbi5jb21wb25lbnQnO1xuaW1wb3J0IHsgU2VsZWN0aW9uTW9kZWxGYWN0b3J5IH0gZnJvbSAnLi9zZWxlY3Rpb24tbW9kZWwnO1xuaW1wb3J0IHsgTmdTZWxlY3RDb25maWcgfSBmcm9tICcuL2NvbmZpZy5zZXJ2aWNlJztcbmltcG9ydCB7IE5nRHJvcGRvd25QYW5lbFNlcnZpY2UgfSBmcm9tICcuL25nLWRyb3Bkb3duLXBhbmVsLnNlcnZpY2UnO1xuXG5leHBvcnQgY29uc3QgU0VMRUNUSU9OX01PREVMX0ZBQ1RPUlkgPSBuZXcgSW5qZWN0aW9uVG9rZW48U2VsZWN0aW9uTW9kZWxGYWN0b3J5Pignbmctc2VsZWN0LXNlbGVjdGlvbi1tb2RlbCcpO1xuZXhwb3J0IHR5cGUgQWRkVGFnRm4gPSAoKHRlcm06IHN0cmluZykgPT4gYW55IHwgUHJvbWlzZTxhbnk+KTtcbmV4cG9ydCB0eXBlIENvbXBhcmVXaXRoRm4gPSAoYTogYW55LCBiOiBhbnkpID0+IGJvb2xlYW47XG5leHBvcnQgdHlwZSBHcm91cFZhbHVlRm4gPSAoa2V5OiBzdHJpbmcgfCBhbnksIGNoaWxkcmVuOiBhbnlbXSkgPT4gc3RyaW5nIHwgYW55O1xuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ25nLXNlbGVjdCcsXG4gICAgdGVtcGxhdGVVcmw6ICcuL25nLXNlbGVjdC5jb21wb25lbnQuaHRtbCcsXG4gICAgc3R5bGVVcmxzOiBbJy4vbmctc2VsZWN0LmNvbXBvbmVudC5zY3NzJ10sXG4gICAgcHJvdmlkZXJzOiBbe1xuICAgIHByb3ZpZGU6IE5HX1ZBTFVFX0FDQ0VTU09SLFxuICAgIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IE5nU2VsZWN0Q29tcG9uZW50KSxcbiAgICBtdWx0aTogdHJ1ZVxuICAgIH0sIE5nRHJvcGRvd25QYW5lbFNlcnZpY2VdLFxuICAgIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gICAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gICAgfSlcbmV4cG9ydCBjbGFzcyBOZ1NlbGVjdENvbXBvbmVudCBpbXBsZW1lbnRzIE9uRGVzdHJveSwgT25DaGFuZ2VzLCBPbkluaXQsIEFmdGVyVmlld0luaXQsIENvbnRyb2xWYWx1ZUFjY2Vzc29yIHtcblxuICAgIEBJbnB1dCgpIGJpbmRMYWJlbDogc3RyaW5nO1xuICAgIEBJbnB1dCgpIGJpbmRWYWx1ZTogc3RyaW5nO1xuICAgIEBJbnB1dCgpIG1hcmtGaXJzdCA9IHRydWU7XG4gICAgQElucHV0KCkgcGxhY2Vob2xkZXI6IHN0cmluZztcbiAgICBASW5wdXQoKSBub3RGb3VuZFRleHQ6IHN0cmluZztcbiAgICBASW5wdXQoKSB0eXBlVG9TZWFyY2hUZXh0OiBzdHJpbmc7XG4gICAgQElucHV0KCkgYWRkVGFnVGV4dDogc3RyaW5nO1xuICAgIEBJbnB1dCgpIGxvYWRpbmdUZXh0OiBzdHJpbmc7XG4gICAgQElucHV0KCkgY2xlYXJBbGxUZXh0OiBzdHJpbmc7XG4gICAgQElucHV0KCkgYXBwZWFyYW5jZTogc3RyaW5nO1xuICAgIEBJbnB1dCgpIGRyb3Bkb3duUG9zaXRpb246IERyb3Bkb3duUG9zaXRpb24gPSAnYXV0byc7XG4gICAgQElucHV0KCkgYXBwZW5kVG86IHN0cmluZztcbiAgICBASW5wdXQoKSBsb2FkaW5nID0gZmFsc2U7XG4gICAgQElucHV0KCkgY2xvc2VPblNlbGVjdCA9IHRydWU7XG4gICAgQElucHV0KCkgaGlkZVNlbGVjdGVkID0gZmFsc2U7XG4gICAgQElucHV0KCkgc2VsZWN0T25UYWIgPSBmYWxzZTtcbiAgICBASW5wdXQoKSBvcGVuT25FbnRlcjogYm9vbGVhbjtcbiAgICBASW5wdXQoKSBtYXhTZWxlY3RlZEl0ZW1zOiBudW1iZXI7XG4gICAgQElucHV0KCkgZ3JvdXBCeTogc3RyaW5nIHwgKCh2YWx1ZTogYW55KSA9PiBhbnkpO1xuICAgIEBJbnB1dCgpIGdyb3VwVmFsdWU6IEdyb3VwVmFsdWVGbjtcbiAgICBASW5wdXQoKSBidWZmZXJBbW91bnQgPSA0O1xuICAgIEBJbnB1dCgpIHZpcnR1YWxTY3JvbGw6IGJvb2xlYW47XG4gICAgQElucHV0KCkgc2VsZWN0YWJsZUdyb3VwID0gZmFsc2U7XG4gICAgQElucHV0KCkgc2VsZWN0YWJsZUdyb3VwQXNNb2RlbCA9IHRydWU7XG4gICAgQElucHV0KCkgc2VhcmNoRm4gPSBudWxsO1xuICAgIEBJbnB1dCgpIHRyYWNrQnlGbiA9IG51bGw7XG4gICAgQElucHV0KCkgY2xlYXJPbkJhY2tzcGFjZSA9IHRydWU7XG4gICAgQElucHV0KCkgbGFiZWxGb3JJZCA9IG51bGw7XG4gICAgQElucHV0KCkgaW5wdXRBdHRyczogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfSA9IHt9O1xuICAgIEBJbnB1dCgpIHRhYkluZGV4OiBudW1iZXI7XG4gICAgQElucHV0KCkgcmVhZG9ubHkgPSBmYWxzZTtcbiAgICBASW5wdXQoKSBzZWFyY2hXaGlsZUNvbXBvc2luZyA9IHRydWU7XG4gICAgQElucHV0KCkgbWluVGVybUxlbmd0aCA9IDA7XG4gICAgQElucHV0KCkgZWRpdGFibGVTZWFyY2hUZXJtID0gZmFsc2U7XG4gICAgQElucHV0KCkga2V5RG93bkZuID0gKF86IEtleWJvYXJkRXZlbnQpID0+IHRydWU7XG5cbiAgICBASW5wdXQoKSBASG9zdEJpbmRpbmcoJ2NsYXNzLm5nLXNlbGVjdC10eXBlYWhlYWQnKSB0eXBlYWhlYWQ6IFN1YmplY3Q8c3RyaW5nPjtcbiAgICBASW5wdXQoKSBASG9zdEJpbmRpbmcoJ2NsYXNzLm5nLXNlbGVjdC1tdWx0aXBsZScpIG11bHRpcGxlID0gZmFsc2U7XG4gICAgQElucHV0KCkgQEhvc3RCaW5kaW5nKCdjbGFzcy5uZy1zZWxlY3QtdGFnZ2FibGUnKSBhZGRUYWc6IGJvb2xlYW4gfCBBZGRUYWdGbiA9IGZhbHNlO1xuICAgIEBJbnB1dCgpIEBIb3N0QmluZGluZygnY2xhc3Mubmctc2VsZWN0LXNlYXJjaGFibGUnKSBzZWFyY2hhYmxlID0gdHJ1ZTtcbiAgICBASW5wdXQoKSBASG9zdEJpbmRpbmcoJ2NsYXNzLm5nLXNlbGVjdC1jbGVhcmFibGUnKSBjbGVhcmFibGUgPSB0cnVlO1xuICAgIEBJbnB1dCgpIEBIb3N0QmluZGluZygnY2xhc3Mubmctc2VsZWN0LW9wZW5lZCcpIGlzT3BlbiA9IGZhbHNlO1xuXG4gICAgQElucHV0KClcbiAgICBnZXQgaXRlbXMoKSB7IHJldHVybiB0aGlzLl9pdGVtcyB9O1xuXG4gICAgc2V0IGl0ZW1zKHZhbHVlOiByZWFkb25seSBhbnlbXSB8IG51bGwpIHtcbiAgICAgICAgaWYgKHZhbHVlID09PSBudWxsKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IFtdO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2l0ZW1zQXJlVXNlZCA9IHRydWU7XG4gICAgICAgIHRoaXMuX2l0ZW1zID0gdmFsdWU7XG4gICAgfTtcblxuICAgIEBJbnB1dCgpXG4gICAgZ2V0IGNvbXBhcmVXaXRoKCkgeyByZXR1cm4gdGhpcy5fY29tcGFyZVdpdGg7IH1cblxuICAgIHNldCBjb21wYXJlV2l0aChmbjogQ29tcGFyZVdpdGhGbikge1xuICAgICAgICBpZiAoZm4gIT09IHVuZGVmaW5lZCAmJiBmbiAhPT0gbnVsbCAmJiAhaXNGdW5jdGlvbihmbikpIHtcbiAgICAgICAgICAgIHRocm93IEVycm9yKCdgY29tcGFyZVdpdGhgIG11c3QgYmUgYSBmdW5jdGlvbi4nKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9jb21wYXJlV2l0aCA9IGZuO1xuICAgIH1cblxuICAgIEBJbnB1dCgpXG4gICAgZ2V0IGNsZWFyU2VhcmNoT25BZGQoKSB7XG4gICAgICAgIGlmIChpc0RlZmluZWQodGhpcy5fY2xlYXJTZWFyY2hPbkFkZCkpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9jbGVhclNlYXJjaE9uQWRkO1xuICAgICAgICB9IGVsc2UgaWYgKGlzRGVmaW5lZCh0aGlzLmNvbmZpZy5jbGVhclNlYXJjaE9uQWRkKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY29uZmlnLmNsZWFyU2VhcmNoT25BZGQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuY2xvc2VPblNlbGVjdDtcbiAgICB9O1xuXG4gICAgc2V0IGNsZWFyU2VhcmNoT25BZGQodmFsdWUpIHtcbiAgICAgICAgdGhpcy5fY2xlYXJTZWFyY2hPbkFkZCA9IHZhbHVlO1xuICAgIH07XG5cbiAgICBASW5wdXQoKVxuICAgIGdldCBkZXNlbGVjdE9uQ2xpY2soKSB7XG4gICAgICAgIGlmIChpc0RlZmluZWQodGhpcy5fZGVzZWxlY3RPbkNsaWNrKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2Rlc2VsZWN0T25DbGljaztcbiAgICAgICAgfSBlbHNlIGlmIChpc0RlZmluZWQodGhpcy5jb25maWcuZGVzZWxlY3RPbkNsaWNrKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY29uZmlnLmRlc2VsZWN0T25DbGljaztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5tdWx0aXBsZTtcbiAgICB9O1xuXG4gICAgc2V0IGRlc2VsZWN0T25DbGljayh2YWx1ZSkge1xuICAgICAgICB0aGlzLl9kZXNlbGVjdE9uQ2xpY2sgPSB2YWx1ZTtcbiAgICB9O1xuXG4gICAgLy8gb3V0cHV0IGV2ZW50c1xuICAgIEBPdXRwdXQoJ2JsdXInKSBibHVyRXZlbnQgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gICAgQE91dHB1dCgnZm9jdXMnKSBmb2N1c0V2ZW50ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICAgIEBPdXRwdXQoJ2NoYW5nZScpIGNoYW5nZUV2ZW50ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICAgIEBPdXRwdXQoJ29wZW4nKSBvcGVuRXZlbnQgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gICAgQE91dHB1dCgnY2xvc2UnKSBjbG9zZUV2ZW50ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICAgIEBPdXRwdXQoJ3NlYXJjaCcpIHNlYXJjaEV2ZW50ID0gbmV3IEV2ZW50RW1pdHRlcjx7IHRlcm06IHN0cmluZywgaXRlbXM6IGFueVtdIH0+KCk7XG4gICAgQE91dHB1dCgnY2xlYXInKSBjbGVhckV2ZW50ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICAgIEBPdXRwdXQoJ2FkZCcpIGFkZEV2ZW50ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICAgIEBPdXRwdXQoJ3JlbW92ZScpIHJlbW92ZUV2ZW50ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICAgIEBPdXRwdXQoJ3Njcm9sbCcpIHNjcm9sbCA9IG5ldyBFdmVudEVtaXR0ZXI8eyBzdGFydDogbnVtYmVyOyBlbmQ6IG51bWJlciB9PigpO1xuICAgIEBPdXRwdXQoJ3Njcm9sbFRvRW5kJykgc2Nyb2xsVG9FbmQgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgICAvLyBjdXN0b20gdGVtcGxhdGVzXG4gICAgQENvbnRlbnRDaGlsZChOZ09wdGlvblRlbXBsYXRlRGlyZWN0aXZlLCB7IHJlYWQ6IFRlbXBsYXRlUmVmIH0pIG9wdGlvblRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuICAgIEBDb250ZW50Q2hpbGQoTmdPcHRncm91cFRlbXBsYXRlRGlyZWN0aXZlLCB7IHJlYWQ6IFRlbXBsYXRlUmVmIH0pIG9wdGdyb3VwVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG4gICAgQENvbnRlbnRDaGlsZChOZ0xhYmVsVGVtcGxhdGVEaXJlY3RpdmUsIHsgcmVhZDogVGVtcGxhdGVSZWYgfSkgbGFiZWxUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcbiAgICBAQ29udGVudENoaWxkKE5nTXVsdGlMYWJlbFRlbXBsYXRlRGlyZWN0aXZlLCB7IHJlYWQ6IFRlbXBsYXRlUmVmIH0pIG11bHRpTGFiZWxUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcbiAgICBAQ29udGVudENoaWxkKE5nSGVhZGVyVGVtcGxhdGVEaXJlY3RpdmUsIHsgcmVhZDogVGVtcGxhdGVSZWYgfSkgaGVhZGVyVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG4gICAgQENvbnRlbnRDaGlsZChOZ0Zvb3RlclRlbXBsYXRlRGlyZWN0aXZlLCB7IHJlYWQ6IFRlbXBsYXRlUmVmIH0pIGZvb3RlclRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuICAgIEBDb250ZW50Q2hpbGQoTmdOb3RGb3VuZFRlbXBsYXRlRGlyZWN0aXZlLCB7IHJlYWQ6IFRlbXBsYXRlUmVmIH0pIG5vdEZvdW5kVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG4gICAgQENvbnRlbnRDaGlsZChOZ1R5cGVUb1NlYXJjaFRlbXBsYXRlRGlyZWN0aXZlLCB7IHJlYWQ6IFRlbXBsYXRlUmVmIH0pIHR5cGVUb1NlYXJjaFRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuICAgIEBDb250ZW50Q2hpbGQoTmdMb2FkaW5nVGV4dFRlbXBsYXRlRGlyZWN0aXZlLCB7IHJlYWQ6IFRlbXBsYXRlUmVmIH0pIGxvYWRpbmdUZXh0VGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG4gICAgQENvbnRlbnRDaGlsZChOZ1RhZ1RlbXBsYXRlRGlyZWN0aXZlLCB7IHJlYWQ6IFRlbXBsYXRlUmVmIH0pIHRhZ1RlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuICAgIEBDb250ZW50Q2hpbGQoTmdMb2FkaW5nU3Bpbm5lclRlbXBsYXRlRGlyZWN0aXZlLCB7IHJlYWQ6IFRlbXBsYXRlUmVmIH0pIGxvYWRpbmdTcGlubmVyVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgICBAVmlld0NoaWxkKGZvcndhcmRSZWYoKCkgPT4gTmdEcm9wZG93blBhbmVsQ29tcG9uZW50KSkgZHJvcGRvd25QYW5lbDogTmdEcm9wZG93blBhbmVsQ29tcG9uZW50O1xuICAgIEBWaWV3Q2hpbGQoJ3NlYXJjaElucHV0JywgeyBzdGF0aWM6IHRydWUgfSkgc2VhcmNoSW5wdXQ6IEVsZW1lbnRSZWY8SFRNTElucHV0RWxlbWVudD47XG4gICAgQFZpZXdDaGlsZCgnY2xlYXJCdXR0b24nKSBjbGVhckJ1dHRvbjogRWxlbWVudFJlZjxIVE1MU3BhbkVsZW1lbnQ+O1xuICAgIEBDb250ZW50Q2hpbGRyZW4oTmdPcHRpb25Db21wb25lbnQsIHsgZGVzY2VuZGFudHM6IHRydWUgfSkgbmdPcHRpb25zOiBRdWVyeUxpc3Q8TmdPcHRpb25Db21wb25lbnQ+O1xuXG4gICAgQEhvc3RCaW5kaW5nKCdjbGFzcy5uZy1zZWxlY3QnKSB1c2VEZWZhdWx0Q2xhc3MgPSB0cnVlO1xuXG4gICAgQEhvc3RCaW5kaW5nKCdjbGFzcy5uZy1zZWxlY3QtZGlzYWJsZWQnKSBnZXQgZGlzYWJsZWQoKSB7IHJldHVybiB0aGlzLnJlYWRvbmx5IHx8IHRoaXMuX2Rpc2FibGVkIH07XG5cbiAgICBASG9zdEJpbmRpbmcoJ2NsYXNzLm5nLXNlbGVjdC1maWx0ZXJlZCcpIGdldCBmaWx0ZXJlZCgpIHsgcmV0dXJuICghIXRoaXMuc2VhcmNoVGVybSAmJiB0aGlzLnNlYXJjaGFibGUgfHwgdGhpcy5faXNDb21wb3NpbmcpIH07XG5cbiAgICBASG9zdEJpbmRpbmcoJ2NsYXNzLm5nLXNlbGVjdC1zaW5nbGUnKSBnZXQgc2luZ2xlKCkgeyByZXR1cm4gIXRoaXMubXVsdGlwbGUgfTtcblxuICAgIGl0ZW1zTGlzdDogSXRlbXNMaXN0O1xuICAgIHZpZXdQb3J0SXRlbXM6IE5nT3B0aW9uW10gPSBbXTtcbiAgICBzZWFyY2hUZXJtOiBzdHJpbmcgPSBudWxsO1xuICAgIGRyb3Bkb3duSWQgPSBuZXdJZCgpO1xuICAgIGVsZW1lbnQ6IEhUTUxFbGVtZW50O1xuICAgIGZvY3VzZWQ6IGJvb2xlYW47XG4gICAgZXNjYXBlSFRNTCA9IHRydWU7XG5cbiAgICBwcml2YXRlIF9pdGVtczogcmVhZG9ubHkgYW55W10gPSBbXTtcbiAgICBwcml2YXRlIF9pdGVtc0FyZVVzZWQ6IGJvb2xlYW47XG4gICAgcHJpdmF0ZSBfZGVmYXVsdExhYmVsID0gJ2xhYmVsJztcbiAgICBwcml2YXRlIF9wcmltaXRpdmU7XG4gICAgcHJpdmF0ZSBfbWFudWFsT3BlbjogYm9vbGVhbjtcbiAgICBwcml2YXRlIF9kaXNhYmxlZDogYm9vbGVhbjtcbiAgICBwcml2YXRlIF9wcmVzc2VkS2V5czogc3RyaW5nW10gPSBbXTtcbiAgICBwcml2YXRlIF9jb21wYXJlV2l0aDogQ29tcGFyZVdpdGhGbjtcbiAgICBwcml2YXRlIF9jbGVhclNlYXJjaE9uQWRkOiBib29sZWFuO1xuICAgIHByaXZhdGUgX2Rlc2VsZWN0T25DbGljazogYm9vbGVhbjtcbiAgICBwcml2YXRlIF9pc0NvbXBvc2luZyA9IGZhbHNlO1xuXG4gICAgcHJpdmF0ZSBnZXQgX2VkaXRhYmxlU2VhcmNoVGVybSgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZWRpdGFibGVTZWFyY2hUZXJtICYmICF0aGlzLm11bHRpcGxlO1xuICAgIH1cblxuICAgIHByaXZhdGUgcmVhZG9ubHkgX2Rlc3Ryb3kkID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9rZXlQcmVzcyQgPSBuZXcgU3ViamVjdDxzdHJpbmc+KCk7XG4gICAgcHJpdmF0ZSBfb25DaGFuZ2UgPSAoXzogYW55KSA9PiB7IH07XG4gICAgcHJpdmF0ZSBfb25Ub3VjaGVkID0gKCkgPT4geyB9O1xuXG4gICAgY2xlYXJJdGVtID0gKGl0ZW06IGFueSkgPT4ge1xuICAgICAgICBjb25zdCBvcHRpb24gPSB0aGlzLnNlbGVjdGVkSXRlbXMuZmluZCh4ID0+IHgudmFsdWUgPT09IGl0ZW0pO1xuICAgICAgICB0aGlzLnVuc2VsZWN0KG9wdGlvbik7XG4gICAgfTtcblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICBAQXR0cmlidXRlKCdjbGFzcycpIHB1YmxpYyBjbGFzc2VzOiBzdHJpbmcsXG4gICAgICAgIEBBdHRyaWJ1dGUoJ2F1dG9mb2N1cycpIHByaXZhdGUgYXV0b0ZvY3VzOiBhbnksXG4gICAgICAgIHB1YmxpYyBjb25maWc6IE5nU2VsZWN0Q29uZmlnLFxuICAgICAgICBASW5qZWN0KFNFTEVDVElPTl9NT0RFTF9GQUNUT1JZKSBuZXdTZWxlY3Rpb25Nb2RlbDogU2VsZWN0aW9uTW9kZWxGYWN0b3J5LFxuICAgICAgICBfZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG4gICAgICAgIHByaXZhdGUgX2NkOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICAgICAgcHJpdmF0ZSBfY29uc29sZTogQ29uc29sZVNlcnZpY2VcbiAgICApIHtcbiAgICAgICAgdGhpcy5fbWVyZ2VHbG9iYWxDb25maWcoY29uZmlnKTtcbiAgICAgICAgdGhpcy5pdGVtc0xpc3QgPSBuZXcgSXRlbXNMaXN0KHRoaXMsIG5ld1NlbGVjdGlvbk1vZGVsKCkpO1xuICAgICAgICB0aGlzLmVsZW1lbnQgPSBfZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50O1xuICAgIH1cblxuICAgIGdldCBzZWxlY3RlZEl0ZW1zKCk6IE5nT3B0aW9uW10ge1xuICAgICAgICByZXR1cm4gdGhpcy5pdGVtc0xpc3Quc2VsZWN0ZWRJdGVtcztcbiAgICB9XG5cbiAgICBnZXQgc2VsZWN0ZWRWYWx1ZXMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNlbGVjdGVkSXRlbXMubWFwKHggPT4geC52YWx1ZSk7XG4gICAgfVxuXG4gICAgZ2V0IGhhc1ZhbHVlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zZWxlY3RlZEl0ZW1zLmxlbmd0aCA+IDA7XG4gICAgfVxuXG4gICAgZ2V0IGN1cnJlbnRQYW5lbFBvc2l0aW9uKCk6IERyb3Bkb3duUG9zaXRpb24ge1xuICAgICAgICBpZiAodGhpcy5kcm9wZG93blBhbmVsKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5kcm9wZG93blBhbmVsLmN1cnJlbnRQb3NpdGlvbjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIG5nT25Jbml0KCkge1xuICAgICAgICB0aGlzLl9oYW5kbGVLZXlQcmVzc2VzKCk7XG4gICAgICAgIHRoaXMuX3NldElucHV0QXR0cmlidXRlcygpO1xuICAgIH1cblxuICAgIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpIHtcbiAgICAgICAgaWYgKGNoYW5nZXMubXVsdGlwbGUpIHtcbiAgICAgICAgICAgIHRoaXMuaXRlbXNMaXN0LmNsZWFyU2VsZWN0ZWQoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY2hhbmdlcy5pdGVtcykge1xuICAgICAgICAgICAgdGhpcy5fc2V0SXRlbXMoY2hhbmdlcy5pdGVtcy5jdXJyZW50VmFsdWUgfHwgW10pO1xuICAgICAgICB9XG4gICAgICAgIGlmIChjaGFuZ2VzLmlzT3Blbikge1xuICAgICAgICAgICAgdGhpcy5fbWFudWFsT3BlbiA9IGlzRGVmaW5lZChjaGFuZ2VzLmlzT3Blbi5jdXJyZW50VmFsdWUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgICAgICBpZiAoIXRoaXMuX2l0ZW1zQXJlVXNlZCkge1xuICAgICAgICAgICAgdGhpcy5lc2NhcGVIVE1MID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLl9zZXRJdGVtc0Zyb21OZ09wdGlvbnMoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpc0RlZmluZWQodGhpcy5hdXRvRm9jdXMpKSB7XG4gICAgICAgICAgICB0aGlzLmZvY3VzKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBuZ09uRGVzdHJveSgpIHtcbiAgICAgICAgdGhpcy5fZGVzdHJveSQubmV4dCgpO1xuICAgICAgICB0aGlzLl9kZXN0cm95JC5jb21wbGV0ZSgpO1xuICAgIH1cblxuICAgIEBIb3N0TGlzdGVuZXIoJ2tleWRvd24nLCBbJyRldmVudCddKVxuICAgIGhhbmRsZUtleURvd24oJGV2ZW50OiBLZXlib2FyZEV2ZW50KSB7XG4gICAgICAgIGNvbnN0IGtleUNvZGUgPSBLZXlDb2RlWyRldmVudC53aGljaF07XG4gICAgICAgIGlmIChrZXlDb2RlKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5rZXlEb3duRm4oJGV2ZW50KSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmhhbmRsZUtleUNvZGUoJGV2ZW50KVxuICAgICAgICB9IGVsc2UgaWYgKCRldmVudC5rZXkgJiYgJGV2ZW50LmtleS5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgIHRoaXMuX2tleVByZXNzJC5uZXh0KCRldmVudC5rZXkudG9Mb2NhbGVMb3dlckNhc2UoKSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBoYW5kbGVLZXlDb2RlKCRldmVudDogS2V5Ym9hcmRFdmVudCkge1xuICAgICAgICBjb25zdCB0YXJnZXQgPSAkZXZlbnQudGFyZ2V0XG5cbiAgICAgICAgaWYodGhpcy5jbGVhckJ1dHRvbiAmJiB0aGlzLmNsZWFyQnV0dG9uLm5hdGl2ZUVsZW1lbnQgPT09IHRhcmdldCkge1xuICAgICAgICAgICAgdGhpcy5oYW5kbGVLZXlDb2RlQ2xlYXIoJGV2ZW50KVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5oYW5kbGVLZXlDb2RlSW5wdXQoJGV2ZW50KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGhhbmRsZUtleUNvZGVJbnB1dCgkZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcbiAgICAgICAgc3dpdGNoICgkZXZlbnQud2hpY2gpIHtcbiAgICAgICAgY2FzZSBLZXlDb2RlLkFycm93RG93bjpcbiAgICAgICAgICAgIHRoaXMuX2hhbmRsZUFycm93RG93bigkZXZlbnQpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgS2V5Q29kZS5BcnJvd1VwOlxuICAgICAgICAgICAgdGhpcy5faGFuZGxlQXJyb3dVcCgkZXZlbnQpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgS2V5Q29kZS5TcGFjZTpcbiAgICAgICAgICAgIHRoaXMuX2hhbmRsZVNwYWNlKCRldmVudCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBLZXlDb2RlLkVudGVyOlxuICAgICAgICAgICAgdGhpcy5faGFuZGxlRW50ZXIoJGV2ZW50KTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIEtleUNvZGUuVGFiOlxuICAgICAgICAgICAgdGhpcy5faGFuZGxlVGFiKCRldmVudCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBLZXlDb2RlLkVzYzpcbiAgICAgICAgICAgIHRoaXMuY2xvc2UoKTtcbiAgICAgICAgICAgICRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgS2V5Q29kZS5CYWNrc3BhY2U6XG4gICAgICAgICAgICB0aGlzLl9oYW5kbGVCYWNrc3BhY2UoKTtcbiAgICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBoYW5kbGVLZXlDb2RlQ2xlYXIoJGV2ZW50OiBLZXlib2FyZEV2ZW50KSB7XG4gICAgICAgIHN3aXRjaCAoJGV2ZW50LndoaWNoKSB7XG4gICAgICAgIGNhc2UgS2V5Q29kZS5FbnRlcjpcbiAgICAgICAgICAgIHRoaXMuaGFuZGxlQ2xlYXJDbGljaygpO1xuICAgICAgICAgICAgJGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBicmVha1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaGFuZGxlTW91c2Vkb3duKCRldmVudDogTW91c2VFdmVudCkge1xuICAgICAgICBjb25zdCB0YXJnZXQgPSAkZXZlbnQudGFyZ2V0IGFzIEhUTUxFbGVtZW50O1xuICAgICAgICBpZiAodGFyZ2V0LnRhZ05hbWUgIT09ICdJTlBVVCcpIHtcbiAgICAgICAgICAgICRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ25nLWNsZWFyLXdyYXBwZXInKSkge1xuICAgICAgICAgICAgdGhpcy5oYW5kbGVDbGVhckNsaWNrKCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnbmctYXJyb3ctd3JhcHBlcicpKSB7XG4gICAgICAgICAgICB0aGlzLmhhbmRsZUFycm93Q2xpY2soKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCduZy12YWx1ZS1pY29uJykpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghdGhpcy5mb2N1c2VkKSB7XG4gICAgICAgICAgICB0aGlzLmZvY3VzKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5zZWFyY2hhYmxlKSB7XG4gICAgICAgICAgICB0aGlzLm9wZW4oKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMudG9nZ2xlKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBoYW5kbGVBcnJvd0NsaWNrKCkge1xuICAgICAgICBpZiAodGhpcy5pc09wZW4pIHtcbiAgICAgICAgICAgIHRoaXMuY2xvc2UoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMub3BlbigpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaGFuZGxlQ2xlYXJDbGljaygpIHtcbiAgICAgICAgaWYgKHRoaXMuaGFzVmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuaXRlbXNMaXN0LmNsZWFyU2VsZWN0ZWQodHJ1ZSk7XG4gICAgICAgICAgICB0aGlzLl91cGRhdGVOZ01vZGVsKCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fY2xlYXJTZWFyY2goKTtcbiAgICAgICAgdGhpcy5mb2N1cygpO1xuICAgICAgICB0aGlzLmNsZWFyRXZlbnQuZW1pdCgpO1xuXG4gICAgICAgIHRoaXMuX29uU2VsZWN0aW9uQ2hhbmdlZCgpO1xuICAgIH1cblxuICAgIGNsZWFyTW9kZWwoKSB7XG4gICAgICAgIGlmICghdGhpcy5jbGVhcmFibGUpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLml0ZW1zTGlzdC5jbGVhclNlbGVjdGVkKCk7XG4gICAgICAgIHRoaXMuX3VwZGF0ZU5nTW9kZWwoKTtcbiAgICB9XG5cbiAgICB3cml0ZVZhbHVlKHZhbHVlOiBhbnkgfCBhbnlbXSk6IHZvaWQge1xuICAgICAgICB0aGlzLml0ZW1zTGlzdC5jbGVhclNlbGVjdGVkKCk7XG4gICAgICAgIHRoaXMuX2hhbmRsZVdyaXRlVmFsdWUodmFsdWUpO1xuICAgICAgICB0aGlzLl9jZC5tYXJrRm9yQ2hlY2soKTtcbiAgICB9XG5cbiAgICByZWdpc3Rlck9uQ2hhbmdlKGZuOiBhbnkpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5fb25DaGFuZ2UgPSBmbjtcbiAgICB9XG5cbiAgICByZWdpc3Rlck9uVG91Y2hlZChmbjogYW55KTogdm9pZCB7XG4gICAgICAgIHRoaXMuX29uVG91Y2hlZCA9IGZuO1xuICAgIH1cblxuICAgIHNldERpc2FibGVkU3RhdGUoc3RhdGU6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICAgICAgdGhpcy5fZGlzYWJsZWQgPSBzdGF0ZTtcbiAgICAgICAgdGhpcy5fY2QubWFya0ZvckNoZWNrKCk7XG4gICAgfVxuXG4gICAgdG9nZ2xlKCkge1xuICAgICAgICBpZiAoIXRoaXMuaXNPcGVuKSB7XG4gICAgICAgICAgICB0aGlzLm9wZW4oKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuY2xvc2UoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG9wZW4oKSB7XG4gICAgICAgIGlmICh0aGlzLmRpc2FibGVkIHx8IHRoaXMuaXNPcGVuIHx8IHRoaXMuX21hbnVhbE9wZW4pIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghdGhpcy5faXNUeXBlYWhlYWQgJiYgIXRoaXMuYWRkVGFnICYmIHRoaXMuaXRlbXNMaXN0Lm5vSXRlbXNUb1NlbGVjdCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuaXNPcGVuID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5pdGVtc0xpc3QubWFya1NlbGVjdGVkT3JEZWZhdWx0KHRoaXMubWFya0ZpcnN0KTtcbiAgICAgICAgdGhpcy5vcGVuRXZlbnQuZW1pdCgpO1xuICAgICAgICBpZiAoIXRoaXMuc2VhcmNoVGVybSkge1xuICAgICAgICAgICAgdGhpcy5mb2N1cygpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZGV0ZWN0Q2hhbmdlcygpO1xuICAgIH1cblxuICAgIGNsb3NlKCkge1xuICAgICAgICBpZiAoIXRoaXMuaXNPcGVuIHx8IHRoaXMuX21hbnVhbE9wZW4pIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmlzT3BlbiA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9pc0NvbXBvc2luZyA9IGZhbHNlO1xuICAgICAgICBpZiAoIXRoaXMuX2VkaXRhYmxlU2VhcmNoVGVybSkge1xuICAgICAgICAgICAgdGhpcy5fY2xlYXJTZWFyY2goKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuaXRlbXNMaXN0LnJlc2V0RmlsdGVyZWRJdGVtcygpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuaXRlbXNMaXN0LnVubWFya0l0ZW0oKTtcbiAgICAgICAgdGhpcy5fb25Ub3VjaGVkKCk7XG4gICAgICAgIHRoaXMuY2xvc2VFdmVudC5lbWl0KCk7XG4gICAgICAgIHRoaXMuX2NkLm1hcmtGb3JDaGVjaygpO1xuICAgIH1cblxuICAgIHRvZ2dsZUl0ZW0oaXRlbTogTmdPcHRpb24pIHtcbiAgICAgICAgaWYgKCFpdGVtIHx8IGl0ZW0uZGlzYWJsZWQgfHwgdGhpcy5kaXNhYmxlZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuZGVzZWxlY3RPbkNsaWNrICYmIGl0ZW0uc2VsZWN0ZWQpIHtcbiAgICAgICAgICAgIHRoaXMudW5zZWxlY3QoaXRlbSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnNlbGVjdChpdGVtKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLl9lZGl0YWJsZVNlYXJjaFRlcm0pIHtcbiAgICAgICAgICAgIHRoaXMuX3NldFNlYXJjaFRlcm1Gcm9tSXRlbXMoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX29uU2VsZWN0aW9uQ2hhbmdlZCgpO1xuICAgIH1cblxuICAgIHNlbGVjdChpdGVtOiBOZ09wdGlvbikge1xuICAgICAgICBpZiAoIWl0ZW0uc2VsZWN0ZWQpIHtcbiAgICAgICAgICAgIHRoaXMuaXRlbXNMaXN0LnNlbGVjdChpdGVtKTtcbiAgICAgICAgICAgIGlmICh0aGlzLmNsZWFyU2VhcmNoT25BZGQgJiYgIXRoaXMuX2VkaXRhYmxlU2VhcmNoVGVybSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2NsZWFyU2VhcmNoKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuX3VwZGF0ZU5nTW9kZWwoKTtcbiAgICAgICAgICAgIGlmICh0aGlzLm11bHRpcGxlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5hZGRFdmVudC5lbWl0KGl0ZW0udmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuY2xvc2VPblNlbGVjdCB8fCB0aGlzLml0ZW1zTGlzdC5ub0l0ZW1zVG9TZWxlY3QpIHtcbiAgICAgICAgICAgIHRoaXMuY2xvc2UoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZvY3VzKCkge1xuICAgICAgICB0aGlzLnNlYXJjaElucHV0Lm5hdGl2ZUVsZW1lbnQuZm9jdXMoKTtcbiAgICB9XG5cbiAgICBibHVyKCkge1xuICAgICAgICB0aGlzLnNlYXJjaElucHV0Lm5hdGl2ZUVsZW1lbnQuYmx1cigpO1xuICAgIH1cblxuICAgIHVuc2VsZWN0KGl0ZW06IE5nT3B0aW9uKSB7XG4gICAgICAgIGlmICghaXRlbSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5pdGVtc0xpc3QudW5zZWxlY3QoaXRlbSk7XG4gICAgICAgIHRoaXMuZm9jdXMoKTtcbiAgICAgICAgdGhpcy5fdXBkYXRlTmdNb2RlbCgpO1xuICAgICAgICB0aGlzLnJlbW92ZUV2ZW50LmVtaXQoaXRlbS52YWx1ZSk7XG4gICAgfVxuXG4gICAgc2VsZWN0VGFnKCkge1xuICAgICAgICBsZXQgdGFnO1xuICAgICAgICBpZiAoaXNGdW5jdGlvbih0aGlzLmFkZFRhZykpIHtcbiAgICAgICAgICAgIHRhZyA9ICg8QWRkVGFnRm4+dGhpcy5hZGRUYWcpKHRoaXMuc2VhcmNoVGVybSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0YWcgPSB0aGlzLl9wcmltaXRpdmUgPyB0aGlzLnNlYXJjaFRlcm0gOiB7IFt0aGlzLmJpbmRMYWJlbF06IHRoaXMuc2VhcmNoVGVybSB9O1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgaGFuZGxlVGFnID0gKGl0ZW0pID0+IHRoaXMuX2lzVHlwZWFoZWFkIHx8ICF0aGlzLmlzT3BlbiA/IHRoaXMuaXRlbXNMaXN0Lm1hcEl0ZW0oaXRlbSwgbnVsbCkgOiB0aGlzLml0ZW1zTGlzdC5hZGRJdGVtKGl0ZW0pO1xuICAgICAgICBpZiAoaXNQcm9taXNlKHRhZykpIHtcbiAgICAgICAgICAgIHRhZy50aGVuKGl0ZW0gPT4gdGhpcy5zZWxlY3QoaGFuZGxlVGFnKGl0ZW0pKSkuY2F0Y2goKCkgPT4geyB9KTtcbiAgICAgICAgfSBlbHNlIGlmICh0YWcpIHtcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0KGhhbmRsZVRhZyh0YWcpKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNob3dDbGVhcigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xlYXJhYmxlICYmICh0aGlzLmhhc1ZhbHVlIHx8IHRoaXMuc2VhcmNoVGVybSkgJiYgIXRoaXMuZGlzYWJsZWQ7XG4gICAgfVxuXG4gICAgZm9jdXNPbkNsZWFyKCkge1xuICAgICAgICB0aGlzLmJsdXIoKTtcbiAgICAgICAgaWYodGhpcy5jbGVhckJ1dHRvbikge1xuICAgICAgICAgICAgdGhpcy5jbGVhckJ1dHRvbi5uYXRpdmVFbGVtZW50LmZvY3VzKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB0cmFja0J5T3B0aW9uID0gKF86IG51bWJlciwgaXRlbTogTmdPcHRpb24pID0+IHtcbiAgICAgICAgaWYgKHRoaXMudHJhY2tCeUZuKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy50cmFja0J5Rm4oaXRlbS52YWx1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gaXRlbTtcbiAgICB9O1xuXG4gICAgZ2V0IHNob3dBZGRUYWcoKSB7XG4gICAgICAgIGlmICghdGhpcy5fdmFsaWRUZXJtKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCB0ZXJtID0gdGhpcy5zZWFyY2hUZXJtLnRvTG93ZXJDYXNlKCkudHJpbSgpO1xuICAgICAgICByZXR1cm4gdGhpcy5hZGRUYWcgJiZcbiAgICAgICAgICAgICghdGhpcy5pdGVtc0xpc3QuZmlsdGVyZWRJdGVtcy5zb21lKHggPT4geC5sYWJlbC50b0xvd2VyQ2FzZSgpID09PSB0ZXJtKSAmJlxuICAgICAgICAgICAgICAgICghdGhpcy5oaWRlU2VsZWN0ZWQgJiYgdGhpcy5pc09wZW4gfHwgIXRoaXMuc2VsZWN0ZWRJdGVtcy5zb21lKHggPT4geC5sYWJlbC50b0xvd2VyQ2FzZSgpID09PSB0ZXJtKSkpICYmXG4gICAgICAgICAgICAhdGhpcy5sb2FkaW5nO1xuICAgIH1cblxuICAgIHNob3dOb0l0ZW1zRm91bmQoKSB7XG4gICAgICAgIGNvbnN0IGVtcHR5ID0gdGhpcy5pdGVtc0xpc3QuZmlsdGVyZWRJdGVtcy5sZW5ndGggPT09IDA7XG4gICAgICAgIHJldHVybiAoKGVtcHR5ICYmICF0aGlzLl9pc1R5cGVhaGVhZCAmJiAhdGhpcy5sb2FkaW5nKSB8fFxuICAgICAgICAgICAgKGVtcHR5ICYmIHRoaXMuX2lzVHlwZWFoZWFkICYmIHRoaXMuX3ZhbGlkVGVybSAmJiAhdGhpcy5sb2FkaW5nKSkgJiZcbiAgICAgICAgICAgICF0aGlzLnNob3dBZGRUYWc7XG4gICAgfVxuXG4gICAgc2hvd1R5cGVUb1NlYXJjaCgpIHtcbiAgICAgICAgY29uc3QgZW1wdHkgPSB0aGlzLml0ZW1zTGlzdC5maWx0ZXJlZEl0ZW1zLmxlbmd0aCA9PT0gMDtcbiAgICAgICAgcmV0dXJuIGVtcHR5ICYmIHRoaXMuX2lzVHlwZWFoZWFkICYmICF0aGlzLl92YWxpZFRlcm0gJiYgIXRoaXMubG9hZGluZztcbiAgICB9XG5cbiAgICBvbkNvbXBvc2l0aW9uU3RhcnQoKSB7XG4gICAgICAgIHRoaXMuX2lzQ29tcG9zaW5nID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBvbkNvbXBvc2l0aW9uRW5kKHRlcm06IHN0cmluZykge1xuICAgICAgICB0aGlzLl9pc0NvbXBvc2luZyA9IGZhbHNlO1xuICAgICAgICBpZiAodGhpcy5zZWFyY2hXaGlsZUNvbXBvc2luZykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5maWx0ZXIodGVybSk7XG4gICAgfVxuXG4gICAgZmlsdGVyKHRlcm06IHN0cmluZykge1xuICAgICAgICBpZiAodGhpcy5faXNDb21wb3NpbmcgJiYgIXRoaXMuc2VhcmNoV2hpbGVDb21wb3NpbmcpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc2VhcmNoVGVybSA9IHRlcm07XG4gICAgICAgIGlmICh0aGlzLl9pc1R5cGVhaGVhZCAmJiAodGhpcy5fdmFsaWRUZXJtIHx8IHRoaXMubWluVGVybUxlbmd0aCA9PT0gMCkpIHtcbiAgICAgICAgICAgIHRoaXMudHlwZWFoZWFkLm5leHQodGVybSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXRoaXMuX2lzVHlwZWFoZWFkKSB7XG4gICAgICAgICAgICB0aGlzLml0ZW1zTGlzdC5maWx0ZXIodGhpcy5zZWFyY2hUZXJtKTtcbiAgICAgICAgICAgIGlmICh0aGlzLmlzT3Blbikge1xuICAgICAgICAgICAgICAgIHRoaXMuaXRlbXNMaXN0Lm1hcmtTZWxlY3RlZE9yRGVmYXVsdCh0aGlzLm1hcmtGaXJzdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnNlYXJjaEV2ZW50LmVtaXQoeyB0ZXJtLCBpdGVtczogdGhpcy5pdGVtc0xpc3QuZmlsdGVyZWRJdGVtcy5tYXAoeCA9PiB4LnZhbHVlKSB9KTtcbiAgICAgICAgdGhpcy5vcGVuKCk7XG4gICAgfVxuXG4gICAgb25JbnB1dEZvY3VzKCRldmVudCkge1xuICAgICAgICBpZiAodGhpcy5mb2N1c2VkKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5fZWRpdGFibGVTZWFyY2hUZXJtKSB7XG4gICAgICAgICAgICB0aGlzLl9zZXRTZWFyY2hUZXJtRnJvbUl0ZW1zKCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnbmctc2VsZWN0LWZvY3VzZWQnKTtcbiAgICAgICAgdGhpcy5mb2N1c0V2ZW50LmVtaXQoJGV2ZW50KTtcbiAgICAgICAgdGhpcy5mb2N1c2VkID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBvbklucHV0Qmx1cigkZXZlbnQpIHtcbiAgICAgICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ25nLXNlbGVjdC1mb2N1c2VkJyk7XG4gICAgICAgIHRoaXMuYmx1ckV2ZW50LmVtaXQoJGV2ZW50KTtcbiAgICAgICAgaWYgKCF0aGlzLmlzT3BlbiAmJiAhdGhpcy5kaXNhYmxlZCkge1xuICAgICAgICAgICAgdGhpcy5fb25Ub3VjaGVkKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuX2VkaXRhYmxlU2VhcmNoVGVybSkge1xuICAgICAgICAgICAgdGhpcy5fc2V0U2VhcmNoVGVybUZyb21JdGVtcygpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZm9jdXNlZCA9IGZhbHNlO1xuICAgIH1cblxuICAgIG9uSXRlbUhvdmVyKGl0ZW06IE5nT3B0aW9uKSB7XG4gICAgICAgIGlmIChpdGVtLmRpc2FibGVkKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5pdGVtc0xpc3QubWFya0l0ZW0oaXRlbSk7XG4gICAgfVxuXG4gICAgZGV0ZWN0Q2hhbmdlcygpIHtcbiAgICAgICAgaWYgKCEoPGFueT50aGlzLl9jZCkuZGVzdHJveWVkKSB7XG4gICAgICAgICAgICB0aGlzLl9jZC5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIF9zZXRTZWFyY2hUZXJtRnJvbUl0ZW1zKCkge1xuICAgICAgICBjb25zdCBzZWxlY3RlZCA9IHRoaXMuc2VsZWN0ZWRJdGVtcyAmJiB0aGlzLnNlbGVjdGVkSXRlbXNbMF07XG4gICAgICAgIHRoaXMuc2VhcmNoVGVybSA9IChzZWxlY3RlZCAmJiBzZWxlY3RlZC5sYWJlbCkgfHwgbnVsbDtcbiAgICB9XG5cbiAgICBwcml2YXRlIF9zZXRJdGVtcyhpdGVtczogYW55W10pIHtcbiAgICAgICAgY29uc3QgZmlyc3RJdGVtID0gaXRlbXNbMF07XG4gICAgICAgIHRoaXMuYmluZExhYmVsID0gdGhpcy5iaW5kTGFiZWwgfHwgdGhpcy5fZGVmYXVsdExhYmVsO1xuICAgICAgICB0aGlzLl9wcmltaXRpdmUgPSBpc0RlZmluZWQoZmlyc3RJdGVtKSA/ICFpc09iamVjdChmaXJzdEl0ZW0pIDogdGhpcy5fcHJpbWl0aXZlIHx8IHRoaXMuYmluZExhYmVsID09PSB0aGlzLl9kZWZhdWx0TGFiZWw7XG4gICAgICAgIHRoaXMuaXRlbXNMaXN0LnNldEl0ZW1zKGl0ZW1zKTtcbiAgICAgICAgaWYgKGl0ZW1zLmxlbmd0aCA+IDAgJiYgdGhpcy5oYXNWYWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5pdGVtc0xpc3QubWFwU2VsZWN0ZWRJdGVtcygpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmlzT3BlbiAmJiBpc0RlZmluZWQodGhpcy5zZWFyY2hUZXJtKSAmJiAhdGhpcy5faXNUeXBlYWhlYWQpIHtcbiAgICAgICAgICAgIHRoaXMuaXRlbXNMaXN0LmZpbHRlcih0aGlzLnNlYXJjaFRlcm0pO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLl9pc1R5cGVhaGVhZCB8fCB0aGlzLmlzT3Blbikge1xuICAgICAgICAgICAgdGhpcy5pdGVtc0xpc3QubWFya1NlbGVjdGVkT3JEZWZhdWx0KHRoaXMubWFya0ZpcnN0KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgX3NldEl0ZW1zRnJvbU5nT3B0aW9ucygpIHtcbiAgICAgICAgY29uc3QgbWFwTmdPcHRpb25zID0gKG9wdGlvbnM6IFF1ZXJ5TGlzdDxOZ09wdGlvbkNvbXBvbmVudD4pID0+IHtcbiAgICAgICAgICAgIHRoaXMuaXRlbXMgPSBvcHRpb25zLm1hcChvcHRpb24gPT4gKHtcbiAgICAgICAgICAgICAgICAkbmdPcHRpb25WYWx1ZTogb3B0aW9uLnZhbHVlLFxuICAgICAgICAgICAgICAgICRuZ09wdGlvbkxhYmVsOiBvcHRpb24uZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmlubmVySFRNTCxcbiAgICAgICAgICAgICAgICBkaXNhYmxlZDogb3B0aW9uLmRpc2FibGVkXG4gICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICB0aGlzLml0ZW1zTGlzdC5zZXRJdGVtcyh0aGlzLml0ZW1zKTtcbiAgICAgICAgICAgIGlmICh0aGlzLmhhc1ZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5pdGVtc0xpc3QubWFwU2VsZWN0ZWRJdGVtcygpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3QgaGFuZGxlT3B0aW9uQ2hhbmdlID0gKCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgY2hhbmdlZE9yRGVzdHJveWVkID0gbWVyZ2UodGhpcy5uZ09wdGlvbnMuY2hhbmdlcywgdGhpcy5fZGVzdHJveSQpO1xuICAgICAgICAgICAgbWVyZ2UoLi4udGhpcy5uZ09wdGlvbnMubWFwKG9wdGlvbiA9PiBvcHRpb24uc3RhdGVDaGFuZ2UkKSlcbiAgICAgICAgICAgICAgICAucGlwZSh0YWtlVW50aWwoY2hhbmdlZE9yRGVzdHJveWVkKSlcbiAgICAgICAgICAgICAgICAuc3Vic2NyaWJlKG9wdGlvbiA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGl0ZW0gPSB0aGlzLml0ZW1zTGlzdC5maW5kSXRlbShvcHRpb24udmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICBpdGVtLmRpc2FibGVkID0gb3B0aW9uLmRpc2FibGVkO1xuICAgICAgICAgICAgICAgICAgICBpdGVtLmxhYmVsID0gb3B0aW9uLmxhYmVsIHx8IGl0ZW0ubGFiZWw7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2NkLmRldGVjdENoYW5nZXMoKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLm5nT3B0aW9ucy5jaGFuZ2VzXG4gICAgICAgICAgICAucGlwZShzdGFydFdpdGgodGhpcy5uZ09wdGlvbnMpLCB0YWtlVW50aWwodGhpcy5fZGVzdHJveSQpKVxuICAgICAgICAgICAgLnN1YnNjcmliZShvcHRpb25zID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmJpbmRMYWJlbCA9IHRoaXMuX2RlZmF1bHRMYWJlbDtcbiAgICAgICAgICAgICAgICBtYXBOZ09wdGlvbnMob3B0aW9ucyk7XG4gICAgICAgICAgICAgICAgaGFuZGxlT3B0aW9uQ2hhbmdlKCk7XG4gICAgICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIF9pc1ZhbGlkV3JpdGVWYWx1ZSh2YWx1ZTogYW55KTogYm9vbGVhbiB7XG4gICAgICAgIGlmICghaXNEZWZpbmVkKHZhbHVlKSB8fCAodGhpcy5tdWx0aXBsZSAmJiB2YWx1ZSA9PT0gJycpIHx8IEFycmF5LmlzQXJyYXkodmFsdWUpICYmIHZhbHVlLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgdmFsaWRhdGVCaW5kaW5nID0gKGl0ZW06IGFueSk6IGJvb2xlYW4gPT4ge1xuICAgICAgICAgICAgaWYgKCFpc0RlZmluZWQodGhpcy5jb21wYXJlV2l0aCkgJiYgaXNPYmplY3QoaXRlbSkgJiYgdGhpcy5iaW5kVmFsdWUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9jb25zb2xlLndhcm4oXG4gICAgICAgICAgICAgICAgICAgIGBTZXR0aW5nIG9iamVjdCgke0pTT04uc3RyaW5naWZ5KGl0ZW0pfSkgYXMgeW91ciBtb2RlbCB3aXRoIGJpbmRWYWx1ZSBpcyBub3QgYWxsb3dlZCB1bmxlc3MgW2NvbXBhcmVXaXRoXSBpcyB1c2VkLmBcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9O1xuXG4gICAgICAgIGlmICh0aGlzLm11bHRpcGxlKSB7XG4gICAgICAgICAgICBpZiAoIUFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fY29uc29sZS53YXJuKCdNdWx0aXBsZSBzZWxlY3QgbmdNb2RlbCBzaG91bGQgYmUgYXJyYXkuJyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHZhbHVlLmV2ZXJ5KGl0ZW0gPT4gdmFsaWRhdGVCaW5kaW5nKGl0ZW0pKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB2YWxpZGF0ZUJpbmRpbmcodmFsdWUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfaGFuZGxlV3JpdGVWYWx1ZShuZ01vZGVsOiBhbnkgfCBhbnlbXSkge1xuICAgICAgICBpZiAoIXRoaXMuX2lzVmFsaWRXcml0ZVZhbHVlKG5nTW9kZWwpKSB7XG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHNlbGVjdCA9ICh2YWw6IGFueSkgPT4ge1xuICAgICAgICAgICAgbGV0IGl0ZW0gPSB0aGlzLml0ZW1zTGlzdC5maW5kSXRlbSh2YWwpO1xuICAgICAgICAgICAgaWYgKGl0ZW0pIHtcbiAgICAgICAgICAgICAgICB0aGlzLml0ZW1zTGlzdC5zZWxlY3QoaXRlbSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnN0IGlzVmFsT2JqZWN0ID0gaXNPYmplY3QodmFsKTtcbiAgICAgICAgICAgICAgICBjb25zdCBpc1ByaW1pdGl2ZSA9ICFpc1ZhbE9iamVjdCAmJiAhdGhpcy5iaW5kVmFsdWU7XG4gICAgICAgICAgICAgICAgaWYgKChpc1ZhbE9iamVjdCB8fCBpc1ByaW1pdGl2ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pdGVtc0xpc3Quc2VsZWN0KHRoaXMuaXRlbXNMaXN0Lm1hcEl0ZW0odmFsLCBudWxsKSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLmJpbmRWYWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICBpdGVtID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgW3RoaXMuYmluZExhYmVsXTogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIFt0aGlzLmJpbmRWYWx1ZV06IHZhbFxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICB0aGlzLml0ZW1zTGlzdC5zZWxlY3QodGhpcy5pdGVtc0xpc3QubWFwSXRlbShpdGVtLCBudWxsKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIGlmICh0aGlzLm11bHRpcGxlKSB7XG4gICAgICAgICAgICAoPGFueVtdPm5nTW9kZWwpLmZvckVhY2goaXRlbSA9PiBzZWxlY3QoaXRlbSkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc2VsZWN0KG5nTW9kZWwpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfaGFuZGxlS2V5UHJlc3NlcygpIHtcbiAgICAgICAgaWYgKHRoaXMuc2VhcmNoYWJsZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fa2V5UHJlc3MkXG4gICAgICAgICAgICAucGlwZSh0YWtlVW50aWwodGhpcy5fZGVzdHJveSQpLFxuICAgICAgICAgICAgICAgIHRhcChsZXR0ZXIgPT4gdGhpcy5fcHJlc3NlZEtleXMucHVzaChsZXR0ZXIpKSxcbiAgICAgICAgICAgICAgICBkZWJvdW5jZVRpbWUoMjAwKSxcbiAgICAgICAgICAgICAgICBmaWx0ZXIoKCkgPT4gdGhpcy5fcHJlc3NlZEtleXMubGVuZ3RoID4gMCksXG4gICAgICAgICAgICAgICAgbWFwKCgpID0+IHRoaXMuX3ByZXNzZWRLZXlzLmpvaW4oJycpKSlcbiAgICAgICAgICAgIC5zdWJzY3JpYmUodGVybSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgaXRlbSA9IHRoaXMuaXRlbXNMaXN0LmZpbmRCeUxhYmVsKHRlcm0pO1xuICAgICAgICAgICAgICAgIGlmIChpdGVtKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzT3Blbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pdGVtc0xpc3QubWFya0l0ZW0oaXRlbSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zY3JvbGxUb01hcmtlZCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fY2QubWFya0ZvckNoZWNrKCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdChpdGVtKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLl9wcmVzc2VkS2V5cyA9IFtdO1xuICAgICAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfc2V0SW5wdXRBdHRyaWJ1dGVzKCkge1xuICAgICAgICBjb25zdCBpbnB1dCA9IHRoaXMuc2VhcmNoSW5wdXQubmF0aXZlRWxlbWVudDtcbiAgICAgICAgY29uc3QgYXR0cmlidXRlcyA9IHtcbiAgICAgICAgICAgIHR5cGU6ICd0ZXh0JyxcbiAgICAgICAgICAgIGF1dG9jb3JyZWN0OiAnb2ZmJyxcbiAgICAgICAgICAgIGF1dG9jYXBpdGFsaXplOiAnb2ZmJyxcbiAgICAgICAgICAgIGF1dG9jb21wbGV0ZTogdGhpcy5sYWJlbEZvcklkID8gJ29mZicgOiB0aGlzLmRyb3Bkb3duSWQsXG4gICAgICAgICAgICAuLi50aGlzLmlucHV0QXR0cnNcbiAgICAgICAgfTtcblxuICAgICAgICBmb3IgKGNvbnN0IGtleSBvZiBPYmplY3Qua2V5cyhhdHRyaWJ1dGVzKSkge1xuICAgICAgICAgICAgaW5wdXQuc2V0QXR0cmlidXRlKGtleSwgYXR0cmlidXRlc1trZXldKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgX3VwZGF0ZU5nTW9kZWwoKSB7XG4gICAgICAgIGNvbnN0IG1vZGVsID0gW107XG4gICAgICAgIGZvciAoY29uc3QgaXRlbSBvZiB0aGlzLnNlbGVjdGVkSXRlbXMpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmJpbmRWYWx1ZSkge1xuICAgICAgICAgICAgICAgIGxldCB2YWx1ZSA9IG51bGw7XG4gICAgICAgICAgICAgICAgaWYgKGl0ZW0uY2hpbGRyZW4pIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZ3JvdXBLZXkgPSB0aGlzLmdyb3VwVmFsdWUgPyB0aGlzLmJpbmRWYWx1ZSA6IDxzdHJpbmc+dGhpcy5ncm91cEJ5O1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IGl0ZW0udmFsdWVbZ3JvdXBLZXkgfHwgPHN0cmluZz50aGlzLmdyb3VwQnldO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gdGhpcy5pdGVtc0xpc3QucmVzb2x2ZU5lc3RlZChpdGVtLnZhbHVlLCB0aGlzLmJpbmRWYWx1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIG1vZGVsLnB1c2godmFsdWUpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBtb2RlbC5wdXNoKGl0ZW0udmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qgc2VsZWN0ZWQgPSB0aGlzLnNlbGVjdGVkSXRlbXMubWFwKHggPT4geC52YWx1ZSk7XG4gICAgICAgIGlmICh0aGlzLm11bHRpcGxlKSB7XG4gICAgICAgICAgICB0aGlzLl9vbkNoYW5nZShtb2RlbCk7XG4gICAgICAgICAgICB0aGlzLmNoYW5nZUV2ZW50LmVtaXQoc2VsZWN0ZWQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fb25DaGFuZ2UoaXNEZWZpbmVkKG1vZGVsWzBdKSA/IG1vZGVsWzBdIDogbnVsbCk7XG4gICAgICAgICAgICB0aGlzLmNoYW5nZUV2ZW50LmVtaXQoc2VsZWN0ZWRbMF0pO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fY2QubWFya0ZvckNoZWNrKCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfY2xlYXJTZWFyY2goKSB7XG4gICAgICAgIGlmICghdGhpcy5zZWFyY2hUZXJtKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9jaGFuZ2VTZWFyY2gobnVsbCk7XG4gICAgICAgIHRoaXMuaXRlbXNMaXN0LnJlc2V0RmlsdGVyZWRJdGVtcygpO1xuICAgIH1cblxuICAgIHByaXZhdGUgX2NoYW5nZVNlYXJjaChzZWFyY2hUZXJtOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5zZWFyY2hUZXJtID0gc2VhcmNoVGVybTtcbiAgICAgICAgaWYgKHRoaXMuX2lzVHlwZWFoZWFkKSB7XG4gICAgICAgICAgICB0aGlzLnR5cGVhaGVhZC5uZXh0KHNlYXJjaFRlcm0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfc2Nyb2xsVG9NYXJrZWQoKSB7XG4gICAgICAgIGlmICghdGhpcy5pc09wZW4gfHwgIXRoaXMuZHJvcGRvd25QYW5lbCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZHJvcGRvd25QYW5lbC5zY3JvbGxUbyh0aGlzLml0ZW1zTGlzdC5tYXJrZWRJdGVtKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIF9zY3JvbGxUb1RhZygpIHtcbiAgICAgICAgaWYgKCF0aGlzLmlzT3BlbiB8fCAhdGhpcy5kcm9wZG93blBhbmVsKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5kcm9wZG93blBhbmVsLnNjcm9sbFRvVGFnKCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfb25TZWxlY3Rpb25DaGFuZ2VkKCkge1xuICAgICAgICBpZiAodGhpcy5pc09wZW4gJiYgdGhpcy5kZXNlbGVjdE9uQ2xpY2sgJiYgdGhpcy5hcHBlbmRUbykge1xuICAgICAgICAgICAgLy8gTWFrZSBzdXJlIGl0ZW1zIGFyZSByZW5kZXJlZC5cbiAgICAgICAgICAgIHRoaXMuX2NkLmRldGVjdENoYW5nZXMoKTtcbiAgICAgICAgICAgIHRoaXMuZHJvcGRvd25QYW5lbC5hZGp1c3RQb3NpdGlvbigpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfaGFuZGxlVGFiKCRldmVudDogS2V5Ym9hcmRFdmVudCkge1xuICAgICAgICBpZiAodGhpcy5pc09wZW4gPT09IGZhbHNlKSB7XG4gICAgICAgICAgICBpZih0aGlzLnNob3dDbGVhcigpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5mb2N1c09uQ2xlYXIoKTtcbiAgICAgICAgICAgICAgICAkZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZighdGhpcy5hZGRUYWcpIHtcbiAgICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLnNlbGVjdE9uVGFiKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5pdGVtc0xpc3QubWFya2VkSXRlbSkge1xuICAgICAgICAgICAgICAgIHRoaXMudG9nZ2xlSXRlbSh0aGlzLml0ZW1zTGlzdC5tYXJrZWRJdGVtKTtcbiAgICAgICAgICAgICAgICAkZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5zaG93QWRkVGFnKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RUYWcoKTtcbiAgICAgICAgICAgICAgICAkZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jbG9zZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5jbG9zZSgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfaGFuZGxlRW50ZXIoJGV2ZW50OiBLZXlib2FyZEV2ZW50KSB7XG4gICAgICAgIGlmICh0aGlzLmlzT3BlbiB8fCB0aGlzLl9tYW51YWxPcGVuKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5pdGVtc0xpc3QubWFya2VkSXRlbSkge1xuICAgICAgICAgICAgICAgIHRoaXMudG9nZ2xlSXRlbSh0aGlzLml0ZW1zTGlzdC5tYXJrZWRJdGVtKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5zaG93QWRkVGFnKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RUYWcoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLm9wZW5PbkVudGVyKSB7XG4gICAgICAgICAgICB0aGlzLm9wZW4oKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgICRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH1cblxuICAgIHByaXZhdGUgX2hhbmRsZVNwYWNlKCRldmVudDogS2V5Ym9hcmRFdmVudCkge1xuICAgICAgICBpZiAodGhpcy5pc09wZW4gfHwgdGhpcy5fbWFudWFsT3Blbikge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMub3BlbigpO1xuICAgICAgICAkZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIF9oYW5kbGVBcnJvd0Rvd24oJGV2ZW50OiBLZXlib2FyZEV2ZW50KSB7XG4gICAgICAgIGlmICh0aGlzLl9uZXh0SXRlbUlzVGFnKCsxKSkge1xuICAgICAgICAgICAgdGhpcy5pdGVtc0xpc3QudW5tYXJrSXRlbSgpO1xuICAgICAgICAgICAgdGhpcy5fc2Nyb2xsVG9UYWcoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuaXRlbXNMaXN0Lm1hcmtOZXh0SXRlbSgpO1xuICAgICAgICAgICAgdGhpcy5fc2Nyb2xsVG9NYXJrZWQoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLm9wZW4oKTtcbiAgICAgICAgJGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfaGFuZGxlQXJyb3dVcCgkZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcbiAgICAgICAgaWYgKCF0aGlzLmlzT3Blbikge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuX25leHRJdGVtSXNUYWcoLTEpKSB7XG4gICAgICAgICAgICB0aGlzLml0ZW1zTGlzdC51bm1hcmtJdGVtKCk7XG4gICAgICAgICAgICB0aGlzLl9zY3JvbGxUb1RhZygpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5pdGVtc0xpc3QubWFya1ByZXZpb3VzSXRlbSgpO1xuICAgICAgICAgICAgdGhpcy5fc2Nyb2xsVG9NYXJrZWQoKTtcbiAgICAgICAgfVxuICAgICAgICAkZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIF9uZXh0SXRlbUlzVGFnKG5leHRTdGVwOiBudW1iZXIpOiBib29sZWFuIHtcbiAgICAgICAgY29uc3QgbmV4dEluZGV4ID0gdGhpcy5pdGVtc0xpc3QubWFya2VkSW5kZXggKyBuZXh0U3RlcDtcbiAgICAgICAgcmV0dXJuIHRoaXMuYWRkVGFnICYmIHRoaXMuc2VhcmNoVGVybVxuICAgICAgICAgICAgJiYgdGhpcy5pdGVtc0xpc3QubWFya2VkSXRlbVxuICAgICAgICAgICAgJiYgKG5leHRJbmRleCA8IDAgfHwgbmV4dEluZGV4ID09PSB0aGlzLml0ZW1zTGlzdC5maWx0ZXJlZEl0ZW1zLmxlbmd0aClcbiAgICB9XG5cbiAgICBwcml2YXRlIF9oYW5kbGVCYWNrc3BhY2UoKSB7XG4gICAgICAgIGlmICh0aGlzLnNlYXJjaFRlcm0gfHwgIXRoaXMuY2xlYXJhYmxlIHx8ICF0aGlzLmNsZWFyT25CYWNrc3BhY2UgfHwgIXRoaXMuaGFzVmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLm11bHRpcGxlKSB7XG4gICAgICAgICAgICB0aGlzLnVuc2VsZWN0KHRoaXMuaXRlbXNMaXN0Lmxhc3RTZWxlY3RlZEl0ZW0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5jbGVhck1vZGVsKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGdldCBfaXNUeXBlYWhlYWQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnR5cGVhaGVhZCAmJiB0aGlzLnR5cGVhaGVhZC5vYnNlcnZlcnMubGVuZ3RoID4gMDtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldCBfdmFsaWRUZXJtKCkge1xuICAgICAgICBjb25zdCB0ZXJtID0gdGhpcy5zZWFyY2hUZXJtICYmIHRoaXMuc2VhcmNoVGVybS50cmltKCk7XG4gICAgICAgIHJldHVybiB0ZXJtICYmIHRlcm0ubGVuZ3RoID49IHRoaXMubWluVGVybUxlbmd0aDtcbiAgICB9XG5cbiAgICBwcml2YXRlIF9tZXJnZUdsb2JhbENvbmZpZyhjb25maWc6IE5nU2VsZWN0Q29uZmlnKSB7XG4gICAgICAgIHRoaXMucGxhY2Vob2xkZXIgPSB0aGlzLnBsYWNlaG9sZGVyIHx8IGNvbmZpZy5wbGFjZWhvbGRlcjtcbiAgICAgICAgdGhpcy5ub3RGb3VuZFRleHQgPSB0aGlzLm5vdEZvdW5kVGV4dCB8fCBjb25maWcubm90Rm91bmRUZXh0O1xuICAgICAgICB0aGlzLnR5cGVUb1NlYXJjaFRleHQgPSB0aGlzLnR5cGVUb1NlYXJjaFRleHQgfHwgY29uZmlnLnR5cGVUb1NlYXJjaFRleHQ7XG4gICAgICAgIHRoaXMuYWRkVGFnVGV4dCA9IHRoaXMuYWRkVGFnVGV4dCB8fCBjb25maWcuYWRkVGFnVGV4dDtcbiAgICAgICAgdGhpcy5sb2FkaW5nVGV4dCA9IHRoaXMubG9hZGluZ1RleHQgfHwgY29uZmlnLmxvYWRpbmdUZXh0O1xuICAgICAgICB0aGlzLmNsZWFyQWxsVGV4dCA9IHRoaXMuY2xlYXJBbGxUZXh0IHx8IGNvbmZpZy5jbGVhckFsbFRleHQ7XG4gICAgICAgIHRoaXMudmlydHVhbFNjcm9sbCA9IGlzRGVmaW5lZCh0aGlzLnZpcnR1YWxTY3JvbGwpXG4gICAgICAgICAgICA/IHRoaXMudmlydHVhbFNjcm9sbFxuICAgICAgICAgICAgOiBpc0RlZmluZWQoY29uZmlnLmRpc2FibGVWaXJ0dWFsU2Nyb2xsKSA/ICFjb25maWcuZGlzYWJsZVZpcnR1YWxTY3JvbGwgOiBmYWxzZTtcbiAgICAgICAgdGhpcy5vcGVuT25FbnRlciA9IGlzRGVmaW5lZCh0aGlzLm9wZW5PbkVudGVyKSA/IHRoaXMub3Blbk9uRW50ZXIgOiBjb25maWcub3Blbk9uRW50ZXI7XG4gICAgICAgIHRoaXMuYXBwZW5kVG8gPSB0aGlzLmFwcGVuZFRvIHx8IGNvbmZpZy5hcHBlbmRUbztcbiAgICAgICAgdGhpcy5iaW5kVmFsdWUgPSB0aGlzLmJpbmRWYWx1ZSB8fCBjb25maWcuYmluZFZhbHVlO1xuICAgICAgICB0aGlzLmJpbmRMYWJlbCA9IHRoaXMuYmluZExhYmVsIHx8IGNvbmZpZy5iaW5kTGFiZWw7XG4gICAgICAgIHRoaXMuYXBwZWFyYW5jZSA9IHRoaXMuYXBwZWFyYW5jZSB8fCBjb25maWcuYXBwZWFyYW5jZTtcbiAgICB9XG59XG4iLCI8ZGl2XG4gICAgKG1vdXNlZG93bik9XCJoYW5kbGVNb3VzZWRvd24oJGV2ZW50KVwiXG4gICAgW2NsYXNzLm5nLWFwcGVhcmFuY2Utb3V0bGluZV09XCJhcHBlYXJhbmNlID09PSAnb3V0bGluZSdcIlxuICAgIFtjbGFzcy5uZy1oYXMtdmFsdWVdPVwiaGFzVmFsdWVcIlxuICAgIGNsYXNzPVwibmctc2VsZWN0LWNvbnRhaW5lclwiPlxuXG4gICAgPGRpdiBjbGFzcz1cIm5nLXZhbHVlLWNvbnRhaW5lclwiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwibmctcGxhY2Vob2xkZXJcIj57e3BsYWNlaG9sZGVyfX08L2Rpdj5cblxuICAgICAgICA8bmctY29udGFpbmVyICpuZ0lmPVwiKCFtdWx0aUxhYmVsVGVtcGxhdGUgIHx8ICFtdWx0aXBsZSApICYmIHNlbGVjdGVkSXRlbXMubGVuZ3RoID4gMFwiPlxuICAgICAgICAgICAgPGRpdiBbY2xhc3MubmctdmFsdWUtZGlzYWJsZWRdPVwiaXRlbS5kaXNhYmxlZFwiIGNsYXNzPVwibmctdmFsdWVcIiAqbmdGb3I9XCJsZXQgaXRlbSBvZiBzZWxlY3RlZEl0ZW1zOyB0cmFja0J5OiB0cmFja0J5T3B0aW9uXCI+XG4gICAgICAgICAgICAgICAgPG5nLXRlbXBsYXRlICNkZWZhdWx0TGFiZWxUZW1wbGF0ZT5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJuZy12YWx1ZS1pY29uIGxlZnRcIiAoY2xpY2spPVwidW5zZWxlY3QoaXRlbSk7XCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+w5c8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwibmctdmFsdWUtbGFiZWxcIiBbbmdJdGVtTGFiZWxdPVwiaXRlbS5sYWJlbFwiIFtlc2NhcGVdPVwiZXNjYXBlSFRNTFwiPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8L25nLXRlbXBsYXRlPlxuXG4gICAgICAgICAgICAgICAgPG5nLXRlbXBsYXRlXG4gICAgICAgICAgICAgICAgICAgIFtuZ1RlbXBsYXRlT3V0bGV0XT1cImxhYmVsVGVtcGxhdGUgfHwgZGVmYXVsdExhYmVsVGVtcGxhdGVcIlxuICAgICAgICAgICAgICAgICAgICBbbmdUZW1wbGF0ZU91dGxldENvbnRleHRdPVwieyBpdGVtOiBpdGVtLnZhbHVlLCBjbGVhcjogY2xlYXJJdGVtLCBsYWJlbDogaXRlbS5sYWJlbCB9XCI+XG4gICAgICAgICAgICAgICAgPC9uZy10ZW1wbGF0ZT5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L25nLWNvbnRhaW5lcj5cblxuICAgICAgICA8bmctdGVtcGxhdGUgKm5nSWY9XCJtdWx0aXBsZSAmJiBtdWx0aUxhYmVsVGVtcGxhdGUgJiYgc2VsZWN0ZWRWYWx1ZXMubGVuZ3RoID4gMFwiXG4gICAgICAgICAgICAgICAgW25nVGVtcGxhdGVPdXRsZXRdPVwibXVsdGlMYWJlbFRlbXBsYXRlXCJcbiAgICAgICAgICAgICAgICBbbmdUZW1wbGF0ZU91dGxldENvbnRleHRdPVwieyBpdGVtczogc2VsZWN0ZWRWYWx1ZXMsIGNsZWFyOiBjbGVhckl0ZW0gfVwiPlxuICAgICAgICA8L25nLXRlbXBsYXRlPlxuXG4gICAgICAgIDxkaXYgY2xhc3M9XCJuZy1pbnB1dFwiXG4gICAgICAgICAgICByb2xlPVwiY29tYm9ib3hcIiBcbiAgICAgICAgICAgIFthdHRyLmFyaWEtZXhwYW5kZWRdPVwiaXNPcGVuXCIgXG4gICAgICAgICAgICBbYXR0ci5hcmlhLW93bnNdPVwiaXNPcGVuID8gZHJvcGRvd25JZCA6IG51bGxcIiBcbiAgICAgICAgICAgIGFyaWEtaGFzcG9wdXA9XCJsaXN0Ym94XCI+XG5cbiAgICAgICAgICAgIDxpbnB1dCAjc2VhcmNoSW5wdXRcbiAgICAgICAgICAgICAgICAgICBbYXR0ci5pZF09XCJsYWJlbEZvcklkXCJcbiAgICAgICAgICAgICAgICAgICBbYXR0ci50YWJpbmRleF09XCJ0YWJJbmRleFwiXG4gICAgICAgICAgICAgICAgICAgW3JlYWRPbmx5XT1cIiFzZWFyY2hhYmxlIHx8IGl0ZW1zTGlzdC5tYXhJdGVtc1NlbGVjdGVkXCJcbiAgICAgICAgICAgICAgICAgICBbZGlzYWJsZWRdPVwiZGlzYWJsZWRcIlxuICAgICAgICAgICAgICAgICAgIFt2YWx1ZV09XCJzZWFyY2hUZXJtID8gc2VhcmNoVGVybSA6ICcnXCJcbiAgICAgICAgICAgICAgICAgICAoaW5wdXQpPVwiZmlsdGVyKHNlYXJjaElucHV0LnZhbHVlKVwiXG4gICAgICAgICAgICAgICAgICAgKGNvbXBvc2l0aW9uc3RhcnQpPVwib25Db21wb3NpdGlvblN0YXJ0KClcIlxuICAgICAgICAgICAgICAgICAgIChjb21wb3NpdGlvbmVuZCk9XCJvbkNvbXBvc2l0aW9uRW5kKHNlYXJjaElucHV0LnZhbHVlKVwiXG4gICAgICAgICAgICAgICAgICAgKGZvY3VzKT1cIm9uSW5wdXRGb2N1cygkZXZlbnQpXCJcbiAgICAgICAgICAgICAgICAgICAoYmx1cik9XCJvbklucHV0Qmx1cigkZXZlbnQpXCJcbiAgICAgICAgICAgICAgICAgICAoY2hhbmdlKT1cIiRldmVudC5zdG9wUHJvcGFnYXRpb24oKVwiXG4gICAgICAgICAgICAgICAgICAgW2F0dHIuYXJpYS1hY3RpdmVkZXNjZW5kYW50XT1cImlzT3BlbiA/IGl0ZW1zTGlzdD8ubWFya2VkSXRlbT8uaHRtbElkIDogbnVsbFwiXG4gICAgICAgICAgICAgICAgICAgYXJpYS1hdXRvY29tcGxldGU9XCJsaXN0XCJcbiAgICAgICAgICAgICAgICAgICBbYXR0ci5hcmlhLWNvbnRyb2xzXT1cImlzT3BlbiA/IGRyb3Bkb3duSWQgOiBudWxsXCI+XG4gICAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuXG4gICAgPG5nLWNvbnRhaW5lciAqbmdJZj1cImxvYWRpbmdcIj5cbiAgICAgICAgPG5nLXRlbXBsYXRlICNkZWZhdWx0TG9hZGluZ1NwaW5uZXJUZW1wbGF0ZT5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJuZy1zcGlubmVyLWxvYWRlclwiPjwvZGl2PlxuICAgICAgICA8L25nLXRlbXBsYXRlPlxuXG4gICAgICAgIDxuZy10ZW1wbGF0ZVxuICAgICAgICAgICAgW25nVGVtcGxhdGVPdXRsZXRdPVwibG9hZGluZ1NwaW5uZXJUZW1wbGF0ZSB8fCBkZWZhdWx0TG9hZGluZ1NwaW5uZXJUZW1wbGF0ZVwiPlxuICAgICAgICA8L25nLXRlbXBsYXRlPlxuICAgIDwvbmctY29udGFpbmVyPlxuXG4gICAgPHNwYW4gKm5nSWY9XCJzaG93Q2xlYXIoKVwiIGNsYXNzPVwibmctY2xlYXItd3JhcHBlclwiIHRhYmluZGV4PVwiMFwiIHRpdGxlPVwie3tjbGVhckFsbFRleHR9fVwiICNjbGVhckJ1dHRvbj5cbiAgICAgICAgPHNwYW4gY2xhc3M9XCJuZy1jbGVhclwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPsOXPC9zcGFuPlxuICAgIDwvc3Bhbj5cblxuICAgIDxzcGFuIGNsYXNzPVwibmctYXJyb3ctd3JhcHBlclwiPlxuICAgICAgICA8c3BhbiBjbGFzcz1cIm5nLWFycm93XCI+PC9zcGFuPlxuICAgIDwvc3Bhbj5cbjwvZGl2PlxuXG48bmctZHJvcGRvd24tcGFuZWwgKm5nSWY9XCJpc09wZW5cIlxuICAgICAgICAgICAgICAgICAgIGNsYXNzPVwibmctZHJvcGRvd24tcGFuZWxcIlxuICAgICAgICAgICAgICAgICAgIFt2aXJ0dWFsU2Nyb2xsXT1cInZpcnR1YWxTY3JvbGxcIlxuICAgICAgICAgICAgICAgICAgIFtidWZmZXJBbW91bnRdPVwiYnVmZmVyQW1vdW50XCJcbiAgICAgICAgICAgICAgICAgICBbYXBwZW5kVG9dPVwiYXBwZW5kVG9cIlxuICAgICAgICAgICAgICAgICAgIFtwb3NpdGlvbl09XCJkcm9wZG93blBvc2l0aW9uXCJcbiAgICAgICAgICAgICAgICAgICBbaGVhZGVyVGVtcGxhdGVdPVwiaGVhZGVyVGVtcGxhdGVcIlxuICAgICAgICAgICAgICAgICAgIFtmb290ZXJUZW1wbGF0ZV09XCJmb290ZXJUZW1wbGF0ZVwiXG4gICAgICAgICAgICAgICAgICAgW2ZpbHRlclZhbHVlXT1cInNlYXJjaFRlcm1cIlxuICAgICAgICAgICAgICAgICAgIFtpdGVtc109XCJpdGVtc0xpc3QuZmlsdGVyZWRJdGVtc1wiXG4gICAgICAgICAgICAgICAgICAgW21hcmtlZEl0ZW1dPVwiaXRlbXNMaXN0Lm1hcmtlZEl0ZW1cIlxuICAgICAgICAgICAgICAgICAgICh1cGRhdGUpPVwidmlld1BvcnRJdGVtcyA9ICRldmVudFwiXG4gICAgICAgICAgICAgICAgICAgKHNjcm9sbCk9XCJzY3JvbGwuZW1pdCgkZXZlbnQpXCJcbiAgICAgICAgICAgICAgICAgICAoc2Nyb2xsVG9FbmQpPVwic2Nyb2xsVG9FbmQuZW1pdCgkZXZlbnQpXCJcbiAgICAgICAgICAgICAgICAgICAob3V0c2lkZUNsaWNrKT1cImNsb3NlKClcIlxuICAgICAgICAgICAgICAgICAgIFtjbGFzcy5uZy1zZWxlY3QtbXVsdGlwbGVdPVwibXVsdGlwbGVcIlxuICAgICAgICAgICAgICAgICAgIFtuZ0NsYXNzXT1cImFwcGVuZFRvID8gY2xhc3NlcyA6IG51bGxcIlxuICAgICAgICAgICAgICAgICAgIFtpZF09XCJkcm9wZG93bklkXCJcbiAgICAgICAgICAgICAgICAgICByb2xlPVwibGlzdGJveFwiXG4gICAgICAgICAgICAgICAgICAgYXJpYS1sYWJlbD1cIk9wdGlvbnMgbGlzdFwiPlxuXG4gICAgPG5nLWNvbnRhaW5lcj5cbiAgICAgICAgPGRpdiBjbGFzcz1cIm5nLW9wdGlvblwiIFthdHRyLnJvbGVdPVwiaXRlbS5jaGlsZHJlbiA/ICdncm91cCcgOiAnb3B0aW9uJ1wiIChjbGljayk9XCJ0b2dnbGVJdGVtKGl0ZW0pXCIgKG1vdXNlb3Zlcik9XCJvbkl0ZW1Ib3ZlcihpdGVtKVwiXG4gICAgICAgICAgICAgICAgKm5nRm9yPVwibGV0IGl0ZW0gb2Ygdmlld1BvcnRJdGVtczsgdHJhY2tCeTogdHJhY2tCeU9wdGlvblwiXG4gICAgICAgICAgICAgICAgW2NsYXNzLm5nLW9wdGlvbi1kaXNhYmxlZF09XCJpdGVtLmRpc2FibGVkXCJcbiAgICAgICAgICAgICAgICBbY2xhc3Mubmctb3B0aW9uLXNlbGVjdGVkXT1cIml0ZW0uc2VsZWN0ZWRcIlxuICAgICAgICAgICAgICAgIFtjbGFzcy5uZy1vcHRncm91cF09XCJpdGVtLmNoaWxkcmVuXCJcbiAgICAgICAgICAgICAgICBbY2xhc3Mubmctb3B0aW9uXT1cIiFpdGVtLmNoaWxkcmVuXCJcbiAgICAgICAgICAgICAgICBbY2xhc3Mubmctb3B0aW9uLWNoaWxkXT1cIiEhaXRlbS5wYXJlbnRcIlxuICAgICAgICAgICAgICAgIFtjbGFzcy5uZy1vcHRpb24tbWFya2VkXT1cIml0ZW0gPT09IGl0ZW1zTGlzdC5tYXJrZWRJdGVtXCJcbiAgICAgICAgICAgICAgICBbYXR0ci5hcmlhLXNlbGVjdGVkXT1cIml0ZW0uc2VsZWN0ZWRcIlxuICAgICAgICAgICAgICAgIFthdHRyLmlkXT1cIml0ZW0/Lmh0bWxJZFwiPlxuXG4gICAgICAgICAgICA8bmctdGVtcGxhdGUgI2RlZmF1bHRPcHRpb25UZW1wbGF0ZT5cbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cIm5nLW9wdGlvbi1sYWJlbFwiIFtuZ0l0ZW1MYWJlbF09XCJpdGVtLmxhYmVsXCIgW2VzY2FwZV09XCJlc2NhcGVIVE1MXCI+PC9zcGFuPlxuICAgICAgICAgICAgPC9uZy10ZW1wbGF0ZT5cblxuICAgICAgICAgICAgPG5nLXRlbXBsYXRlXG4gICAgICAgICAgICAgICAgW25nVGVtcGxhdGVPdXRsZXRdPVwiaXRlbS5jaGlsZHJlbiA/IChvcHRncm91cFRlbXBsYXRlIHx8IGRlZmF1bHRPcHRpb25UZW1wbGF0ZSkgOiAob3B0aW9uVGVtcGxhdGUgfHwgZGVmYXVsdE9wdGlvblRlbXBsYXRlKVwiXG4gICAgICAgICAgICAgICAgW25nVGVtcGxhdGVPdXRsZXRDb250ZXh0XT1cInsgaXRlbTogaXRlbS52YWx1ZSwgaXRlbSQ6aXRlbSwgaW5kZXg6IGl0ZW0uaW5kZXgsIHNlYXJjaFRlcm06IHNlYXJjaFRlcm0gfVwiPlxuICAgICAgICAgICAgPC9uZy10ZW1wbGF0ZT5cbiAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgPGRpdiBjbGFzcz1cIm5nLW9wdGlvblwiIFtjbGFzcy5uZy1vcHRpb24tbWFya2VkXT1cIiFpdGVtc0xpc3QubWFya2VkSXRlbVwiIChtb3VzZW92ZXIpPVwiaXRlbXNMaXN0LnVubWFya0l0ZW0oKVwiIHJvbGU9XCJvcHRpb25cIiAoY2xpY2spPVwic2VsZWN0VGFnKClcIiAqbmdJZj1cInNob3dBZGRUYWdcIj5cbiAgICAgICAgICAgIDxuZy10ZW1wbGF0ZSAjZGVmYXVsdFRhZ1RlbXBsYXRlPlxuICAgICAgICAgICAgICAgIDxzcGFuPjxzcGFuIGNsYXNzPVwibmctdGFnLWxhYmVsXCI+e3thZGRUYWdUZXh0fX08L3NwYW4+XCJ7e3NlYXJjaFRlcm19fVwiPC9zcGFuPlxuICAgICAgICAgICAgPC9uZy10ZW1wbGF0ZT5cblxuICAgICAgICAgICAgPG5nLXRlbXBsYXRlXG4gICAgICAgICAgICAgICAgW25nVGVtcGxhdGVPdXRsZXRdPVwidGFnVGVtcGxhdGUgfHwgZGVmYXVsdFRhZ1RlbXBsYXRlXCJcbiAgICAgICAgICAgICAgICBbbmdUZW1wbGF0ZU91dGxldENvbnRleHRdPVwieyBzZWFyY2hUZXJtOiBzZWFyY2hUZXJtIH1cIj5cbiAgICAgICAgICAgIDwvbmctdGVtcGxhdGU+XG4gICAgICAgIDwvZGl2PlxuICAgIDwvbmctY29udGFpbmVyPlxuXG4gICAgPG5nLWNvbnRhaW5lciAqbmdJZj1cInNob3dOb0l0ZW1zRm91bmQoKVwiPlxuICAgICAgICA8bmctdGVtcGxhdGUgI2RlZmF1bHROb3RGb3VuZFRlbXBsYXRlPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm5nLW9wdGlvbiBuZy1vcHRpb24tZGlzYWJsZWRcIj57e25vdEZvdW5kVGV4dH19PC9kaXY+XG4gICAgICAgIDwvbmctdGVtcGxhdGU+XG5cbiAgICAgICAgPG5nLXRlbXBsYXRlXG4gICAgICAgICAgICBbbmdUZW1wbGF0ZU91dGxldF09XCJub3RGb3VuZFRlbXBsYXRlIHx8IGRlZmF1bHROb3RGb3VuZFRlbXBsYXRlXCJcbiAgICAgICAgICAgIFtuZ1RlbXBsYXRlT3V0bGV0Q29udGV4dF09XCJ7IHNlYXJjaFRlcm06IHNlYXJjaFRlcm0gfVwiPlxuICAgICAgICA8L25nLXRlbXBsYXRlPlxuICAgIDwvbmctY29udGFpbmVyPlxuXG4gICAgPG5nLWNvbnRhaW5lciAqbmdJZj1cInNob3dUeXBlVG9TZWFyY2goKVwiPlxuICAgICAgICA8bmctdGVtcGxhdGUgI2RlZmF1bHRUeXBlVG9TZWFyY2hUZW1wbGF0ZT5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJuZy1vcHRpb24gbmctb3B0aW9uLWRpc2FibGVkXCI+e3t0eXBlVG9TZWFyY2hUZXh0fX08L2Rpdj5cbiAgICAgICAgPC9uZy10ZW1wbGF0ZT5cblxuICAgICAgICA8bmctdGVtcGxhdGVcbiAgICAgICAgICAgIFtuZ1RlbXBsYXRlT3V0bGV0XT1cInR5cGVUb1NlYXJjaFRlbXBsYXRlIHx8IGRlZmF1bHRUeXBlVG9TZWFyY2hUZW1wbGF0ZVwiPlxuICAgICAgICA8L25nLXRlbXBsYXRlPlxuICAgIDwvbmctY29udGFpbmVyPlxuXG4gICAgPG5nLWNvbnRhaW5lciAqbmdJZj1cImxvYWRpbmcgJiYgaXRlbXNMaXN0LmZpbHRlcmVkSXRlbXMubGVuZ3RoID09PSAwXCI+XG4gICAgICAgIDxuZy10ZW1wbGF0ZSAjZGVmYXVsdExvYWRpbmdUZXh0VGVtcGxhdGU+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwibmctb3B0aW9uIG5nLW9wdGlvbi1kaXNhYmxlZFwiPnt7bG9hZGluZ1RleHR9fTwvZGl2PlxuICAgICAgICA8L25nLXRlbXBsYXRlPlxuXG4gICAgICAgIDxuZy10ZW1wbGF0ZVxuICAgICAgICAgICAgW25nVGVtcGxhdGVPdXRsZXRdPVwibG9hZGluZ1RleHRUZW1wbGF0ZSB8fCBkZWZhdWx0TG9hZGluZ1RleHRUZW1wbGF0ZVwiXG4gICAgICAgICAgICBbbmdUZW1wbGF0ZU91dGxldENvbnRleHRdPVwieyBzZWFyY2hUZXJtOiBzZWFyY2hUZXJtIH1cIj5cbiAgICAgICAgPC9uZy10ZW1wbGF0ZT5cbiAgICA8L25nLWNvbnRhaW5lcj5cblxuPC9uZy1kcm9wZG93bi1wYW5lbD5cbiJdfQ==