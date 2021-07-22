import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
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
import {MatExpansionModule} from '@angular/material/expansion';
import {MatTableModule} from '@angular/material/table';
import { CustomersComponent } from './customers/customers.component';
import { ReferralComponent } from './referral/referral.component';
import { SignupComponent } from './signup/signup.component';
import { ValuesComponent } from './values/values.component';
import { StateComponent } from './state/state.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SettingsComponent } from './settings/settings.component';
import { VaultsComponent } from './vaults/vaults.component';
import { MatStepperModule } from '@angular/material/stepper';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AccountComponent } from './setup/account/account.component';
import { VaultAddComponent } from './vaults/add/add.component';
import { ConnectComponent } from './connect/connect.component';
import { AuthGuardService } from './services/auth-guard.service';



@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    FooterComponent,
    HomeComponent,
    ExplorerComponent,
    NetworkComponent,
    ApiComponent,
    AboutComponent,
    ProgressComponent,
    BlocksComponent,
    BlockComponent,
    ScrollDirective,
    AgoPipe,
    TimestampPipe,
    SizePipe,
    AmountPipe,
    TransactionComponent,
    SearchComponent,
    ErrorComponent,
    YesPipe,
    AddressComponent,
    HubsComponent,
    SetupComponent,
    IdentityComponent,
    DashboardComponent,
    GatewayComponent,
    AppsComponent,
    RequestsComponent,
    CustomersComponent,
    MessageComponent,
    SettingsComponent,
    MessagesComponent,
    ReferralComponent,
    SignupComponent,
    ValuesComponent,
    StateComponent,
    VaultsComponent,
    VaultAddComponent,
    AccountComponent,
    ConnectComponent
  ],
  imports: [
    BrowserModule,
    // BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    // RouterModule.forRoot(routes, {
    //   // onSameUrlNavigation: 'reload'
    // }),
    BrowserAnimationsModule,
    MatCheckboxModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatRadioModule,
    MatCardModule,
    ReactiveFormsModule,
    LayoutModule,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatGridListModule,
    MatMenuModule,
    MatTreeModule,
    MatBadgeModule,
    MatTabsModule,
    MatTooltipModule,
    MatExpansionModule,
    MatTableModule,
    MatStepperModule,
    MatProgressSpinnerModule
  ],
  exports: [
    ScrollDirective,
  ],
  providers: [AuthGuardService],
  bootstrap: [AppComponent]
})
export class AppModule { }
