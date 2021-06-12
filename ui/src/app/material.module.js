"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaterialModule = void 0;
const core_1 = require("@angular/core");
const table_1 = require("@angular/cdk/table");
const tree_1 = require("@angular/cdk/tree");
const autocomplete_1 = require("@angular/material/autocomplete");
const badge_1 = require("@angular/material/badge");
const bottom_sheet_1 = require("@angular/material/bottom-sheet");
const button_1 = require("@angular/material/button");
const button_toggle_1 = require("@angular/material/button-toggle");
const card_1 = require("@angular/material/card");
const checkbox_1 = require("@angular/material/checkbox");
const chips_1 = require("@angular/material/chips");
const core_2 = require("@angular/material/core");
const datepicker_1 = require("@angular/material/datepicker");
const dialog_1 = require("@angular/material/dialog");
const divider_1 = require("@angular/material/divider");
const expansion_1 = require("@angular/material/expansion");
const grid_list_1 = require("@angular/material/grid-list");
const icon_1 = require("@angular/material/icon");
const input_1 = require("@angular/material/input");
const list_1 = require("@angular/material/list");
const menu_1 = require("@angular/material/menu");
const paginator_1 = require("@angular/material/paginator");
const progress_bar_1 = require("@angular/material/progress-bar");
const progress_spinner_1 = require("@angular/material/progress-spinner");
const radio_1 = require("@angular/material/radio");
const select_1 = require("@angular/material/select");
const sidenav_1 = require("@angular/material/sidenav");
const slide_toggle_1 = require("@angular/material/slide-toggle");
const slider_1 = require("@angular/material/slider");
const snack_bar_1 = require("@angular/material/snack-bar");
const sort_1 = require("@angular/material/sort");
const stepper_1 = require("@angular/material/stepper");
const table_2 = require("@angular/material/table");
const tabs_1 = require("@angular/material/tabs");
const toolbar_1 = require("@angular/material/toolbar");
const tooltip_1 = require("@angular/material/tooltip");
const tree_2 = require("@angular/material/tree");
const clipboard_1 = require("@angular/cdk/clipboard");
let MaterialModule = class MaterialModule {
};
MaterialModule = __decorate([
    core_1.NgModule({
        imports: [
            table_1.CdkTableModule,
            tree_1.CdkTreeModule,
            autocomplete_1.MatAutocompleteModule,
            badge_1.MatBadgeModule,
            bottom_sheet_1.MatBottomSheetModule,
            button_1.MatButtonModule,
            button_toggle_1.MatButtonToggleModule,
            card_1.MatCardModule,
            checkbox_1.MatCheckboxModule,
            chips_1.MatChipsModule,
            stepper_1.MatStepperModule,
            datepicker_1.MatDatepickerModule,
            dialog_1.MatDialogModule,
            divider_1.MatDividerModule,
            expansion_1.MatExpansionModule,
            grid_list_1.MatGridListModule,
            icon_1.MatIconModule,
            input_1.MatInputModule,
            list_1.MatListModule,
            menu_1.MatMenuModule,
            core_2.MatNativeDateModule,
            paginator_1.MatPaginatorModule,
            progress_bar_1.MatProgressBarModule,
            progress_spinner_1.MatProgressSpinnerModule,
            radio_1.MatRadioModule,
            core_2.MatRippleModule,
            select_1.MatSelectModule,
            sidenav_1.MatSidenavModule,
            slider_1.MatSliderModule,
            slide_toggle_1.MatSlideToggleModule,
            snack_bar_1.MatSnackBarModule,
            sort_1.MatSortModule,
            table_2.MatTableModule,
            tabs_1.MatTabsModule,
            toolbar_1.MatToolbarModule,
            tooltip_1.MatTooltipModule,
            tree_2.MatTreeModule,
            clipboard_1.ClipboardModule
        ],
        exports: [table_1.CdkTableModule,
            tree_1.CdkTreeModule,
            autocomplete_1.MatAutocompleteModule,
            badge_1.MatBadgeModule,
            bottom_sheet_1.MatBottomSheetModule,
            button_1.MatButtonModule,
            button_toggle_1.MatButtonToggleModule,
            card_1.MatCardModule,
            checkbox_1.MatCheckboxModule,
            chips_1.MatChipsModule,
            stepper_1.MatStepperModule,
            datepicker_1.MatDatepickerModule,
            dialog_1.MatDialogModule,
            divider_1.MatDividerModule,
            expansion_1.MatExpansionModule,
            grid_list_1.MatGridListModule,
            icon_1.MatIconModule,
            input_1.MatInputModule,
            list_1.MatListModule,
            menu_1.MatMenuModule,
            core_2.MatNativeDateModule,
            paginator_1.MatPaginatorModule,
            progress_bar_1.MatProgressBarModule,
            progress_spinner_1.MatProgressSpinnerModule,
            radio_1.MatRadioModule,
            core_2.MatRippleModule,
            select_1.MatSelectModule,
            sidenav_1.MatSidenavModule,
            slider_1.MatSliderModule,
            slide_toggle_1.MatSlideToggleModule,
            snack_bar_1.MatSnackBarModule,
            sort_1.MatSortModule,
            table_2.MatTableModule,
            tabs_1.MatTabsModule,
            toolbar_1.MatToolbarModule,
            tooltip_1.MatTooltipModule,
            tree_2.MatTreeModule,
            clipboard_1.ClipboardModule],
    })
], MaterialModule);
exports.MaterialModule = MaterialModule;
