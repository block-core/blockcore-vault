"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@angular/core/testing");
const button_1 = require("@angular/material/button");
const icon_1 = require("@angular/material/icon");
const tree_1 = require("@angular/material/tree");
const gateway_component_1 = require("./gateway.component");
describe('GatewayComponent', () => {
    let component;
    let fixture;
    beforeEach(testing_1.async(() => {
        testing_1.TestBed.configureTestingModule({
            declarations: [gateway_component_1.GatewayComponent],
            imports: [
                button_1.MatButtonModule,
                icon_1.MatIconModule,
                tree_1.MatTreeModule,
            ]
        }).compileComponents();
    }));
    beforeEach(() => {
        fixture = testing_1.TestBed.createComponent(gateway_component_1.GatewayComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should compile', () => {
        expect(component).toBeTruthy();
    });
});
