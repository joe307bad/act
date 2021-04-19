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
    const inserted = this.unitService.create();
    return {
      changes: {},
      timestamp: 10000
    };
  }

  @Post("/sync")
  pushChanges(@Body() changes: SyncDatabaseChangeSet, @Query() query: Record<string, any>) {
    const { last_pulled_at } = query;
    return "sync endpoint";
  }
}