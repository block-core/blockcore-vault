"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@angular/core/testing");
const forms_1 = require("@angular/forms");
const animations_1 = require("@angular/platform-browser/animations");
const button_1 = require("@angular/material/button");
const card_1 = require("@angular/material/card");
const input_1 = require("@angular/material/input");
const radio_1 = require("@angular/material/radio");
const select_1 = require("@angular/material/select");
const identity_component_1 = require("./identity.component");
describe('IdentityComponent', () => {
    let component;
    let fixture;
    beforeEach(testing_1.async(() => {
        testing_1.TestBed.configureTestingModule({
            declarations: [identity_component_1.IdentityComponent],
            imports: [
                animations_1.NoopAnimationsModule,
                forms_1.ReactiveFormsModule,
                button_1.MatButtonModule,
                card_1.MatCardModule,
                input_1.MatInputModule,
                radio_1.MatRadioModule,
                select_1.MatSelectModule,
            ]
        }).compileComponents();
    }));
    beforeEach(() => {
        fixture = testing_1.TestBed.createComponent(identity_component_1.IdentityComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should compile', () => {
        expect(component).toBeTruthy();
    });
});
