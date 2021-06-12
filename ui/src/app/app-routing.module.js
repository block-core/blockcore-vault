"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppRoutingModule = void 0;
const core_1 = require("@angular/core");
const router_1 = require("@angular/router");
const home_component_1 = require("./home/home.component");
const explorer_component_1 = require("./explorer/explorer.component");
const about_component_1 = require("./about/about.component");
const network_component_1 = require("./network/network.component");
const api_component_1 = require("./api/api.component");
const blocks_component_1 = require("./explorer/blocks/blocks.component");
const block_component_1 = require("./explorer/block/block.component");
const ticker_component_1 = require("./ticker/ticker.component");
const loading_resolver_1 = require("./shared/loading.resolver");
const transaction_component_1 = require("./explorer/transaction/transaction.component");
const address_component_1 = require("./explorer/address/address.component");
const hubs_component_1 = require("./hubs/hubs.component");
const setup_component_1 = require("./setup/setup.component");
const identity_component_1 = require("./identity/identity.component");
const dashboard_component_1 = require("./dashboard/dashboard.component");
const gateway_component_1 = require("./gateway/gateway.component");
const apps_component_1 = require("./apps/apps.component");
const requests_component_1 = require("./requests/requests.component");
const message_component_1 = require("./message/message.component");
const messages_component_1 = require("./messages/messages.component");
const customers_component_1 = require("./customers/customers.component");
const referral_component_1 = require("./referral/referral.component");
const signup_component_1 = require("./signup/signup.component");
const values_component_1 = require("./values/values.component");
const state_component_1 = require("./state/state.component");
const settings_component_1 = require("./settings/settings.component");
const vaults_component_1 = require("./vaults/vaults.component");
const routes = [
    {
        path: '', component: home_component_1.HomeComponent, pathMatch: 'full', resolve: {
            chain: loading_resolver_1.LoadingResolverService
        }
    },
    {
        path: 'settings', component: settings_component_1.SettingsComponent, resolve: {
            chain: loading_resolver_1.LoadingResolverService
        }
    },
    {
        path: 'setup', component: setup_component_1.SetupComponent, resolve: {
            chain: loading_resolver_1.LoadingResolverService
        }
    },
    {
        path: 'dashboard', component: dashboard_component_1.DashboardComponent, resolve: {
            chain: loading_resolver_1.LoadingResolverService
        }
    },
    {
        path: 'vaults', component: vaults_component_1.VaultsComponent, resolve: {
            chain: loading_resolver_1.LoadingResolverService
        }
    },
    {
        path: 'apps', component: apps_component_1.AppsComponent, resolve: {
            chain: loading_resolver_1.LoadingResolverService
        }
    },
    {
        path: 'gateway', component: gateway_component_1.GatewayComponent, resolve: {
            chain: loading_resolver_1.LoadingResolverService
        }
    },
    {
        path: 'hubs', component: hubs_component_1.HubsComponent, resolve: {
            chain: loading_resolver_1.LoadingResolverService
        }
    },
    {
        path: 'requests', component: requests_component_1.RequestsComponent, resolve: {
            chain: loading_resolver_1.LoadingResolverService
        }
    },
    {
        path: 'message', component: message_component_1.MessageComponent, resolve: {
            chain: loading_resolver_1.LoadingResolverService
        }
    },
    {
        path: 'messages', component: messages_component_1.MessagesComponent, resolve: {
            chain: loading_resolver_1.LoadingResolverService
        }
    },
    {
        path: 'referral', component: referral_component_1.ReferralComponent, resolve: {
            chain: loading_resolver_1.LoadingResolverService
        }
    },
    {
        path: 'customers', component: customers_component_1.CustomersComponent, resolve: {
            chain: loading_resolver_1.LoadingResolverService
        }
    },
    {
        path: 'identities', component: customers_component_1.CustomersComponent, resolve: {
            chain: loading_resolver_1.LoadingResolverService
        }
    },
    {
        path: 'values', component: values_component_1.ValuesComponent, resolve: {
            chain: loading_resolver_1.LoadingResolverService
        }
    },
    {
        path: 'state', component: state_component_1.StateComponent, resolve: {
            chain: loading_resolver_1.LoadingResolverService
        }
    },
    {
        path: 'signup', component: signup_component_1.SignupComponent, resolve: {
            chain: loading_resolver_1.LoadingResolverService
        }
    },
    {
        path: 'identity', component: identity_component_1.IdentityComponent, resolve: {
            chain: loading_resolver_1.LoadingResolverService
        }
    },
    {
        path: ':chain', component: ticker_component_1.TickerComponent, resolve: {
            chain: loading_resolver_1.LoadingResolverService
        }
    },
    {
        path: ':chain/hubs', component: hubs_component_1.HubsComponent, resolve: {
            chain: loading_resolver_1.LoadingResolverService
        }
    },
    {
        path: ':chain/explorer', component: explorer_component_1.ExplorerComponent, resolve: {
            chain: loading_resolver_1.LoadingResolverService
        }
    },
    {
        path: ':chain/explorer/blocks', component: blocks_component_1.BlocksComponent, resolve: {
            chain: loading_resolver_1.LoadingResolverService
        }
    },
    {
        path: ':chain/explorer/block/:block', component: block_component_1.BlockComponent, resolve: {
            chain: loading_resolver_1.LoadingResolverService
        }
    },
    {
        path: ':chain/explorer/transaction/:transaction', component: transaction_component_1.TransactionComponent, resolve: {
            chain: loading_resolver_1.LoadingResolverService
        }
    },
    {
        path: ':chain/explorer/address/:address', component: address_component_1.AddressComponent, resolve: {
            chain: loading_resolver_1.LoadingResolverService
        }
    },
    {
        path: ':chain/network', component: network_component_1.NetworkComponent, resolve: {
            chain: loading_resolver_1.LoadingResolverService
        }
    },
    {
        path: ':chain/api', component: api_component_1.ApiComponent, resolve: {
            chain: loading_resolver_1.LoadingResolverService
        }
    },
    {
        path: ':chain/about', component: about_component_1.AboutComponent, resolve: {
            chain: loading_resolver_1.LoadingResolverService
        }
    }
];
let AppRoutingModule = class AppRoutingModule {
};
AppRoutingModule = __decorate([
    core_1.NgModule({
        imports: [router_1.RouterModule.forRoot(routes)],
        exports: [router_1.RouterModule]
    })
], AppRoutingModule);
exports.AppRoutingModule = AppRoutingModule;
