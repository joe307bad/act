import { DocumentInsertResponse, DocumentListResponse } from 'nano';
import { Injectable } from '@nestjs/common';
import { InjectRepository, Repository } from 'nest-couchdb';
import { Unit } from './unit.entity';

@Injectable()
export class UnitsService {
  constructor(
    @InjectRepository(Unit)
    private readonly unitRepo: Repository<Unit>
  ) {}

  findAll(): Promise<DocumentListResponse<Unit>> {
    return this.unitRepo.list();
  }

  getAllByType(type: string) {
    return this.unitRepo.find({ selector: { type: { $eq: type } } });
  }

  getCreatedAfterTimestamp(type: string, timestamp: number) {
    return this.unitRepo
      .find({
        selector: { type: { $eq: type }, created: { $gt: timestamp } }
      })
      .then((response) =>
        response.docs.map((d) => {
          // @ts-ignore
          d.id = d._id;
          delete d._id;
          delete d._rev;
          delete d.type;
          return d;
        })
      );
  }

  create(unit: any): Promise<DocumentInsertResponse> {
    return this.unitRepo.insert(unit);
  }
}
