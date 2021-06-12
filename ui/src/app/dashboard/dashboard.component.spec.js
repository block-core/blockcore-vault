"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const layout_1 = require("@angular/cdk/layout");
const animations_1 = require("@angular/platform-browser/animations");
const testing_1 = require("@angular/core/testing");
const button_1 = require("@angular/material/button");
const card_1 = require("@angular/material/card");
const grid_list_1 = require("@angular/material/grid-list");
const icon_1 = require("@angular/material/icon");
const menu_1 = require("@angular/material/menu");
const dashboard_component_1 = require("./dashboard.component");
describe('DashboardComponent', () => {
    let component;
    let fixture;
    beforeEach(testing_1.async(() => {
        testing_1.TestBed.configureTestingModule({
            declarations: [dashboard_component_1.DashboardComponent],
            imports: [
                animations_1.NoopAnimationsModule,
                layout_1.LayoutModule,
                button_1.MatButtonModule,
                card_1.MatCardModule,
                grid_list_1.MatGridListModule,
                icon_1.MatIconModule,
                menu_1.MatMenuModule,
            ]
        }).compileComponents();
    }));
    beforeEach(() => {
        fixture = testing_1.TestBed.createComponent(dashboard_component_1.DashboardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should compile', () => {
        expect(component).toBeTruthy();
    });
});
