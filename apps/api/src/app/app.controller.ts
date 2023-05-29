import {
  Controller,
  Get,
  Query,
  Post,
  Req,
  Body,
  Res,
  HttpException,
  HttpStatus
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
    try {
      const deleted = (
        await this.unitService.getCreatedAfterTimestamp(
          'deleted',
          lastPulledAt
        )
      ).map((u: any) => u.deleted_id);

      // TODO should we have a table type that consumes this
      // tables var and creates units of type table and then
      // every other units type is the id of one of these "table units"

      const changes = await tables
        .split(',')
        .reduce<any[]>((acc, i) => {
          acc.push(i.replace(/[^A-Za-z0-9_]/g, ''));
          return acc;
        }, [])
        .reduce<Promise<any>>(async (acc, unitType) => {
          const a = await acc;
          const created =
            await this.unitService.getCreatedAfterTimestamp(
              unitType,
              lastPulledAt
            );

          const deletedFromThisTable =
            await this.unitService.getDeletedByType(unitType);

          a[unitType] = {
            created,
            updated: await this.unitService.getUpdatedAfterTimestamp(
              unitType,
              lastPulledAt,
              created
            ),
            deleted: deletedFromThisTable
              .filter((u: any) => deleted.some((d) => d === u.id))
              .map((d: any) => d.id)
          };

          return a;
        }, Promise.resolve({}));

      const now = Date.now();

      return {
        changes,
        timestamp: now
      };
    } catch (e) {
      throw new HttpException(
        `Pull Changes Failed: ${e.toString()}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post('/sync')
  pushChanges(
    @Body() changes: SyncDatabaseChangeSet,
    @Query() query: Record<string, any>
  ) {
    // TODO does this need to be used? lol
    let { last_pulled_at } = query;
    last_pulled_at = Number(last_pulled_at);
    try {
      for (const table in changes) {
        for (const changeType in changes[table]) {
          switch (changeType) {
            case 'created':
              // TODO change this to a createMany
              changes[table][changeType].forEach((unit) => {
                delete unit._status;
                delete unit._changed;
                unit._id = unit.id;
                unit.created_on_server = last_pulled_at;
                delete unit.id;
                this.unitService
                  .create({ type: table, ...unit })
                  .catch((e) => {
                    console.error(
                      new HttpException(
                        `Push Changes Failed: ${e.toString()}`,
                        HttpStatus.INTERNAL_SERVER_ERROR
                      )
                    );
                  });
              });
              break;
            case 'updated':
              // TODO change this to a updateMany
              changes[table][changeType].forEach((unit) => {
                delete unit._status;
                delete unit._changed;
                unit._id = unit.id;
                unit.updated_on_server = last_pulled_at;
                delete unit.id;
                this.unitService
                  .update({ type: table, ...unit })
                  .catch((e) => {
                    throw new HttpException(
                      `Push Changes Failed: ${e.toString()}`,
                      HttpStatus.INTERNAL_SERVER_ERROR
                    );
                  });
              });
              break;
            case 'deleted':
              changes[table][changeType].forEach(async (id) => {
                // with this method, if a user edits a unit on the front end
                // then deletes that unit, then syncs, we lose the most recent edit
                // since watermelondb discards the edits if the record is marked
                // for deletion
                this.unitService
                  .update({
                    type: table,
                    ...{
                      _id: id,
                      deleted: true
                    }
                  })
                  .catch((e) => {
                    throw new HttpException(
                      `Push Changes Failed: ${e.toString()}`,
                      HttpStatus.INTERNAL_SERVER_ERROR
                    );
                  });
              });
              break;
          }
        }
      }
      return 'Push Changes success';
    } catch (e) {
      throw new HttpException(
        `Push Changes Failed: ${e.toString()}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
