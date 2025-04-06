import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ROLE_KEY } from './role.decorator';

@Injectable()
export class RoleCheckGuard implements CanActivate {
    constructor(private reflector:Reflector){}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const {user} = request;
    const permissionRoles = this.reflector.get(ROLE_KEY,context.getHandler());
   
    if(!permissionRoles.includes(user.role)){
        throw new UnauthorizedException("Permission denied")
    }
    return true
  }
}