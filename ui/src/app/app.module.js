"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const platform_browser_1 = require("@angular/platform-browser");
const app_routing_module_1 = require("./app-routing.module");
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
const http_1 = require("@angular/common/http");
const app_component_1 = require("./app.component");
const nav_menu_component_1 = require("./nav-menu/nav-menu.component");
const home_component_1 = require("./home/home.component");
const explorer_component_1 = require("./explorer/explorer.component");
const about_component_1 = require("./about/about.component");
const network_component_1 = require("./network/network.component");
const api_component_1 = require("./api/api.component");
const footer_component_1 = require("./footer/footer.component");
const progress_component_1 = require("./progress/progress.component");
const blocks_component_1 = require("./explorer/blocks/blocks.component");
const block_component_1 = require("./explorer/block/block.component");
const scroll_directive_1 = require("./shared/scroll.directive");
const ago_pipe_1 = require("./shared/ago.pipe");
const timestamp_pipe_1 = require("./shared/timestamp.pipe");
const size_pipe_1 = require("./shared/size.pipe");
const ticker_component_1 = require("./ticker/ticker.component");
const transaction_component_1 = require("./explorer/transaction/transaction.component");
const amount_1 = require("./shared/amount");
const search_component_1 = require("./search/search.component");
const error_component_1 = require("./error/error.component");
const yes_pipe_1 = require("./shared/yes.pipe");
const address_component_1 = require("./explorer/address/address.component");
const hubs_component_1 = require("./hubs/hubs.component");
const setup_component_1 = require("./setup/setup.component");
const animations_1 = require("@angular/platform-browser/animations");
const identity_component_1 = require("./identity/identity.component");
const input_1 = require("@angular/material/input");
const button_1 = require("@angular/material/button");
const select_1 = require("@angular/material/select");
const radio_1 = require("@angular/material/radio");
const card_1 = require("@angular/material/card");
const dashboard_component_1 = require("./dashboard/dashboard.component");
const layout_1 = require("@angular/cdk/layout");
const toolbar_1 = require("@angular/material/toolbar");
const sidenav_1 = require("@angular/material/sidenav");
const icon_1 = require("@angular/material/icon");
const list_1 = require("@angular/material/list");
const grid_list_1 = require("@angular/material/grid-list");
const menu_1 = require("@angular/material/menu");
const gateway_component_1 = require("./gateway/gateway.component");
const tree_1 = require("@angular/material/tree");
const badge_1 = require("@angular/material/badge");
const apps_component_1 = require("./apps/apps.component");
const tabs_1 = require("@angular/material/tabs");
const requests_component_1 = require("./requests/requests.component");
const tooltip_1 = require("@angular/material/tooltip");
const message_component_1 = require("./message/message.component");
const messages_component_1 = require("./messages/messages.component");
const expansion_1 = require("@angular/material/expansion");
const table_1 = require("@angular/material/table");
const customers_component_1 = require("./customers/customers.component");
const referral_component_1 = require("./referral/referral.component");
const signup_component_1 = require("./signup/signup.component");
const values_component_1 = require("./values/values.component");
const state_component_1 = require("./state/state.component");
const checkbox_1 = require("@angular/material/checkbox");
const settings_component_1 = require("./settings/settings.component");
const vaults_component_1 = require("./vaults/vaults.component");
let AppModule = class AppModule {
};
AppModule = __decorate([
    core_1.NgModule({
        declarations: [
            app_component_1.AppComponent,
            nav_menu_component_1.NavMenuComponent,
            footer_component_1.FooterComponent,
            home_component_1.HomeComponent,
            explorer_component_1.ExplorerComponent,
            network_component_1.NetworkComponent,
            api_component_1.ApiComponent,
            about_component_1.AboutComponent,
            progress_component_1.ProgressComponent,
            blocks_component_1.BlocksComponent,
            block_component_1.BlockComponent,
            scroll_directive_1.ScrollDirective,
            ago_pipe_1.AgoPipe,
            timestamp_pipe_1.TimestampPipe,
            size_pipe_1.SizePipe,
            amount_1.AmountPipe,
            ticker_component_1.TickerComponent,
            transaction_component_1.TransactionComponent,
            search_component_1.SearchComponent,
            error_component_1.ErrorComponent,
            yes_pipe_1.YesPipe,
            address_component_1.AddressComponent,
            hubs_component_1.HubsComponent,
            setup_component_1.SetupComponent,
            identity_component_1.IdentityComponent,
            dashboard_component_1.DashboardComponent,
            gateway_component_1.GatewayComponent,
            apps_component_1.AppsComponent,
            requests_component_1.RequestsComponent,
            customers_component_1.CustomersComponent,
            message_component_1.MessageComponent,
            settings_component_1.SettingsComponent,
            messages_component_1.MessagesComponent,
            referral_component_1.ReferralComponent,
            signup_component_1.SignupComponent,
            values_component_1.ValuesComponent,
            state_component_1.StateComponent,
            vaults_component_1.VaultsComponent
        ],
        imports: [
            platform_browser_1.BrowserModule,
            // BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
            http_1.HttpClientModule,
            forms_1.FormsModule,
            app_routing_module_1.AppRoutingModule,
            // RouterModule.forRoot(routes, {
            //   // onSameUrlNavigation: 'reload'
            // }),
            animations_1.BrowserAnimationsModule,
            checkbox_1.MatCheckboxModule,
            input_1.MatInputModule,
            button_1.MatButtonModule,
            select_1.MatSelectModule,
            radio_1.MatRadioModule,
            card_1.MatCardModule,
            forms_1.ReactiveFormsModule,
            layout_1.LayoutModule,
            toolbar_1.MatToolbarModule,
            sidenav_1.MatSidenavModule,
            icon_1.MatIconModule,
            list_1.MatListModule,
            grid_list_1.MatGridListModule,
            menu_1.MatMenuModule,
            tree_1.MatTreeModule,
            badge_1.MatBadgeModule,
            tabs_1.MatTabsModule,
            tooltip_1.MatTooltipModule,
            expansion_1.MatExpansionModule,
            table_1.MatTableModule
        ],
        exports: [
            scroll_directive_1.ScrollDirective,
        ],
        providers: [],
        bootstrap: [app_component_1.AppComponent]
    })
], AppModule);
exports.AppModule = AppModule;
