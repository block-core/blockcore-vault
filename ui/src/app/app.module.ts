import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { ScrollDirective } from './shared/scroll.directive';
import { AgoPipe } from './shared/ago.pipe';
import { TimestampPipe } from './shared/timestamp.pipe';
import { SizePipe } from './shared/size.pipe';
import { AmountPipe } from './shared/amount';
import { ErrorComponent } from './error/error.component';
import { YesPipe } from './shared/yes.pipe';
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
import { MatTreeModule } from '@angular/material/tree';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SettingsComponent } from './settings/settings.component';
import { VaultsComponent } from './vaults/vaults.component';
import { MatStepperModule } from '@angular/material/stepper';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AccountComponent } from './setup/account/account.component';
import { ConnectComponent } from './connect/connect.component';
import { AuthGuardService } from './services/auth-guard.service';
import { MatChipsModule } from '@angular/material/chips';
import { IdentitiesComponent } from './identities/identities.component';
import { EventsComponent } from './events/events.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { EventComponent } from './event/event.component';
import { ServersComponent } from './servers/servers.component';
import { ServerViewComponent } from './servers/view/server-view.component';
import { ServerEditComponent } from './servers/edit/server-edit.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AboutComponent,
    ScrollDirective,
    AgoPipe,
    TimestampPipe,
    SizePipe,
    AmountPipe,
    ErrorComponent,
    YesPipe,
    HubsComponent,
    SetupComponent,
    IdentityComponent,
    DashboardComponent,
    SettingsComponent,
    VaultsComponent,
    AccountComponent,
    ConnectComponent,
    IdentitiesComponent,
    EventsComponent,
    EventComponent,
    ServersComponent,
    ServerViewComponent,
    ServerEditComponent
  ],
  imports: [
    BrowserModule,
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
    MatProgressSpinnerModule,
    MatChipsModule,
    MatPaginatorModule
  ],
  exports: [
    ScrollDirective,
  ],
  providers: [AuthGuardService],
  bootstrap: [AppComponent]
})
export class AppModule { }
