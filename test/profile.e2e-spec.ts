import 'dotenv/config';
import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module.js';
import { seedDatabase } from '../src/database/seed-database.js';
import { PrismaService } from '../src/prisma/prisma.service.js';

describe('Profile GraphQL API', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = module.createNestApplication();
    await app.init();

    const prisma = app.get(PrismaService);
    await seedDatabase(prisma);
    await seedDatabase(prisma);
  });

  afterAll(async () => {
    await app?.close();
  });

  it('returns the complete profile without duplicating seed data', async () => {
    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
          query {
            profile {
              name
              description
              links { label url }
              skills { name }
              experience {
                company
                position
                startedAt
                endedAt
                achievements
              }
              projects { name url }
            }
          }
        `,
      })
      .expect(200);

    expect(response.body.errors).toBeUndefined();
    expect(response.body.data.profile.name).toBe('Артём Павлов');
    expect(response.body.data.profile.links).toEqual([
      { label: 'GitHub', url: 'https://github.com/ArtemSPavlov' },
    ]);
    expect(response.body.data.profile.skills).toHaveLength(19);
    expect(response.body.data.profile.experience).toHaveLength(4);
    expect(response.body.data.profile.experience[0].company).toBe('USETECH');
    expect(response.body.data.profile.projects).toHaveLength(3);
    expect(
      response.body.data.profile.projects.find(
        (project: { name: string }) =>
          project.name === 'Единый регистр льготников (ЕРЛ)',
      ),
    ).toEqual({ name: 'Единый регистр льготников (ЕРЛ)', url: null });
  });

  it('serves Apollo Sandbox', async () => {
    const response = await request(app.getHttpServer())
      .get('/graphql')
      .set('Accept', 'text/html')
      .expect(200);

    expect(response.text).toContain('Apollo Sandbox');
  });
});
