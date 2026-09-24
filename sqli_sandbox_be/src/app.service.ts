import { Injectable } from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import * as mysql from 'mysql2/promise';

@Injectable()
export class AppService {
  private pool: mysql.Pool;


  constructor(private configService: ConfigService) {
    this.pool = mysql.createPool({
      host: this.configService.get<string>('DB_HOST'),
      user: this.configService.get<string>('DB_USER'),
      password: this.configService.get<string>('DB_PASSWORD'),
      database: this.configService.get<string>('DB_NAME'),
      multipleStatements: true, // isso aqui permite que os coleguinhas façam queries no select component p dropar tables e tals
    });
  }

  async searchUsers(username: string): Promise<any> {
    const query = `SELECT uuid, username, isAdmin FROM users WHERE username='${username}'`;

    try {
      const [rows] = await this.pool.query(query);
      return {success : true, query, data: rows}
    }
    catch(error) {
      if(error instanceof Error){
        return { success: false, query, error: error?.message};
      }
      return { success: false, query, error: String(error)};
    }
  }

  async getCourses(category?: string): Promise<any>{
    let query = `SELECT * FROM courses WHERE deletedAt is NULL`;

    if (category){
      query += ` AND name LIKE '%${category}%'`;
    }

    try {
      const [rows] = await this.pool.query(query);
      return {success: true,query: query,data: rows};
    } catch(error: any){
      return {success: false, query:query, error: error.message};
    }
  }

  async updateCourse(uuid: string, name: string, description:string, price:number): Promise<any> {
    // Deixando essa bomba aqui exposta pra um caba malegno fazer besteira
    const query = `update courses set name='${name}', description='${description}', price='${price}' where uuid='${uuid}'`;

    try{
      const [result] = await this.pool.query(query);
      return {success: true, query, data: result};
    } catch (error:any) { return {success: false, query, error: error.message};

    }
  }

  async deleteCourse(uuid: string): Promise<any>{
    const query= `delete from courses where uuid='${uuid}'`;

    try {
      const [result] = await this.pool.query(query);
      return {
        success: true,
        query,
        data: result
      };
    } catch (error:any){
      return {success: false, query, error: error.message};
    }
  }
}
