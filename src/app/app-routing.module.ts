import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DummyComponent, SwapiComponent } from './components';
import { SwapiResolver } from './resolvers';

const routes: Routes = [
  {
    path: '',
    component: DummyComponent,
    children: [
      {
        path: 'swapi',
        component: SwapiComponent,
        resolve: [SwapiResolver],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [SwapiResolver],
})
export class AppRoutingModule {}
