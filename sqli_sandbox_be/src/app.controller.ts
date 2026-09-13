import { Controller, Get, Query, Put, Delete, Param, Body } from '@nestjs/common';
import { AppService } from './app.service.js';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('users')
  async getUsers(@Query('username') username : string) {
    if (!username){
      return {message: 'Please provide a username query parameter.'}
    }
    return this.appService.searchUsers(username);
  }

  @Put('courses/:uuid')
  async updateCourse(
    @Param('uuid') uuid: string,
    @Body() body: {name: string; description: string; price: number}
  ){
    return this.appService.updateCourse(uuid, body.name, body.description, body.price);
  }

  // GET all courses - THIS IS THE ROUTE THAT WAS MISSING OR FAILING
  @Get('courses')
  async getCourses() {
    return this.appService.getCourses();
  }

  @Delete('courses/:uuid')
  async deleteCourse(@Param('uuid') uuid:string){
    return this.appService.deleteCourse(uuid);
  }


}





