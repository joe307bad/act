import {
  Controller,
  Get,
  Query,
  Post,
  Req,
  Body
} from '@nestjs/common';
import { UnitsService } from '../unit/unit.service';
import { SyncDatabaseChangeSet } from '@nozbe/watermelondb/sync';

@Controller()
export class AppController {
  constructor(private readonly unitService: UnitsService) {}

  @Get('/sync')
  async pullChanges(@Query() query: Record<string, string>) {
    const { last_pulled_at, tables } = query;
    const lastPulledAt =
      last_pulled_at === 'null' ? 0 : Number(last_pulled_at);

    const changes = await tables
      .split(',')
      .reduce<any[]>((acc, i) => {
        acc.push(i.replace(/[^A-Za-z0-9]/g, ''));
        return acc;
      }, [])
      .reduce<Promise<any>>(async (acc, unitType) => {
        const a = await acc;
        a[unitType] = {
          created: await this.unitService.getCreatedAfterTimestamp(
            unitType,
            lastPulledAt
          ),
          updated: [],
          deleted: []
        };

        return a;
      }, Promise.resolve({}));

    const now = Date.now();

    return {
      changes,
      timestamp: now
    };
  }

  @Post('/sync')
  pushChanges(
    @Body() changes: SyncDatabaseChangeSet,
    @Query() query: Record<string, any>
  ) {
    const { last_pulled_at } = query;
    for (const table in changes) {
      for (const changeType in changes[table]) {
        switch (changeType) {
          case 'created':
            // TODO change this to a createMany
            changes[table][changeType].forEach((unit) => {
              delete unit._status;
              delete unit._changed;
              unit._id = unit.id;
              delete unit.id;
              this.unitService.create({ type: table, ...unit });
            });
        }
      }
    }
    return 'sync endpoint';
  }
}
