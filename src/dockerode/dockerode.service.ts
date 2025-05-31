import { Injectable } from '@nestjs/common';
import * as Docker from 'dockerode';

@Injectable()
export class DockerodeService {
  private docker: Docker;

  constructor() {
    this.docker = new Docker();
  }

  getInstance() {
    return this.docker;
  }
}
