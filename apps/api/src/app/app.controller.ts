import { Controller, Get, Query, Post, Req, Body } from '@nestjs/common';
import { UnitsService } from '../unit/unit.service';
import { SyncDatabaseChangeSet } from '@nozbe/watermelondb/sync';

import { AppService } from './app.service';

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
  pullChanges(@Query() query: Record<string, any>) {
    const { last_pulled_at, migration, schema_version } = query;
    return {
      changes: {},
      timestamp: 10000
    };
  }

  @Post("/sync")
  pushChanges(@Body() changes: SyncDatabaseChangeSet, @Query() query: Record<string, any>) {
    const { last_pulled_at } = query;
    for (const table in changes) {
      for(const changeType in changes[table]) {
        switch(changeType){
          case 'created':
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