import { DocumentInsertResponse, DocumentListResponse } from 'nano';
import { Injectable } from '@nestjs/common';
import { InjectRepository, Repository } from 'nest-couchdb';
import { Unit } from './unit.entity';

type UnitType = 'achievement' | 'checkin';

@Injectable()
export class UnitsService {
  constructor(
    @InjectRepository(Unit)
    private readonly unitRepo: Repository<Unit>,
  ) {}

  findAll(): Promise<DocumentListResponse<Unit>> {
    return this.unitRepo.list();
  }

  create(): Promise<DocumentInsertResponse> {
    const types = ['achievement', 'checkin'];
    const randomType = types[Math.floor(Math.random() * types.length)];
    return this.unitRepo.insert({type: randomType as UnitType})
  }
}