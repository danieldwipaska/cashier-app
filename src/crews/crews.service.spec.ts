import { PrismaService } from '../prisma.service';
import { CrewsService } from './crews.service';
import { CustomLoggerService } from '../loggers/custom-logger.service';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users/users.service';
import { CreateCrewDto } from './dto/create-crew.dto';
import { Position } from '../enums/crew';
import { ReportsService } from '../reports/reports.service';
import { HttpService } from '@nestjs/axios';
import { CreateReportDto } from '../reports/dto/create-report.dto';
import { NotFoundException } from '@nestjs/common';

describe('CrewsService', () => {
  let service: CrewsService;
  let prisma: PrismaService;
  let logger: CustomLoggerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CrewsService,
        {
          provide: PrismaService,
          useValue: {
            crew: {
              create: jest.fn(),
            },
          },
        },
        {
          provide: UsersService,
          useValue: {},
        },
        {
          provide: CustomLoggerService,
          useValue: {
            logBusinessEvent: jest.fn(),
            logError: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CrewsService>(CrewsService);
    prisma = module.get<PrismaService>(PrismaService);
    logger = module.get<CustomLoggerService>(CustomLoggerService);
  });

  it('should create a new crew and log business event', async () => {
    const request = { shop: { id: 'shop1' }, user: { username: 'admin' } };
    const createCrewDto: CreateCrewDto = {
      name: 'John',
      code: 'CRW001',
      position: Position.SERVER,
    };
    const createdCrew = { ...createCrewDto, id: 'crew1', shop_id: 'shop1' };

    (prisma.crew.create as jest.Mock).mockResolvedValue(createdCrew);

    const result = await service.create(request, createCrewDto);

    expect(prisma.crew.create).toHaveBeenCalledWith({
      data: { ...createCrewDto, shop_id: 'shop1' },
    });
    expect(logger.logBusinessEvent).toHaveBeenCalledWith(
      `New crew created: ${createdCrew.name}`,
      'CREW_CREATED',
      'CREW',
      createdCrew.id,
      request.user?.username,
      null,
      createdCrew,
      createCrewDto,
    );
    expect(result).toEqual({
      statusCode: 201,
      message: 'CREATED',
      data: createdCrew,
    });
  });
});

describe('ReportsService', () => {
  let service: ReportsService;
  let crewsService: CrewsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportsService,
        {
          provide: PrismaService,
          useValue: {
            report: {
              create: jest.fn(),
            },
            shop: {
              findUnique: jest.fn(),
            },
          },
        },
        {
          provide: CrewsService,
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: CustomLoggerService,
          useValue: {
            logBusinessEvent: jest.fn(),
            logError: jest.fn(),
          },
        },
        {
          provide: HttpService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<ReportsService>(ReportsService);
    crewsService = module.get<CrewsService>(CrewsService);
  });

  it('should throw NotFoundException if crew not found', async () => {
    (crewsService.findOne as jest.Mock).mockResolvedValue(null);

    const req = { shop: { id: 'shop1' } };
    const createReportDto: CreateReportDto = {
      type: 'SALES',
      customer_name: 'Jane',
      items: [],
    } as any;

    await expect(service.create(createReportDto, req)).rejects.toThrow(
      NotFoundException,
    );
  });
});
