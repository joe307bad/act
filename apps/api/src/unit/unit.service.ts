import { DocumentInsertResponse, DocumentListResponse } from 'nano';
import { Injectable } from '@nestjs/common';
import { InjectRepository, Repository } from 'nest-couchdb';
import { Unit } from './unit.entity';
import { DirtyRaw } from '@nozbe/watermelondb';

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
    return this.unitRepo.find({
      selector: { type: { $eq: type } },
      limit: 1000
    });
  }

  findById(id: string): Promise<DirtyRaw> {
    return this.unitRepo
      .find({ selector: { _id: { $eq: id } } })
      .then((response) => response[0]);
  }

  getCreatedAfterTimestamp(type: string, timestamp: number) {
    return this.unitRepo
      .find({
        selector: {
          type: { $eq: type },
          created_on_server: { $gt: timestamp },
          deleted: { $or: [{ $eq: false }, { $exists: false }] }
        },
        limit: 1000
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

  getDeletedByType(type: string) {
    return this.unitRepo
      .find({
        selector: {
          type: { $eq: type },
          deleted: { $eq: true }
        },
        limit: 1000
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

  getDeletedAfterTimestamp(type: string, timestamp: number) {
    return this.unitRepo
      .find({
        selector: {
          type: { $eq: type },
          created_on_server: { $gt: timestamp }
        },
        limit: 1000
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

  async getUpdatedAfterTimestamp(
    type: string,
    timestamp: number,
    created: any[]
  ) {
    const c = created.map((c) => c.id);
    const b = await this.unitRepo
      .find({
        selector: {
          type: { $eq: type },
          _id: { $nin: c },
          deleted: { $eq: false },
          updated_on_server: { $gt: timestamp }
        },
        limit: 1000
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

    return b;
  }

  create(unit: any): Promise<DocumentInsertResponse> {
    return this.unitRepo.insert(unit);
  }

  async update(unit: any): Promise<DocumentInsertResponse> {
    const existingUnit = await this.unitRepo
      .get(unit._id)
      .catch((e) => false);

    return this.unitRepo.insert({
      // @ts-ignore
      ...(existingUnit !== false ? existingUnit : {}),
      ...unit
    });
  }
}
