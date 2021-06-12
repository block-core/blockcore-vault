import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { ExplorerComponent } from './explorer/explorer.component';
import { AboutComponent } from './about/about.component';
import { NetworkComponent } from './network/network.component';
import { ApiComponent } from './api/api.component';
import { FooterComponent } from './footer/footer.component';
import { ProgressComponent } from './progress/progress.component';
import { BlocksComponent } from './explorer/blocks/blocks.component';
import { BlockComponent } from './explorer/block/block.component';
import { ScrollDirective } from './shared/scroll.directive';
import { AgoPipe } from './shared/ago.pipe';
import { TimestampPipe } from './shared/timestamp.pipe';
import { SizePipe } from './shared/size.pipe';
import { TickerComponent } from './ticker/ticker.component';
import { LoadingResolverService } from './shared/loading.resolver';
import { TransactionComponent } from './explorer/transaction/transaction.component';
import { AmountPipe } from './shared/amount';
import { SearchComponent } from './search/search.component';
import { ErrorComponent } from './error/error.component';
import { YesPipe } from './shared/yes.pipe';
import { AddressComponent } from './explorer/address/address.component';
import { HubsComponent } from './hubs/hubs.component';
import { SetupComponent } from './setup/setup.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IdentityComponent } from './identity/identity.component';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatMenuModule } from '@angular/material/menu';
import { GatewayComponent } from './gateway/gateway.component';
import { MatTreeModule } from '@angular/material/tree';
import { MatBadgeModule } from '@angular/material/badge';
import { AppsComponent } from './apps/apps.component';
import { MatTabsModule } from '@angular/material/tabs';
import { RequestsComponent } from './requests/requests.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MessageComponent } from './message/message.component';
import { MessagesComponent } from './messages/messages.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTableModule } from '@angular/material/table';
import { CustomersComponent } from './customers/customers.component';
import { ReferralComponent } from './referral/referral.component';
import { SignupComponent } from './signup/signup.component';
import { ValuesComponent } from './values/values.component';
import { StateComponent } from './state/state.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SettingsComponent } from './settings/settings.component';
import { VaultsComponent } from './vaults/vaults.component';


const routes: Routes = [
  {
    path: '', component: HomeComponent, pathMatch: 'full', resolve: {
      chain: LoadingResolverService
    }
  },
  {
    path: 'settings', component: SettingsComponent, resolve: {
      chain: LoadingResolverService
    }
  },
  {
    path: 'setup', component: SetupComponent, resolve: {
      chain: LoadingResolverService
    }
  },
  {
    path: 'dashboard', component: DashboardComponent, resolve: {
      chain: LoadingResolverService
    }
  },
  {
    path: 'vaults', component: VaultsComponent, resolve: {
      chain: LoadingResolverService
    }
  },
  {
    path: 'apps', component: AppsComponent, resolve: {
      chain: LoadingResolverService
    }
  },
  {
    path: 'gateway', component: GatewayComponent, resolve: {
      chain: LoadingResolverService
    }
  },
  {
    path: 'hubs', component: HubsComponent, resolve: {
      chain: LoadingResolverService
    }
  },
  {
    path: 'requests', component: RequestsComponent, resolve: {
      chain: LoadingResolverService
    }
  },
  {
    path: 'message', component: MessageComponent, resolve: {
      chain: LoadingResolverService
    }
  },
  {
    path: 'messages', component: MessagesComponent, resolve: {
      chain: LoadingResolverService
    }
  },
  {
    path: 'referral', component: ReferralComponent, resolve: {
      chain: LoadingResolverService
    }
  },
  {
    path: 'customers', component: CustomersComponent, resolve: {
      chain: LoadingResolverService
    }
  },
  {
    path: 'identities', component: CustomersComponent, resolve: {
      chain: LoadingResolverService
    }
  },
  {
    path: 'values', component: ValuesComponent, resolve: {
      chain: LoadingResolverService
    }
  },
  {
    path: 'state', component: StateComponent, resolve: {
      chain: LoadingResolverService
    }
  },
  {
    path: 'signup', component: SignupComponent, resolve: {
      chain: LoadingResolverService
    }
  },
  {
    path: 'identity', component: IdentityComponent, resolve: {
      chain: LoadingResolverService
    }
  },
  {
    path: ':chain', component: TickerComponent, resolve: {
      chain: LoadingResolverService
    }
  },
  {
    path: ':chain/hubs', component: HubsComponent, resolve: {
      chain: LoadingResolverService
    }
  },
  {
    path: ':chain/explorer', component: ExplorerComponent, resolve: {
      chain: LoadingResolverService
    }
  },
  {
    path: ':chain/explorer/blocks', component: BlocksComponent, resolve: {
      chain: LoadingResolverService
    }
  },
  {
    path: ':chain/explorer/block/:block', component: BlockComponent, resolve: {
      chain: LoadingResolverService
    }
  },
  {
    path: ':chain/explorer/transaction/:transaction', component: TransactionComponent, resolve: {
      chain: LoadingResolverService
    }
  },
  {
    path: ':chain/explorer/address/:address', component: AddressComponent, resolve: {
      chain: LoadingResolverService
    }
  },
  {
    path: ':chain/network', component: NetworkComponent, resolve: {
      chain: LoadingResolverService
    }
  },
  {
    path: ':chain/api', component: ApiComponent, resolve: {
      chain: LoadingResolverService
    }
  },
  {
    path: ':chain/about', component: AboutComponent, resolve: {
      chain: LoadingResolverService
    }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
