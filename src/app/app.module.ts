import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UnauthorizedInterceptor } from './infrastructure/interceptors/unauthorized.interceptor';
import { ServerErrorInterceptor } from './infrastructure/interceptors/server-error.interceptor';
import { MyPreloadingStrategy } from './app-routing.preloading';
import { AppComponent } from './app.component';
import { StoreModule } from '@ngrx/store';
import { Store as rdxStore } from './infrastructure/redux/store';
import { AccesscontrolModule } from './presentation/accesscontrol/accesscontrol.module';
import { LayoutModule } from './presentation/layout/layout.module';
import { MaterialModule } from './domain/shared/material.module';
import { getSpanishPaginatorIntl } from './domain/shared/components/tables/translate.paginator';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { MAT_DATE_LOCALE } from '@angular/material/core';
@NgModule({
  declarations: [AppComponent],
  imports: [
    RouterModule.forRoot([], {
      preloadingStrategy: MyPreloadingStrategy,
    }),
    StoreModule.forRoot(rdxStore),
    BrowserAnimationsModule,
    AccesscontrolModule,
    HttpClientModule,
    MaterialModule,
    LayoutModule,
  ],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    { provide: HTTP_INTERCEPTORS, useClass: UnauthorizedInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ServerErrorInterceptor, multi: true },
    { provide: MatPaginatorIntl, useValue: getSpanishPaginatorIntl() },
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
