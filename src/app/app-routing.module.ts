import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'edicion/:id',
    loadChildren: () => import('./pages/edicion/edicion.module').then( m => m.EdicionPageModule)
  },
  {
    path: 'cotizaciones/:id',
    loadChildren: () => import('./pages/cotizaciones/cotizaciones.module').then( m => m.CotizacionesPageModule)
  },
  {
    path: 'graficos',
    loadChildren: () => import('./pages/graficos/graficos.module').then( m => m.GraficosPageModule)
  },
  {
    path: 'valor/:id/:id2',
    loadChildren: () => import('./pages/valor/valor.module').then( m => m.ValorPageModule)
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
