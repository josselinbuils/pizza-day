import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { BsDropdownModule } from 'ngx-bootstrap';
import { TooltipModule } from 'ngx-bootstrap';
import { TabsModule } from 'ngx-bootstrap';

import { AppComponent } from './app.component';
import { AboutComponent } from './about/about.component';
import { AlertsComponent } from './shared/alerts/alerts.component';
import { LoadingComponent } from './shared/loading/loading.component';
import { SelectorComponent } from './shared/selector/selector.component';
import { UserPanelComponent } from './shared/user-panel/user-panel.component';
import { CreateAccountComponent } from './create-account/create-account.component';
import { EditAccountComponent } from './edit-account/edit-account.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { OrderPizzaComponent } from './order-pizza/order-pizza.component';
import { CreatePizzaDayComponent } from './create-pizza-day/create-pizza-day.component';
import { SortByPipe } from './shared/sort-by.pipe';
import { EditPizzaDayComponent } from './edit-pizza-day/edit-pizza-day.component';
import { PizzaDayListComponent } from './pizza-day-list/pizza-day-list.component';
import { AddPizzeriaComponent } from './add-pizzeria/add-pizzeria.component';
import { EditPizzeriaComponent } from './edit-pizzeria/edit-pizzeria.component';
import { PizzeriaListComponent } from './pizzeria-list/pizzeria-list.component';
import { AboutService } from './about/about.service';
import { PizzaService } from './shared/pizza.service';
import { UserService } from './shared/user.service';
import { DataService } from './shared/data.service';
import { HttpClientModule } from '@angular/common/http';

const appRoutes: Routes = [
  {path: 'notFound', component: NotFoundComponent},
  {path: 'dashboard', component: DashboardComponent},
  {path: 'about', component: AboutComponent},
  {path: 'addPizzeria', component: AddPizzeriaComponent},
  {path: 'createAccount', component: CreateAccountComponent},
  {path: 'createPizzaDay', component: CreatePizzaDayComponent},
  {path: 'editAccount/:id', component: EditAccountComponent},
  {path: 'editPizzaDay/:id', component: EditPizzaDayComponent},
  {path: 'editPizzeria/:id', component: EditPizzeriaComponent},
  {path: 'login', component: LoginComponent},
  {path: 'orderPizza/:pizzaDayId/:orderId', component: OrderPizzaComponent},
  {path: 'pizzerias', component: PizzeriaListComponent}
  // {path: '**', redirectTo: '/notFound'}
];

@NgModule({
  declarations: [
    AboutComponent,
    AddPizzeriaComponent,
    AlertsComponent,
    AppComponent,
    CreateAccountComponent,
    CreatePizzaDayComponent,
    DashboardComponent,
    EditAccountComponent,
    EditPizzaDayComponent,
    EditPizzeriaComponent,
    LoadingComponent,
    LoginComponent,
    NotFoundComponent,
    OrderPizzaComponent,
    PizzaDayListComponent,
    PizzeriaListComponent,
    SelectorComponent,
    SortByPipe,
    UserPanelComponent
  ],
  imports: [
    BrowserModule,
    BsDropdownModule.forRoot(),
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule.forRoot(appRoutes),
    TabsModule.forRoot(),
    TooltipModule.forRoot()
  ],
  providers: [
    AboutService,
    DataService,
    PizzaService,
    UserService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
