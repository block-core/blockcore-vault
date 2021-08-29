import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { LoadingResolverService } from './shared/loading.resolver';
import { SetupComponent } from './setup/setup.component';
import { IdentityComponent } from './identity/identity.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SettingsComponent } from './settings/settings.component';
import { VaultsComponent } from './vaults/vaults.component';
import { AccountComponent } from './setup/account/account.component';
import { ConnectComponent } from './connect/connect.component';
import { AuthGuardService as AuthGuard } from './services/auth-guard.service';
import { LogoutComponent } from './logout/logout.component';
import { HelpComponent } from './help/help.component';
import { EventsComponent } from './events/events.component';
import { IdentitiesComponent } from './identities/identities.component';
import { EventComponent } from './event/event.component';
import { ServersComponent } from './servers/servers.component';
import { ServerViewComponent } from './servers/view/server-view.component';
import { ServerEditComponent } from './servers/edit/server-edit.component';

const routes: Routes = [
  {
    path: '', component: HomeComponent, pathMatch: 'full', resolve: {
      chain: LoadingResolverService
    }
  },
  {
    path: 'settings', component: SettingsComponent, resolve: {
      chain: LoadingResolverService
    }, canActivate: [AuthGuard]
  },
  {
    path: 'identity/:id', component: IdentityComponent, resolve: {
      chain: LoadingResolverService
    }, canActivate: [AuthGuard]
  },
  {
    path: 'events', component: EventsComponent, resolve: {
      chain: LoadingResolverService,
    }, canActivate: [AuthGuard]
  },
  {
    path: 'events/:id/:type/:operation/:sequence', component: EventComponent, resolve: {
      chain: LoadingResolverService,
    }, canActivate: [AuthGuard]
  },
  {
    path: 'identities', component: IdentitiesComponent, resolve: {
      chain: LoadingResolverService,
    }, canActivate: [AuthGuard]
  },
  {
    path: 'setup', component: SetupComponent, resolve: {
      chain: LoadingResolverService,
    }, canActivate: [AuthGuard]
  },
  {
    path: 'setup/account', component: AccountComponent, resolve: {
      chain: LoadingResolverService
    }, canActivate: [AuthGuard]
  },
  {
    path: 'dashboard', component: DashboardComponent, resolve: {
      chain: LoadingResolverService
    }, canActivate: [AuthGuard]
  },
  {
    path: 'vaults', component: VaultsComponent, resolve: {
      chain: LoadingResolverService
    }, canActivate: [AuthGuard]
  },
  {
    path: 'servers', component: ServersComponent, resolve: {
      chain: LoadingResolverService
    }, canActivate: [AuthGuard]
  },
  {
    path: 'servers/view/:id', component: ServerViewComponent, resolve: {
      chain: LoadingResolverService
    }, canActivate: [AuthGuard]
  },
  {
    path: 'servers/edit/:id', component: ServerEditComponent, resolve: {
      chain: LoadingResolverService
    }, canActivate: [AuthGuard]
  },
  {
    path: 'logout', component: LogoutComponent, resolve: {
      chain: LoadingResolverService
    }
  },
  {
    path: 'connect', component: ConnectComponent, resolve: {
      chain: LoadingResolverService
    }
  },
  {
    path: 'connect/:id', component: ConnectComponent, resolve: {
      chain: LoadingResolverService
    }
  },
  {
    path: 'about', component: AboutComponent, resolve: {
      chain: LoadingResolverService
    }, canActivate: [AuthGuard]
  },
  {
    path: 'help', component: HelpComponent, resolve: {
      chain: LoadingResolverService
    }, canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
