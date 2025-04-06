import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtNestService {
  constructor(
    private jwtService: JwtService,
  ) {}

  /**
   * Sign the payload with the JWT secret and expiry
   * @param payload the object payload to be signed
   * @returns the signed JWT token
   */
   async sign(payload: object): Promise<string> {
    return  this.jwtService.sign(payload)
  }
}
