import { Controller, Get, Post } from '@nestjs/common';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getData() {
    return this.appService.getData();
  }

  @Get("/sync")
  pullChanges() {
    return "sync endpoint";
  }

  @Post("/sync")
  pushChanges() {
    return "sync endpoint";
  }
}
