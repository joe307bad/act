import { Controller, Get, Query, Post, Req, Body } from '@nestjs/common';
import { UnitsService, UnitType } from '../unit/unit.service';
import { SyncDatabaseChangeSet } from '@nozbe/watermelondb/sync';

import { AppService } from './app.service';

type Changes = { [key in UnitType]: any };

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly unitService: UnitsService
  ) {}

  @Get()
  getData() {
    return this.appService.getData();
  }

  @Get("/sync")
  async pullChanges(@Query() query: Record<string, any>) {
    const { last_pulled_at, migration, schema_version } = query;
    const lastPulledAt = last_pulled_at === "null" ? 0 : Number(last_pulled_at);

    const changes = await Object.keys(UnitType).reduce<Promise<Changes>>(async (acc, unitType) => {
      const a = await acc;
      a[unitType] = {
        created: await this.unitService.getCreatedAfterTimestamp(unitType as UnitType, lastPulledAt),
        updated: [],
        deleted: []
      };

      return a;
    }, Promise.resolve({} as Changes));

    delete changes.achievement;
    delete changes.checkin;

    return {
      changes,
      timestamp: lastPulledAt === 0 ? Date.now() : lastPulledAt
    };
  }

  @Post("/sync")
  pushChanges(@Body() changes: SyncDatabaseChangeSet, @Query() query: Record<string, any>) {
    const { last_pulled_at } = query;
    for (const table in changes) {
      for(const changeType in changes[table]) {
        switch(changeType){
          case 'created':
            // TODO change this to a createMany
            changes[table][changeType].forEach(unit => {
              delete unit._status;
              delete unit._changed;
              unit._id = unit.id
              delete unit.id;
              this.unitService.create({type: table, ...unit})
            })
        }
      }
    }
    return "sync endpoint";
  }
}