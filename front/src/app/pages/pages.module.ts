import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';

import { PagesRoutingModule } from './pages-routing.module';
import { ProfilsComponent } from './profils/profils.component';

const COMPONENTS = [ProfilsComponent];
const COMPONENTS_DYNAMIC = [];

@NgModule({
  imports: [
    SharedModule,
    PagesRoutingModule,
  ],
  declarations: [...COMPONENTS, ...COMPONENTS_DYNAMIC],
  entryComponents: COMPONENTS_DYNAMIC,
})
export class PagesModule {}
