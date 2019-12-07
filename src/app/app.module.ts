import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DummyComponent, SwapiComponent } from './components';
import {
  BrowserStateInterceptor,
  memoryCacheFactory,
  MEMORY_CACHE_TOKEN,
  ServerStateInterceptor,
} from './interceptors';

@NgModule({
  declarations: [AppComponent, DummyComponent, SwapiComponent],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    HttpClientModule,
    BrowserTransferStateModule,
    AppRoutingModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: BrowserStateInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ServerStateInterceptor,
      multi: true,
    },
    {
      provide: MEMORY_CACHE_TOKEN,
      useFactory: memoryCacheFactory,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
