import { Injectable } from '@nestjs/common';
import { BaseDataService } from './base.data.service';

@Injectable()
export class UserDataService extends BaseDataService {
  constructor() {
    super();
  }
}
