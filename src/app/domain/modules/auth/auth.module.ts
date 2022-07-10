import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/domain/shared/shared.module';
import { AuthRoutingModule } from './auth-routing.module';
import { Login } from './login/login.component';

@NgModule({
  declarations: [Login],
  imports: [SharedModule, AuthRoutingModule],
})
export class AuthModule {}
