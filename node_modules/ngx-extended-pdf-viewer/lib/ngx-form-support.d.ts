import { EventEmitter, NgZone } from '@angular/core';
import { FormDataType } from '../public_api';
export declare type HtmlFormElement = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
export declare class NgxFormSupport {
    /** Maps the internal ids of the annotations of pdf.js to their field name */
    private formIdToFullFieldName;
    private formIdToField;
    private radioButtons;
    formData: FormDataType;
    formDataChange: EventEmitter<FormDataType>;
    private ngZone;
    reset(): void;
    registerFormSupportWithPdfjs(ngZone: NgZone): void;
    private registerAcroformField;
    private registerXFAField;
    private getValueOfASelectField;
    private getFormValueFromAngular;
    private findXFAName;
    private findFullXFAName;
    private updateAngularFormValueCalledByPdfjs;
    private doUpdateAngularFormValue;
    updateFormFieldsInPdfCalledByNgOnChanges(previousFormData: Object): void;
    private setFieldValueAndUpdateAnnotationStorage;
    private populateSelectField;
    private findFormIdFromFieldName;
    private findRadioButtonGroup;
}
