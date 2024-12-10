import { EventEmitter } from '@angular/core';
export class NgxFormSupport {
    constructor() {
        /** Maps the internal ids of the annotations of pdf.js to their field name */
        this.formIdToFullFieldName = {};
        this.formIdToField = {};
        this.radioButtons = {};
        this.formData = {};
        this.formDataChange = new EventEmitter();
    }
    reset() {
        this.formData = {};
        this.formIdToFullFieldName = {};
    }
    registerFormSupportWithPdfjs(ngZone) {
        this.ngZone = ngZone;
        globalThis.getFormValueFromAngular = (key) => this.getFormValueFromAngular(key);
        globalThis.updateAngularFormValue = (key, value) => this.updateAngularFormValueCalledByPdfjs(key, value);
        globalThis.registerAcroformField = (id, element, value, radioButtonValueName) => this.registerAcroformField(id, element, value, radioButtonValueName);
        globalThis.registerXFAField = (element, value) => this.registerXFAField(element, value);
    }
    registerAcroformField(id, element, value, radioButtonValueName) {
        const fieldName = element.name;
        this.formIdToField[id] = element;
        this.formIdToFullFieldName[id] = fieldName;
        if (element instanceof HTMLInputElement && element.type === 'radio') {
            const groupName = fieldName;
            this.formIdToFullFieldName[id] = groupName;
            if (value) {
                this.formData[groupName] = radioButtonValueName;
            }
            element.setAttribute('exportValue', radioButtonValueName);
            if (!this.radioButtons[groupName]) {
                this.radioButtons[groupName] = [];
            }
            this.radioButtons[groupName].push(element);
        }
        else if (element instanceof HTMLSelectElement) {
            this.formData[fieldName] = this.getValueOfASelectField(element);
        }
        else {
            this.formData[fieldName] = value;
        }
    }
    registerXFAField(element, value) {
        const fullFieldName = this.findFullXFAName(element);
        if (element instanceof HTMLInputElement && element.type === 'radio') {
            const id = element.getAttribute('fieldid') ?? '';
            // remove the xfa name of the radio button itself form the field name,
            // because the field name refers to the entire group of relatated radio buttons
            const groupName = fullFieldName.substring(0, fullFieldName.lastIndexOf('.'));
            this.formIdToFullFieldName[id] = groupName;
            this.formData[groupName] = value.value;
            if (!this.radioButtons[groupName]) {
                this.radioButtons[groupName] = [];
            }
            this.radioButtons[groupName].push(element);
        }
        else if (element instanceof HTMLInputElement) {
            const id = element.getAttribute('fieldid') ?? '';
            this.formIdToField[id] = element;
            this.formIdToFullFieldName[id] = fullFieldName;
            this.formData[fullFieldName] = value.value;
        }
        else if (element instanceof HTMLSelectElement) {
            const id = element.getAttribute('fieldid') ?? '';
            this.formIdToField[id] = element;
            this.formIdToFullFieldName[id] = fullFieldName;
            this.formData[fullFieldName] = value.value;
        }
        else if (element instanceof HTMLTextAreaElement) {
            const id = element.getAttribute('fieldid') ?? '';
            this.formIdToField[id] = element;
            this.formIdToFullFieldName[id] = fullFieldName;
            this.formData[fullFieldName] = value.value;
        }
        else {
            console.error("Couldn't register an XFA form field", element);
        }
    }
    getValueOfASelectField(selectElement) {
        const { options, multiple } = selectElement;
        if (!multiple) {
            return options.selectedIndex === -1 ? null : options[options.selectedIndex]['value'];
        }
        return Array.prototype.filter.call(options, (option) => option.selected).map((option) => option['value']);
    }
    getFormValueFromAngular(element) {
        let key;
        if (element instanceof HTMLElement) {
            const fieldName = this.findXFAName(element);
            if (fieldName) {
                if (this.formData.hasOwnProperty(fieldName)) {
                    key = fieldName;
                }
                else {
                    key = this.findFullXFAName(element);
                }
            }
            else {
                console.error("Couldn't find the field name or XFA name of the form field", element);
                return { value: null };
            }
        }
        else {
            key = element;
        }
        return { value: this.formData[key] };
    }
    findXFAName(element) {
        let parentElement = element;
        while (!parentElement.getAttribute('xfaname') && parentElement.parentElement) {
            parentElement = parentElement.parentElement;
        }
        if (element instanceof HTMLInputElement && element.type === 'radio') {
            do {
                parentElement = parentElement?.parentElement;
            } while (!parentElement?.getAttribute('xfaname') && parentElement);
        }
        let fieldName = parentElement?.getAttribute('xfaname');
        if (!fieldName) {
            throw new Error("Couldn't find the xfaname of the field");
        }
        return fieldName;
    }
    findFullXFAName(element) {
        let parentElement = element;
        let fieldName = '';
        while (parentElement instanceof HTMLElement && parentElement.parentElement) {
            const xfaName = parentElement.getAttribute('xfaname');
            if (xfaName) {
                fieldName = xfaName + '.' + fieldName;
            }
            parentElement = parentElement.parentElement;
        }
        if (!fieldName) {
            throw new Error("Couldn't find the xfaname of the field");
        }
        fieldName = fieldName.substring(0, fieldName.length - 1);
        if (element instanceof HTMLInputElement && element.type === 'radio') {
            // ignore the last part of the xfaName because it's actually the value of the field
            return fieldName.substring(0, fieldName.lastIndexOf('.'));
        }
        return fieldName;
    }
    updateAngularFormValueCalledByPdfjs(key, value) {
        if (!this.formData) {
            this.formData = {};
        }
        if (typeof key === 'string') {
            const acroFormKey = this.formIdToFullFieldName[key];
            const fullKey = acroFormKey ?? Object.values(this.formIdToFullFieldName).find((k) => k === key || k.endsWith('.' + key));
            if (fullKey) {
                const field = this.formIdToField[key];
                let change = this.doUpdateAngularFormValue(field, value, fullKey);
                if (change) {
                    this.ngZone.run(() => this.formDataChange.emit(this.formData));
                }
            }
            else {
                console.error("Couldn't find the field with the name " + key);
            }
        }
        else {
            let change = false;
            const shortFieldName = this.findXFAName(key);
            if (this.formData.hasOwnProperty(shortFieldName)) {
                change = this.doUpdateAngularFormValue(key, value, shortFieldName);
            }
            const fullFieldName = this.findFullXFAName(key);
            if (fullFieldName !== shortFieldName) {
                change || (change = this.doUpdateAngularFormValue(key, value, fullFieldName));
            }
            if (change) {
                this.ngZone.run(() => this.formDataChange.emit(this.formData));
            }
        }
    }
    doUpdateAngularFormValue(field, value, fullKey) {
        let change = false;
        if (field instanceof HTMLInputElement && field.type === 'checkbox') {
            const exportValue = field.getAttribute('exportvalue');
            if (exportValue) {
                if (value.value) {
                    if (this.formData[fullKey] !== exportValue) {
                        this.formData[fullKey] = exportValue;
                        change = true;
                    }
                }
                else {
                    if (this.formData[fullKey] !== false) {
                        this.formData[fullKey] = false;
                        change = true;
                    }
                }
            }
            else {
                if (this.formData[fullKey] !== value.value) {
                    this.formData[fullKey] = value.value;
                    change = true;
                }
            }
        }
        else if (field instanceof HTMLInputElement && field.type === 'radio') {
            const exportValue = field.getAttribute('exportvalue') ?? field.getAttribute('xfaon');
            if (value.value) {
                if (this.formData[fullKey] !== exportValue) {
                    this.formData[fullKey] = exportValue;
                    change = true;
                }
            }
        }
        else {
            if (this.formData[fullKey] !== value.value) {
                this.formData[fullKey] = value.value;
                change = true;
            }
        }
        return change;
    }
    updateFormFieldsInPdfCalledByNgOnChanges(previousFormData) {
        const PDFViewerApplication = window.PDFViewerApplication;
        if (!PDFViewerApplication?.pdfDocument?.annotationStorage) {
            // ngOnChanges calls this method too early - so just ignore it
            return;
        }
        for (const key in this.formData) {
            if (this.formData.hasOwnProperty(key)) {
                const newValue = this.formData[key];
                if (newValue !== previousFormData[key]) {
                    this.setFieldValueAndUpdateAnnotationStorage(key, newValue);
                }
            }
        }
        for (const key in previousFormData) {
            if (previousFormData.hasOwnProperty(key) && previousFormData[key]) {
                let hasPreviousValue = this.formData.hasOwnProperty(key);
                if (!hasPreviousValue) {
                    const fullKey = Object.keys(this.formData).find((k) => k === key || k.endsWith('.' + key));
                    if (fullKey) {
                        hasPreviousValue = this.formData.hasOwnProperty(fullKey);
                    }
                }
                if (!hasPreviousValue) {
                    this.setFieldValueAndUpdateAnnotationStorage(key, null);
                }
            }
        }
    }
    setFieldValueAndUpdateAnnotationStorage(key, newValue) {
        const radios = this.findRadioButtonGroup(key);
        if (radios) {
            radios.forEach((r) => {
                const activeValue = r.getAttribute('exportValue') ?? r.getAttribute('xfaon');
                r.checked = activeValue === newValue;
            });
            const updateFromAngular = new CustomEvent('updateFromAngular', {
                detail: newValue,
            });
            radios[0].dispatchEvent(updateFromAngular);
        }
        else {
            const fieldId = this.findFormIdFromFieldName(key);
            if (fieldId) {
                const htmlField = this.formIdToField[fieldId];
                if (htmlField) {
                    if (htmlField instanceof HTMLInputElement && htmlField.type === 'checkbox') {
                        let activeValue = htmlField.getAttribute('xfaon') ?? htmlField.getAttribute('exportvalue') ?? true;
                        if (newValue === true || newValue === false) {
                            activeValue = true;
                        }
                        htmlField.checked = activeValue === newValue;
                    }
                    else if (htmlField instanceof HTMLSelectElement) {
                        this.populateSelectField(htmlField, newValue);
                    }
                    else {
                        // textareas and input fields
                        htmlField.value = newValue;
                    }
                    const updateFromAngular = new CustomEvent('updateFromAngular', {
                        detail: newValue,
                    });
                    htmlField.dispatchEvent(updateFromAngular);
                }
                else {
                    console.error("Couldn't set the value of the field", key);
                }
            }
        }
    }
    populateSelectField(htmlField, newValue) {
        if (htmlField.multiple) {
            const { options } = htmlField;
            const newValueArray = newValue;
            for (let i = 0; i < options.length; i++) {
                const option = options.item(i);
                if (option) {
                    option.selected = newValueArray.some((o) => o === option.value);
                }
            }
        }
        else {
            htmlField.value = newValue;
        }
    }
    findFormIdFromFieldName(fieldName) {
        if (Object.entries(this.formIdToFullFieldName).length === 0) {
            // sometimes, ngOnChanges() is called before initializing the PDF file
            return undefined;
        }
        const matchingEntries = Object.entries(this.formIdToFullFieldName).filter((entry) => entry[1] === fieldName || entry[1].endsWith('.' + fieldName));
        if (matchingEntries.length > 1) {
            console.log(`More than one field name matches the field name ${fieldName}. Please use the one of these qualified field names:`, matchingEntries.map((f) => f[1]));
            console.log('ngx-extended-pdf-viewer uses the first matching field (which may or may not be the topmost field on your PDF form): ' + matchingEntries[0][0]);
        }
        else if (matchingEntries.length === 0) {
            console.log("Couldn't find the field " + fieldName);
            return undefined;
        }
        return matchingEntries[0][0];
    }
    findRadioButtonGroup(fieldName) {
        const matchingEntries = Object.entries(this.radioButtons).filter((entry) => entry[0].endsWith('.' + fieldName) || entry[0] === fieldName);
        if (matchingEntries.length === 0) {
            return null;
        }
        if (matchingEntries.length > 1) {
            console.log('More than one radio button group name matches this name. Please use the qualified field name', matchingEntries.map((radio) => radio[0]));
            console.log('ngx-extended-pdf-viewer uses the first matching field (which may not be the topmost field on your PDF form): ' + matchingEntries[0][0]);
        }
        return matchingEntries[0][1];
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWZvcm0tc3VwcG9ydC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL25neC1leHRlbmRlZC1wZGYtdmlld2VyL3NyYy9saWIvbmd4LWZvcm0tc3VwcG9ydC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsWUFBWSxFQUFVLE1BQU0sZUFBZSxDQUFDO0FBS3JELE1BQU0sT0FBTyxjQUFjO0lBQTNCO1FBQ0UsNkVBQTZFO1FBQ3JFLDBCQUFxQixHQUE4QixFQUFFLENBQUM7UUFFdEQsa0JBQWEsR0FBdUMsRUFBRSxDQUFDO1FBRXZELGlCQUFZLEdBQStDLEVBQUUsQ0FBQztRQUUvRCxhQUFRLEdBQWlCLEVBQUUsQ0FBQztRQUU1QixtQkFBYyxHQUFHLElBQUksWUFBWSxFQUFnQixDQUFDO0lBaVYzRCxDQUFDO0lBN1VRLEtBQUs7UUFDVixJQUFJLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQztRQUNuQixJQUFJLENBQUMscUJBQXFCLEdBQUcsRUFBRSxDQUFDO0lBQ2xDLENBQUM7SUFFTSw0QkFBNEIsQ0FBQyxNQUFjO1FBQ2hELElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBQ3BCLFVBQWtCLENBQUMsdUJBQXVCLEdBQUcsQ0FBQyxHQUFXLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNoRyxVQUFrQixDQUFDLHNCQUFzQixHQUFHLENBQUMsR0FBd0UsRUFBRSxLQUF3QixFQUFFLEVBQUUsQ0FDbEosSUFBSSxDQUFDLG1DQUFtQyxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUN0RCxVQUFrQixDQUFDLHFCQUFxQixHQUFHLENBQUMsRUFBVSxFQUFFLE9BQXdCLEVBQUUsS0FBNkIsRUFBRSxvQkFBNkIsRUFBRSxFQUFFLENBQ2pKLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxFQUFFLEVBQUUsT0FBTyxFQUFFLEtB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UUFDNUMsTUFBTSxlQUFlLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLEdBQUcsR0FBRyxTQUFTLENBQUMsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssU0FBUyxDQUFDLENBQUM7UUFDMUksSUFBSSxlQUFlLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtZQUNoQyxPQUFPLElBQUksQ0FBQztTQUNiO1FBQ0QsSUFBSSxlQUFlLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtZQUM5QixPQUFPLENBQUMsR0FBRyxDQUNULDhGQUE4RixFQUM5RixlQUFlLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FDekMsQ0FBQztZQUNGLE9BQU8sQ0FBQyxHQUFHLENBQUMsK0dBQStHLEdBQUcsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDdEo7UUFDRCxPQUFPLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUMvQixDQUFDO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBFdmVudEVtaXR0ZXIsIE5nWm9uZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRm9ybURhdGFUeXBlLCBJUERGVmlld2VyQXBwbGljYXRpb24gfSBmcm9tICcuLi9wdWJsaWNfYXBpJztcblxuZXhwb3J0IHR5cGUgSHRtbEZvcm1FbGVtZW50ID0gSFRNTElucHV0RWxlbWVudCB8IEhUTUxTZWxlY3RFbGVtZW50IHwgSFRNTFRleHRBcmVhRWxlbWVudDtcblxuZXhwb3J0IGNsYXNzIE5neEZvcm1TdXBwb3J0IHtcbiAgLyoqIE1hcHMgdGhlIGludGVybmFsIGlkcyBvZiB0aGUgYW5ub3RhdGlvbnMgb2YgcGRmLmpzIHRvIHRoZWlyIGZpZWxkIG5hbWUgKi9cbiAgcHJpdmF0ZSBmb3JtSWRUb0Z1bGxGaWVsZE5hbWU6IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIH0gPSB7fTtcblxuICBwcml2YXRlIGZvcm1JZFRvRmllbGQ6IHsgW2tleTogc3RyaW5nXTogSHRtbEZvcm1FbGVtZW50IH0gPSB7fTtcblxuICBwcml2YXRlIHJhZGlvQnV0dG9uczogeyBba2V5OiBzdHJpbmddOiBBcnJheTxIVE1MSW5wdXRFbGVtZW50PiB9ID0ge307XG5cbiAgcHVibGljIGZvcm1EYXRhOiBGb3JtRGF0YVR5cGUgPSB7fTtcblxuICBwdWJsaWMgZm9ybURhdGFDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPEZvcm1EYXRhVHlwZT4oKTtcblxuICBwcml2YXRlIG5nWm9uZTogTmdab25lO1xuXG4gIHB1YmxpYyByZXNldCgpIHtcbiAgICB0aGlzLmZvcm1EYXRhID0ge307XG4gICAgdGhpcy5mb3JtSWRUb0Z1bGxGaWVsZE5hbWUgPSB7fTtcbiAgfVxuXG4gIHB1YmxpYyByZWdpc3RlckZvcm1TdXBwb3J0V2l0aFBkZmpzKG5nWm9uZTogTmdab25lKTogdm9pZCB7XG4gICAgdGhpcy5uZ1pvbmUgPSBuZ1pvbmU7XG4gICAgKGdsb2JhbFRoaXMgYXMgYW55KS5nZXRGb3JtVmFsdWVGcm9tQW5ndWxhciA9IChrZXk6IHN0cmluZykgPT4gdGhpcy5nZXRGb3JtVmFsdWVGcm9tQW5ndWxhcihrZXkpO1xuICAgIChnbG9iYWxUaGlzIGFzIGFueSkudXBkYXRlQW5ndWxhckZvcm1WYWx1ZSA9IChrZXk6IHN0cmluZyB8IEhUTUxJbnB1dEVsZW1lbnQgfCBIVE1MU2VsZWN0RWxlbWVudCB8IEhUTUxUZXh0QXJlYUVsZW1lbnQsIHZhbHVlOiB7IHZhbHVlOiBzdHJpbmcgfSkgPT5cbiAgICAgIHRoaXMudXBkYXRlQW5ndWxhckZvcm1WYWx1ZUNhbGxlZEJ5UGRmanMoa2V5LCB2YWx1ZSk7XG4gICAgKGdsb2JhbFRoaXMgYXMgYW55KS5yZWdpc3RlckFjcm9mb3JtRmllbGQgPSAoaWQ6IHN0cmluZywgZWxlbWVudDogSHRtbEZvcm1FbGVtZW50LCB2YWx1ZTogc3RyaW5nIHwgQXJyYXk8c3RyaW5nPiwgcmFkaW9CdXR0b25WYWx1ZU5hbWU/OiBzdHJpbmcpID0+XG4gICAgICB0aGlzLnJlZ2lzdGVyQWNyb2Zvcm1GaWVsZChpZCwgZWxlbWVudCwgdmFsdWUsIHJhZGlvQnV0dG9uVmFsdWVOYW1lKTtcblxuICAgIChnbG9iYWxUaGlzIGFzIGFueSkucmVnaXN0ZXJYRkFGaWVsZCA9IChlbGVtZW50OiBIdG1sRm9ybUVsZW1lbnQsIHZhbHVlOiB7IHZhbHVlOiBzdHJpbmcgfSkgPT4gdGhpcy5yZWdpc3RlclhGQUZpZWxkKGVsZW1lbnQsIHZhbHVlKTtcbiAgfVxuXG4gIHByaXZhdGUgcmVnaXN0ZXJBY3JvZm9ybUZpZWxkKGlkOiBzdHJpbmcsIGVsZW1lbnQ6IEh0bWxGb3JtRWxlbWVudCwgdmFsdWU6IG51bGwgfCBzdHJpbmcgfCBBcnJheTxzdHJpbmc+LCByYWRpb0J1dHRvblZhbHVlTmFtZT86IHN0cmluZyk6IHZvaWQge1xuICAgIGNvbnN0IGZpZWxkTmFtZSA9IGVsZW1lbnQubmFtZTtcbiAgICB0aGlzLmZvcm1JZFRvRmllbGRbaWRdID0gZWxlbWVudDtcbiAgICB0aGlzLmZvcm1JZFRvRnVsbEZpZWxkTmFtZVtpZF0gPSBmaWVsZE5hbWU7XG4gICAgaWYgKGVsZW1lbnQgaW5zdGFuY2VvZiBIVE1MSW5wdXRFbGVtZW50ICYmIGVsZW1lbnQudHlwZSA9PT0gJ3JhZGlvJykge1xuICAgICAgY29uc3QgZ3JvdXBOYW1lID0gZmllbGROYW1lO1xuICAgICAgdGhpcy5mb3JtSWRUb0Z1bGxGaWVsZE5hbWVbaWRdID0gZ3JvdXBOYW1lO1xuICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgIHRoaXMuZm9ybURhdGFbZ3JvdXBOYW1lXSA9IHJhZGlvQnV0dG9uVmFsdWVOYW1lIGFzIHN0cmluZztcbiAgICAgIH1cbiAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKCdleHBvcnRWYWx1ZScsIHJhZGlvQnV0dG9uVmFsdWVOYW1lIGFzIHN0cmluZyk7XG4gICAgICBpZiAoIXRoaXMucmFkaW9CdXR0b25zW2dyb3VwTmFtZV0pIHtcbiAgICAgICAgdGhpcy5yYWRpb0J1dHRvbnNbZ3JvdXBOYW1lXSA9IFtdO1xuICAgICAgfVxuICAgICAgdGhpcy5yYWRpb0J1dHRvbnNbZ3JvdXBOYW1lXS5wdXNoKGVsZW1lbnQpO1xuICAgIH0gZWxzZSBpZiAoZWxlbWVudCBpbnN0YW5jZW9mIEhUTUxTZWxlY3RFbGVtZW50KSB7XG4gICAgICB0aGlzLmZvcm1EYXRhW2ZpZWxkTmFtZV0gPSB0aGlzLmdldFZhbHVlT2ZBU2VsZWN0RmllbGQoZWxlbWVudCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZm9ybURhdGFbZmllbGROYW1lXSA9IHZhbHVlO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgcmVnaXN0ZXJYRkFGaWVsZChlbGVtZW50OiBIVE1MRWxlbWVudCwgdmFsdWU6IHsgdmFsdWU6IHN0cmluZyB9KTogdm9pZCB7XG4gICAgY29uc3QgZnVsbEZpZWxkTmFtZSA9IHRoaXMuZmluZEZ1bGxYRkFOYW1lKGVsZW1lbnQpO1xuICAgIGlmIChlbGVtZW50IGluc3RhbmNlb2YgSFRNTElucHV0RWxlbWVudCAmJiBlbGVtZW50LnR5cGUgPT09ICdyYWRpbycpIHtcbiAgICAgIGNvbnN0IGlkID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2ZpZWxkaWQnKSA/PyAnJztcbiAgICAgIC8vIHJlbW92ZSB0aGUgeGZhIG5hbWUgb2YgdGhlIHJhZGlvIGJ1dHRvbiBpdHNlbGYgZm9ybSB0aGUgZmllbGQgbmFtZSxcbiAgICAgIC8vIGJlY2F1c2UgdGhlIGZpZWxkIG5hbWUgcmVmZXJzIHRvIHRoZSBlbnRpcmUgZ3JvdXAgb2YgcmVsYXRhdGVkIHJhZGlvIGJ1dHRvbnNcbiAgICAgIGNvbnN0IGdyb3VwTmFtZSA9IGZ1bGxGaWVsZE5hbWUuc3Vic3RyaW5nKDAsIGZ1bGxGaWVsZE5hbWUubGFzdEluZGV4T2YoJy4nKSk7XG4gICAgICB0aGlzLmZvcm1JZFRvRnVsbEZpZWxkTmFtZVtpZF0gPSBncm91cE5hbWU7XG4gICAgICB0aGlzLmZvcm1EYXRhW2dyb3VwTmFtZV0gPSB2YWx1ZS52YWx1ZTtcbiAgICAgIGlmICghdGhpcy5yYWRpb0J1dHRvbnNbZ3JvdXBOYW1lXSkge1xuICAgICAgICB0aGlzLnJhZGlvQnV0dG9uc1tncm91cE5hbWVdID0gW107XG4gICAgICB9XG4gICAgICB0aGlzLnJhZGlvQnV0dG9uc1tncm91cE5hbWVdLnB1c2goZWxlbWVudCk7XG4gICAgfSBlbHNlIGlmIChlbGVtZW50IGluc3RhbmNlb2YgSFRNTElucHV0RWxlbWVudCkge1xuICAgICAgY29uc3QgaWQgPSBlbGVtZW50LmdldEF0dHJpYnV0ZSgnZmllbGRpZCcpID8/ICcnO1xuICAgICAgdGhpcy5mb3JtSWRUb0ZpZWxkW2lkXSA9IGVsZW1lbnQ7XG4gICAgICB0aGlzLmZvcm1JZFRvRnVsbEZpZWxkTmFtZVtpZF0gPSBmdWxsRmllbGROYW1lO1xuICAgICAgdGhpcy5mb3JtRGF0YVtmdWxsRmllbGROYW1lXSA9IHZhbHVlLnZhbHVlO1xuICAgIH0gZWxzZSBpZiAoZWxlbWVudCBpbnN0YW5jZW9mIEhUTUxTZWxlY3RFbGVtZW50KSB7XG4gICAgICBjb25zdCBpZCA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdmaWVsZGlkJykgPz8gJyc7XG4gICAgICB0aGlzLmZvcm1JZFRvRmllbGRbaWRdID0gZWxlbWVudDtcbiAgICAgIHRoaXMuZm9ybUlkVG9GdWxsRmllbGROYW1lW2lkXSA9IGZ1bGxGaWVsZE5hbWU7XG4gICAgICB0aGlzLmZvcm1EYXRhW2Z1bGxGaWVsZE5hbWVdID0gdmFsdWUudmFsdWU7XG4gICAgfSBlbHNlIGlmIChlbGVtZW50IGluc3RhbmNlb2YgSFRNTFRleHRBcmVhRWxlbWVudCkge1xuICAgICAgY29uc3QgaWQgPSBlbGVtZW50LmdldEF0dHJpYnV0ZSgnZmllbGRpZCcpID8/ICcnO1xuICAgICAgdGhpcy5mb3JtSWRUb0ZpZWxkW2lkXSA9IGVsZW1lbnQ7XG4gICAgICB0aGlzLmZvcm1JZFRvRnVsbEZpZWxkTmFtZVtpZF0gPSBmdWxsRmllbGROYW1lO1xuICAgICAgdGhpcy5mb3JtRGF0YVtmdWxsRmllbGROYW1lXSA9IHZhbHVlLnZhbHVlO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLmVycm9yKFwiQ291bGRuJ3QgcmVnaXN0ZXIgYW4gWEZBIGZvcm0gZmllbGRcIiwgZWxlbWVudCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBnZXRWYWx1ZU9mQVNlbGVjdEZpZWxkKHNlbGVjdEVsZW1lbnQ6IEhUTUxTZWxlY3RFbGVtZW50KTogbnVsbCB8IHN0cmluZyB8IEFycmF5PHN0cmluZz4ge1xuICAgIGNvbnN0IHsgb3B0aW9ucywgbXVsdGlwbGUgfSA9IHNlbGVjdEVsZW1lbnQ7XG4gICAgaWYgKCFtdWx0aXBsZSkge1xuICAgICAgcmV0dXJuIG9wdGlvbnMuc2VsZWN0ZWRJbmRleCA9PT0gLTEgPyBudWxsIDogb3B0aW9uc1tvcHRpb25zLnNlbGVjdGVkSW5kZXhdWyd2YWx1ZSddO1xuICAgIH1cbiAgICByZXR1cm4gQXJyYXkucHJvdG90eXBlLmZpbHRlci5jYWxsKG9wdGlvbnMsIChvcHRpb24pID0+IG9wdGlvbi5zZWxlY3RlZCkubWFwKChvcHRpb24pID0+IG9wdGlvblsndmFsdWUnXSk7XG4gIH1cblxuICBwcml2YXRlIGdldEZvcm1WYWx1ZUZyb21Bbmd1bGFyKGVsZW1lbnQ6IEhUTUxFbGVtZW50IHwgc3RyaW5nKTogT2JqZWN0IHtcbiAgICBsZXQga2V5OiBzdHJpbmc7XG4gICAgaWYgKGVsZW1lbnQgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkge1xuICAgICAgY29uc3QgZmllbGROYW1lID0gdGhpcy5maW5kWEZBTmFtZShlbGVtZW50KTtcbiAgICAgIGlmIChmaWVsZE5hbWUpIHtcbiAgICAgICAgaWYgKHRoaXMuZm9ybURhdGEuaGFzT3duUHJvcGVydHkoZmllbGROYW1lKSkge1xuICAgICAgICAgIGtleSA9IGZpZWxkTmFtZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBrZXkgPSB0aGlzLmZpbmRGdWxsWEZBTmFtZShlbGVtZW50KTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihcIkNvdWxkbid0IGZpbmQgdGhlIGZpZWxkIG5hbWUgb3IgWEZBIG5hbWUgb2YgdGhlIGZvcm0gZmllbGRcIiwgZWxlbWVudCk7XG4gICAgICAgIHJldHVybiB7IHZhbHVlOiBudWxsIH07XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGtleSA9IGVsZW1lbnQ7XG4gICAgfVxuICAgIHJldHVybiB7IHZhbHVlOiB0aGlzLmZvcm1EYXRhW2tleV0gfTtcbiAgfVxuXG4gIHByaXZhdGUgZmluZFhGQU5hbWUoZWxlbWVudDogSFRNTEVsZW1lbnQpOiBzdHJpbmcge1xuICAgIGxldCBwYXJlbnRFbGVtZW50OiBIVE1MRWxlbWVudCB8IG51bGwgfCB1bmRlZmluZWQgPSBlbGVtZW50O1xuICAgIHdoaWxlICghcGFyZW50RWxlbWVudC5nZXRBdHRyaWJ1dGUoJ3hmYW5hbWUnKSAmJiBwYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQpIHtcbiAgICAgIHBhcmVudEVsZW1lbnQgPSBwYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQ7XG4gICAgfVxuICAgIGlmIChlbGVtZW50IGluc3RhbmNlb2YgSFRNTElucHV0RWxlbWVudCAmJiBlbGVtZW50LnR5cGUgPT09ICdyYWRpbycpIHtcbiAgICAgIGRvIHtcbiAgICAgICAgcGFyZW50RWxlbWVudCA9IHBhcmVudEVsZW1lbnQ/LnBhcmVudEVsZW1lbnQ7XG4gICAgICB9IHdoaWxlICghcGFyZW50RWxlbWVudD8uZ2V0QXR0cmlidXRlKCd4ZmFuYW1lJykgJiYgcGFyZW50RWxlbWVudCk7XG4gICAgfVxuICAgIGxldCBmaWVsZE5hbWUgPSBwYXJlbnRFbGVtZW50Py5nZXRBdHRyaWJ1dGUoJ3hmYW5hbWUnKTtcbiAgICBpZiAoIWZpZWxkTmFtZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ291bGRuJ3QgZmluZCB0aGUgeGZhbmFtZSBvZiB0aGUgZmllbGRcIik7XG4gICAgfVxuICAgIHJldHVybiBmaWVsZE5hbWU7XG4gIH1cblxuICBwcml2YXRlIGZpbmRGdWxsWEZBTmFtZShlbGVtZW50OiBIVE1MRWxlbWVudCk6IHN0cmluZyB7XG4gICAgbGV0IHBhcmVudEVsZW1lbnQgPSBlbGVtZW50O1xuICAgIGxldCBmaWVsZE5hbWUgPSAnJztcbiAgICB3aGlsZSAocGFyZW50RWxlbWVudCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50ICYmIHBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudCkge1xuICAgICAgY29uc3QgeGZhTmFtZSA9IHBhcmVudEVsZW1lbnQuZ2V0QXR0cmlidXRlKCd4ZmFuYW1lJyk7XG4gICAgICBpZiAoeGZhTmFtZSkge1xuICAgICAgICBmaWVsZE5hbWUgPSB4ZmFOYW1lICsgJy4nICsgZmllbGROYW1lO1xuICAgICAgfVxuICAgICAgcGFyZW50RWxlbWVudCA9IHBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudDtcbiAgICB9XG4gICAgaWYgKCFmaWVsZE5hbWUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkNvdWxkbid0IGZpbmQgdGhlIHhmYW5hbWUgb2YgdGhlIGZpZWxkXCIpO1xuICAgIH1cbiAgICBmaWVsZE5hbWUgPSBmaWVsZE5hbWUuc3Vic3RyaW5nKDAsIGZpZWxkTmFtZS5sZW5ndGggLSAxKTtcbiAgICBpZiAoZWxlbWVudCBpbnN0YW5jZW9mIEhUTUxJbnB1dEVsZW1lbnQgJiYgZWxlbWVudC50eXBlID09PSAncmFkaW8nKSB7XG4gICAgICAvLyBpZ25vcmUgdGhlIGxhc3QgcGFydCBvZiB0aGUgeGZhTmFtZSBiZWNhdXNlIGl0J3MgYWN0dWFsbHkgdGhlIHZhbHVlIG9mIHRoZSBmaWVsZFxuICAgICAgcmV0dXJuIGZpZWxkTmFtZS5zdWJzdHJpbmcoMCwgZmllbGROYW1lLmxhc3RJbmRleE9mKCcuJykpO1xuICAgIH1cbiAgICByZXR1cm4gZmllbGROYW1lO1xuICB9XG5cbiAgcHJpdmF0ZSB1cGRhdGVBbmd1bGFyRm9ybVZhbHVlQ2FsbGVkQnlQZGZqcyhrZXk6IHN0cmluZyB8IEhUTUxTZWxlY3RFbGVtZW50IHwgSFRNTElucHV0RWxlbWVudCB8IEhUTUxUZXh0QXJlYUVsZW1lbnQsIHZhbHVlOiB7IHZhbHVlOiBzdHJpbmcgfSk6IHZvaWQge1xuICAgIGlmICghdGhpcy5mb3JtRGF0YSkge1xuICAgICAgdGhpcy5mb3JtRGF0YSA9IHt9O1xuICAgIH1cblxuICAgIGlmICh0eXBlb2Yga2V5ID09PSAnc3RyaW5nJykge1xuICAgICAgY29uc3QgYWNyb0Zvcm1LZXkgPSB0aGlzLmZvcm1JZFRvRnVsbEZpZWxkTmFtZVtrZXldO1xuICAgICAgY29uc3QgZnVsbEtleSA9IGFjcm9Gb3JtS2V5ID8/IE9iamVjdC52YWx1ZXModGhpcy5mb3JtSWRUb0Z1bGxGaWVsZE5hbWUpLmZpbmQoKGspID0+IGsgPT09IGtleSB8fCBrLmVuZHNXaXRoKCcuJyArIGtleSkpO1xuICAgICAgaWYgKGZ1bGxLZXkpIHtcbiAgICAgICAgY29uc3QgZmllbGQgPSB0aGlzLmZvcm1JZFRvRmllbGRba2V5XTtcbiAgICAgICAgbGV0IGNoYW5nZSA9IHRoaXMuZG9VcGRhdGVBbmd1bGFyRm9ybVZhbHVlKGZpZWxkLCB2YWx1ZSwgZnVsbEtleSk7XG4gICAgICAgIGlmIChjaGFuZ2UpIHtcbiAgICAgICAgICB0aGlzLm5nWm9uZS5ydW4oKCkgPT4gdGhpcy5mb3JtRGF0YUNoYW5nZS5lbWl0KHRoaXMuZm9ybURhdGEpKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihcIkNvdWxkbid0IGZpbmQgdGhlIGZpZWxkIHdpdGggdGhlIG5hbWUgXCIgKyBrZXkpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBsZXQgY2hhbmdlID0gZmFsc2U7XG4gICAgICBjb25zdCBzaG9ydEZpZWxkTmFtZSA9IHRoaXMuZmluZFhGQU5hbWUoa2V5KTtcbiAgICAgIGlmICh0aGlzLmZvcm1EYXRhLmhhc093blByb3BlcnR5KHNob3J0RmllbGROYW1lKSkge1xuICAgICAgICBjaGFuZ2UgPSB0aGlzLmRvVXBkYXRlQW5ndWxhckZvcm1WYWx1ZShrZXksIHZhbHVlLCBzaG9ydEZpZWxkTmFtZSk7XG4gICAgICB9XG4gICAgICBjb25zdCBmdWxsRmllbGROYW1lID0gdGhpcy5maW5kRnVsbFhGQU5hbWUoa2V5KTtcbiAgICAgIGlmIChmdWxsRmllbGROYW1lICE9PSBzaG9ydEZpZWxkTmFtZSkge1xuICAgICAgICBjaGFuZ2UgfHw9IHRoaXMuZG9VcGRhdGVBbmd1bGFyRm9ybVZhbHVlKGtleSwgdmFsdWUsIGZ1bGxGaWVsZE5hbWUpO1xuICAgICAgfVxuICAgICAgaWYgKGNoYW5nZSkge1xuICAgICAgICB0aGlzLm5nWm9uZS5ydW4oKCkgPT4gdGhpcy5mb3JtRGF0YUNoYW5nZS5lbWl0KHRoaXMuZm9ybURhdGEpKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGRvVXBkYXRlQW5ndWxhckZvcm1WYWx1ZShmaWVsZDogSHRtbEZvcm1FbGVtZW50LCB2YWx1ZTogeyB2YWx1ZTogc3RyaW5nIH0sIGZ1bGxLZXk6IHN0cmluZykge1xuICAgIGxldCBjaGFuZ2UgPSBmYWxzZTtcbiAgICBpZiAoZmllbGQgaW5zdGFuY2VvZiBIVE1MSW5wdXRFbGVtZW50ICYmIGZpZWxkLnR5cGUgPT09ICdjaGVja2JveCcpIHtcbiAgICAgIGNvbnN0IGV4cG9ydFZhbHVlID0gZmllbGQuZ2V0QXR0cmlidXRlKCdleHBvcnR2YWx1ZScpO1xuICAgICAgaWYgKGV4cG9ydFZhbHVlKSB7XG4gICAgICAgIGlmICh2YWx1ZS52YWx1ZSkge1xuICAgICAgICAgIGlmICh0aGlzLmZvcm1EYXRhW2Z1bGxLZXldICE9PSBleHBvcnRWYWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5mb3JtRGF0YVtmdWxsS2V5XSA9IGV4cG9ydFZhbHVlO1xuICAgICAgICAgICAgY2hhbmdlID0gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKHRoaXMuZm9ybURhdGFbZnVsbEtleV0gIT09IGZhbHNlKSB7XG4gICAgICAgICAgICB0aGlzLmZvcm1EYXRhW2Z1bGxLZXldID0gZmFsc2U7XG4gICAgICAgICAgICBjaGFuZ2UgPSB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHRoaXMuZm9ybURhdGFbZnVsbEtleV0gIT09IHZhbHVlLnZhbHVlKSB7XG4gICAgICAgICAgdGhpcy5mb3JtRGF0YVtmdWxsS2V5XSA9IHZhbHVlLnZhbHVlO1xuICAgICAgICAgIGNoYW5nZSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGZpZWxkIGluc3RhbmNlb2YgSFRNTElucHV0RWxlbWVudCAmJiBmaWVsZC50eXBlID09PSAncmFkaW8nKSB7XG4gICAgICBjb25zdCBleHBvcnRWYWx1ZSA9IGZpZWxkLmdldEF0dHJpYnV0ZSgnZXhwb3J0dmFsdWUnKSA/PyBmaWVsZC5nZXRBdHRyaWJ1dGUoJ3hmYW9uJyk7XG4gICAgICBpZiAodmFsdWUudmFsdWUpIHtcbiAgICAgICAgaWYgKHRoaXMuZm9ybURhdGFbZnVsbEtleV0gIT09IGV4cG9ydFZhbHVlKSB7XG4gICAgICAgICAgdGhpcy5mb3JtRGF0YVtmdWxsS2V5XSA9IGV4cG9ydFZhbHVlO1xuICAgICAgICAgIGNoYW5nZSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHRoaXMuZm9ybURhdGFbZnVsbEtleV0gIT09IHZhbHVlLnZhbHVlKSB7XG4gICAgICAgIHRoaXMuZm9ybURhdGFbZnVsbEtleV0gPSB2YWx1ZS52YWx1ZTtcbiAgICAgICAgY2hhbmdlID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGNoYW5nZTtcbiAgfVxuXG4gIHB1YmxpYyB1cGRhdGVGb3JtRmllbGRzSW5QZGZDYWxsZWRCeU5nT25DaGFuZ2VzKHByZXZpb3VzRm9ybURhdGE6IE9iamVjdCkge1xuICAgIGNvbnN0IFBERlZpZXdlckFwcGxpY2F0aW9uOiBJUERGVmlld2VyQXBwbGljYXRpb24gPSAod2luZG93IGFzIGFueSkuUERGVmlld2VyQXBwbGljYXRpb247XG5cbiAgICBpZiAoIVBERlZpZXdlckFwcGxpY2F0aW9uPy5wZGZEb2N1bWVudD8uYW5ub3RhdGlvblN0b3JhZ2UpIHtcbiAgICAgIC8vIG5nT25DaGFuZ2VzIGNhbGxzIHRoaXMgbWV0aG9kIHRvbyBlYXJseSAtIHNvIGp1c3QgaWdub3JlIGl0XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgZm9yIChjb25zdCBrZXkgaW4gdGhpcy5mb3JtRGF0YSkge1xuICAgICAgaWYgKHRoaXMuZm9ybURhdGEuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICBjb25zdCBuZXdWYWx1ZSA9IHRoaXMuZm9ybURhdGFba2V5XTtcbiAgICAgICAgaWYgKG5ld1ZhbHVlICE9PSBwcmV2aW91c0Zvcm1EYXRhW2tleV0pIHtcbiAgICAgICAgICB0aGlzLnNldEZpZWxkVmFsdWVBbmRVcGRhdGVBbm5vdGF0aW9uU3RvcmFnZShrZXksIG5ld1ZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGZvciAoY29uc3Qga2V5IGluIHByZXZpb3VzRm9ybURhdGEpIHtcbiAgICAgIGlmIChwcmV2aW91c0Zvcm1EYXRhLmhhc093blByb3BlcnR5KGtleSkgJiYgcHJldmlvdXNGb3JtRGF0YVtrZXldKSB7XG4gICAgICAgIGxldCBoYXNQcmV2aW91c1ZhbHVlID0gdGhpcy5mb3JtRGF0YS5oYXNPd25Qcm9wZXJ0eShrZXkpO1xuICAgICAgICBpZiAoIWhhc1ByZXZpb3VzVmFsdWUpIHtcbiAgICAgICAgICBjb25zdCBmdWxsS2V5ID0gT2JqZWN0LmtleXModGhpcy5mb3JtRGF0YSkuZmluZCgoaykgPT4gayA9PT0ga2V5IHx8IGsuZW5kc1dpdGgoJy4nICsga2V5KSk7XG4gICAgICAgICAgaWYgKGZ1bGxLZXkpIHtcbiAgICAgICAgICAgIGhhc1ByZXZpb3VzVmFsdWUgPSB0aGlzLmZvcm1EYXRhLmhhc093blByb3BlcnR5KGZ1bGxLZXkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghaGFzUHJldmlvdXNWYWx1ZSkge1xuICAgICAgICAgIHRoaXMuc2V0RmllbGRWYWx1ZUFuZFVwZGF0ZUFubm90YXRpb25TdG9yYWdlKGtleSwgbnVsbCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHNldEZpZWxkVmFsdWVBbmRVcGRhdGVBbm5vdGF0aW9uU3RvcmFnZShrZXk6IHN0cmluZywgbmV3VmFsdWU6IGFueSkge1xuICAgIGNvbnN0IHJhZGlvcyA9IHRoaXMuZmluZFJhZGlvQnV0dG9uR3JvdXAoa2V5KTtcbiAgICBpZiAocmFkaW9zKSB7XG4gICAgICByYWRpb3MuZm9yRWFjaCgocikgPT4ge1xuICAgICAgICBjb25zdCBhY3RpdmVWYWx1ZSA9IHIuZ2V0QXR0cmlidXRlKCdleHBvcnRWYWx1ZScpID8/IHIuZ2V0QXR0cmlidXRlKCd4ZmFvbicpO1xuICAgICAgICByLmNoZWNrZWQgPSBhY3RpdmVWYWx1ZSA9PT0gbmV3VmFsdWU7XG4gICAgICB9KTtcbiAgICAgIGNvbnN0IHVwZGF0ZUZyb21Bbmd1bGFyID0gbmV3IEN1c3RvbUV2ZW50KCd1cGRhdGVGcm9tQW5ndWxhcicsIHtcbiAgICAgICAgZGV0YWlsOiBuZXdWYWx1ZSxcbiAgICAgIH0pO1xuICAgICAgcmFkaW9zWzBdLmRpc3BhdGNoRXZlbnQodXBkYXRlRnJvbUFuZ3VsYXIpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBmaWVsZElkID0gdGhpcy5maW5kRm9ybUlkRnJvbUZpZWxkTmFtZShrZXkpO1xuICAgICAgaWYgKGZpZWxkSWQpIHtcbiAgICAgICAgY29uc3QgaHRtbEZpZWxkID0gdGhpcy5mb3JtSWRUb0ZpZWxkW2ZpZWxkSWRdO1xuXG4gICAgICAgIGlmIChodG1sRmllbGQpIHtcbiAgICAgICAgICBpZiAoaHRtbEZpZWxkIGluc3RhbmNlb2YgSFRNTElucHV0RWxlbWVudCAmJiBodG1sRmllbGQudHlwZSA9PT0gJ2NoZWNrYm94Jykge1xuICAgICAgICAgICAgbGV0IGFjdGl2ZVZhbHVlID0gaHRtbEZpZWxkLmdldEF0dHJpYnV0ZSgneGZhb24nKSA/PyBodG1sRmllbGQuZ2V0QXR0cmlidXRlKCdleHBvcnR2YWx1ZScpID8/IHRydWU7XG4gICAgICAgICAgICBpZiAobmV3VmFsdWUgPT09IHRydWUgfHwgbmV3VmFsdWUgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgIGFjdGl2ZVZhbHVlID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGh0bWxGaWVsZC5jaGVja2VkID0gYWN0aXZlVmFsdWUgPT09IG5ld1ZhbHVlO1xuICAgICAgICAgIH0gZWxzZSBpZiAoaHRtbEZpZWxkIGluc3RhbmNlb2YgSFRNTFNlbGVjdEVsZW1lbnQpIHtcbiAgICAgICAgICAgIHRoaXMucG9wdWxhdGVTZWxlY3RGaWVsZChodG1sRmllbGQsIG5ld1ZhbHVlKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gdGV4dGFyZWFzIGFuZCBpbnB1dCBmaWVsZHNcbiAgICAgICAgICAgIGh0bWxGaWVsZC52YWx1ZSA9IG5ld1ZhbHVlO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjb25zdCB1cGRhdGVGcm9tQW5ndWxhciA9IG5ldyBDdXN0b21FdmVudCgndXBkYXRlRnJvbUFuZ3VsYXInLCB7XG4gICAgICAgICAgICBkZXRhaWw6IG5ld1ZhbHVlLFxuICAgICAgICAgIH0pO1xuICAgICAgICAgIGh0bWxGaWVsZC5kaXNwYXRjaEV2ZW50KHVwZGF0ZUZyb21Bbmd1bGFyKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKFwiQ291bGRuJ3Qgc2V0IHRoZSB2YWx1ZSBvZiB0aGUgZmllbGRcIiwga2V5KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgcG9wdWxhdGVTZWxlY3RGaWVsZChodG1sRmllbGQ6IEhUTUxTZWxlY3RFbGVtZW50LCBuZXdWYWx1ZTogYW55KSB7XG4gICAgaWYgKGh0bWxGaWVsZC5tdWx0aXBsZSkge1xuICAgICAgY29uc3QgeyBvcHRpb25zIH0gPSBodG1sRmllbGQ7XG4gICAgICBjb25zdCBuZXdWYWx1ZUFycmF5ID0gbmV3VmFsdWUgYXMgQXJyYXk8c3RyaW5nPjtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgb3B0aW9ucy5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCBvcHRpb24gPSBvcHRpb25zLml0ZW0oaSk7XG4gICAgICAgIGlmIChvcHRpb24pIHtcbiAgICAgICAgICBvcHRpb24uc2VsZWN0ZWQgPSBuZXdWYWx1ZUFycmF5LnNvbWUoKG8pID0+IG8gPT09IG9wdGlvbi52YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaHRtbEZpZWxkLnZhbHVlID0gbmV3VmFsdWU7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBmaW5kRm9ybUlkRnJvbUZpZWxkTmFtZShmaWVsZE5hbWU6IHN0cmluZyk6IHN0cmluZyB8IHVuZGVmaW5lZCB7XG4gICAgaWYgKE9iamVjdC5lbnRyaWVzKHRoaXMuZm9ybUlkVG9GdWxsRmllbGROYW1lKS5sZW5ndGggPT09IDApIHtcbiAgICAgIC8vIHNvbWV0aW1lcywgbmdPbkNoYW5nZXMoKSBpcyBjYWxsZWQgYmVmb3JlIGluaXRpYWxpemluZyB0aGUgUERGIGZpbGVcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuICAgIGNvbnN0IG1hdGNoaW5nRW50cmllcyA9IE9iamVjdC5lbnRyaWVzKHRoaXMuZm9ybUlkVG9GdWxsRmllbGROYW1lKS5maWx0ZXIoKGVudHJ5KSA9PiBlbnRyeVsxXSA9PT0gZmllbGROYW1lIHx8IGVudHJ5WzFdLmVuZHNXaXRoKCcuJyArIGZpZWxkTmFtZSkpO1xuICAgIGlmIChtYXRjaGluZ0VudHJpZXMubGVuZ3RoID4gMSkge1xuICAgICAgY29uc29sZS5sb2coXG4gICAgICAgIGBNb3JlIHRoYW4gb25lIGZpZWxkIG5hbWUgbWF0Y2hlcyB0aGUgZmllbGQgbmFtZSAke2ZpZWxkTmFtZX0uIFBsZWFzZSB1c2UgdGhlIG9uZSBvZiB0aGVzZSBxdWFsaWZpZWQgZmllbGQgbmFtZXM6YCxcbiAgICAgICAgbWF0Y2hpbmdFbnRyaWVzLm1hcCgoZikgPT4gZlsxXSlcbiAgICAgICk7XG4gICAgICBjb25zb2xlLmxvZyhcbiAgICAgICAgJ25neC1leHRlbmRlZC1wZGYtdmlld2VyIHVzZXMgdGhlIGZpcnN0IG1hdGNoaW5nIGZpZWxkICh3aGljaCBtYXkgb3IgbWF5IG5vdCBiZSB0aGUgdG9wbW9zdCBmaWVsZCBvbiB5b3VyIFBERiBmb3JtKTogJyArIG1hdGNoaW5nRW50cmllc1swXVswXVxuICAgICAgKTtcbiAgICB9IGVsc2UgaWYgKG1hdGNoaW5nRW50cmllcy5sZW5ndGggPT09IDApIHtcbiAgICAgIGNvbnNvbGUubG9nKFwiQ291bGRuJ3QgZmluZCB0aGUgZmllbGQgXCIgKyBmaWVsZE5hbWUpO1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gICAgcmV0dXJuIG1hdGNoaW5nRW50cmllc1swXVswXTtcbiAgfVxuXG4gIHByaXZhdGUgZmluZFJhZGlvQnV0dG9uR3JvdXAoZmllbGROYW1lOiBzdHJpbmcpOiBBcnJheTxIVE1MSW5wdXRFbGVtZW50PiB8IG51bGwge1xuICAgIGNvbnN0IG1hdGNoaW5nRW50cmllcyA9IE9iamVjdC5lbnRyaWVzKHRoaXMucmFkaW9CdXR0b25zKS5maWx0ZXIoKGVudHJ5KSA9PiBlbnRyeVswXS5lbmRzV2l0aCgnLicgKyBmaWVsZE5hbWUpIHx8IGVudHJ5WzBdID09PSBmaWVsZE5hbWUpO1xuICAgIGlmIChtYXRjaGluZ0VudHJpZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgaWYgKG1hdGNoaW5nRW50cmllcy5sZW5ndGggPiAxKSB7XG4gICAgICBjb25zb2xlLmxvZyhcbiAgICAgICAgJ01vcmUgdGhhbiBvbmUgcmFkaW8gYnV0dG9uIGdyb3VwIG5hbWUgbWF0Y2hlcyB0aGlzIG5hbWUuIFBsZWFzZSB1c2UgdGhlIHF1YWxpZmllZCBmaWVsZCBuYW1lJyxcbiAgICAgICAgbWF0Y2hpbmdFbnRyaWVzLm1hcCgocmFkaW8pID0+IHJhZGlvWzBdKVxuICAgICAgKTtcbiAgICAgIGNvbnNvbGUubG9nKCduZ3gtZXh0ZW5kZWQtcGRmLXZpZXdlciB1c2VzIHRoZSBmaXJzdCBtYXRjaGluZyBmaWVsZCAod2hpY2ggbWF5IG5vdCBiZSB0aGUgdG9wbW9zdCBmaWVsZCBvbiB5b3VyIFBERiBmb3JtKTogJyArIG1hdGNoaW5nRW50cmllc1swXVswXSk7XG4gICAgfVxuICAgIHJldHVybiBtYXRjaGluZ0VudHJpZXNbMF1bMV07XG4gIH1cbn1cbiJdfQ==