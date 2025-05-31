import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { DockerodeService } from 'src/dockerode/dockerode.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';

@Injectable()
export class ProjectService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly docker: DockerodeService,
  ) {}

  async getProjectDetails(user_id: string) {
    // Check if user exists or not
    const userExists = await this.prisma.user.findFirst({
      where: {
        user_id: user_id,
      },
    });

    if (!userExists) {
      throw new ForbiddenException('User does not exists in the database.');
    }

    // Get all the project Details
    const projectDetails = await this.prisma.project.findMany({
      where: {
        owner_id: user_id,
      },
      select: {
        project_id: true,
        name: true,
        dockerImage_id: true,
        dockerImage: {
          select: {
            languages: true,
          },
        },
      },
    });

    const response = {
      data: projectDetails,
      message: 'Data Fetched Successfully',
      success: 'Success',
    };

    return response;
  }

  async createProject(user_id: string, createProjectDto: CreateProjectDto) {
    // Check if image exists in DB
    const imageInDB = await this.prisma.dockerImage.findUnique({
      where: {
        dockerImage_id: createProjectDto.dockerImage_id,
      },
    });
    if (!imageInDB) {
      throw new ForbiddenException('Given template could not be found');
    }
    // Check if image exists in Docker
    const imageInDocker = await this.docker
      .getInstance()
      .getImage(imageInDB.name);
    if (!imageInDocker) {
      throw new ForbiddenException('Given template could not be found');
    }

    // Check if a project exists with user_id and the name given
    const existingProject = await this.prisma.project.findFirst({
      where: {
        owner_id: user_id,
        name: createProjectDto.project_name,
      },
    });
    if (existingProject) {
      throw new ForbiddenException(
        'A project already exists with the following name',
      );
    }

    // Create the docker container
    const dockerContainer = await this.docker.getInstance().createContainer({
      Image: imageInDB.name,
    });
    if (!dockerContainer) {
      throw new InternalServerErrorException('Container creation failed');
    }

    // Create the DB container
    const containerInDB = await this.prisma.container.create({
      data: {
        dockerImage_id: imageInDB.dockerImage_id,
        dockerContainer_id: dockerContainer.id,
        status: 'Paused',
      },
    });
    if (!containerInDB) {
      throw new InternalServerErrorException(
        'Internal Server Error at creation of container',
      );
    }

    // Create the DB project
    const projectInDB = await this.prisma.project.create({
      data: {
        name: createProjectDto.project_name,
        owner_id: user_id,
        container_id: containerInDB.container_id,
        dockerImage_id: imageInDB.dockerImage_id,
      },
    });
    if (!projectInDB) {
      throw new InternalServerErrorException(
        'Internal Server Error at creation of container',
      );
    }

    const response = {
      data: projectInDB,
      message: 'Project Created Successfully',
      success: 'Success',
    };
    return response;
  }

  async deleteProject(user_id: string, project_id: string) {
    // Check if the user exists or not
    const userExists = await this.prisma.user.findUnique({
      where: {
        user_id: user_id,
      },
    });
    if (!userExists) {
      throw new ForbiddenException('Please register yourself first');
    }

    // Check if project exists or not
    const projectExists = await this.prisma.project.findUnique({
      where: {
        project_id: project_id,
      },
    });
    if (!projectExists) {
      throw new ForbiddenException(
        'There exists no project with the following name',
      );
    }

    // Delete the projectTodos
    await this.prisma.projectTodo.deleteMany({
      where: {
        project_id: project_id,
      },
    });

    // Find the container_id
    const project = await this.prisma.project.findUnique({
      where: {
        owner_id: user_id,
        project_id: project_id,
      },
      include: {
        container: {
          select: {
            dockerContainer_id: true,
          },
        },
      },
    });

    const containerId = project?.container.dockerContainer_id;
    if (!containerId) {
      throw new InternalServerErrorException('Container ID not found');
    }

    // Delete the project
    await this.prisma.project.delete({
      where: {
        project_id: project_id,
      },
    });

    // Delete the container in docker
    const container = await this.docker.getInstance().getContainer(containerId);
    await container.remove();

    // Delete the container in DB
    await this.prisma.container.deleteMany({
      where: {
        dockerContainer_id: containerId,
      },
    });

    const response = {
      data: '',
      message: 'Project Deleted Successfully',
    };
    return response;
  }

  async startProject(user_id: string, project_id: string) {
    // Check if user exists or not
    const userExists = await this.prisma.user.findUnique({
      where: {
        user_id: user_id,
      },
    });
    if (!userExists) {
      throw new ForbiddenException('Please register yourself first');
    }

    // Check if project exists or not
    const projectExists = await this.prisma.project.findUnique({
      where: {
        project_id: project_id,
      },
    });
    if (!projectExists) {
      throw new ForbiddenException(
        'There exists no project with the following name',
      );
    }

    // Find the container_id
    const project = await this.prisma.project.findUnique({
      where: {
        owner_id: user_id,
        project_id: project_id,
      },
      include: {
        container: {
          select: {
            dockerContainer_id: true,
          },
        },
      },
    });

    const containerId = project?.container.dockerContainer_id;
    if (!containerId) {
      throw new InternalServerErrorException('Container ID not found');
    }

    const container = await this.docker.getInstance().getContainer(containerId);
    container.start();

    const response = {
      data: '',
      message: 'Project has been started',
      success: 'Success',
    };
    return response;
  }

  async stopProject(user_id: string, project_id: string) {
    // Check if user exists or not
    const userExists = await this.prisma.user.findUnique({
      where: {
        user_id: user_id,
      },
    });
    if (!userExists) {
      throw new ForbiddenException('Please register yourself first');
    }

    // Check if project exists or not
    const projectExists = await this.prisma.project.findUnique({
      where: {
        project_id: project_id,
      },
    });
    if (!projectExists) {
      throw new ForbiddenException(
        'There exists no project with the following name',
      );
    }

    // Find the container_id
    const project = await this.prisma.project.findUnique({
      where: {
        owner_id: user_id,
        project_id: project_id,
      },
      include: {
        container: {
          select: {
            dockerContainer_id: true,
          },
        },
      },
    });

    const containerId = project?.container.dockerContainer_id;
    if (!containerId) {
      throw new InternalServerErrorException('Container ID not found');
    }

    const container = await this.docker.getInstance().getContainer(containerId);
    container.stop();

    const response = {
      data: '',
      message: 'Project has been stopped',
      success: 'Success',
    };
    return response;
  }
}
