import { Request, Response } from 'express';
import { SEED_USER } from './data/data';
import { inject, injectable } from 'inversify';
import TYPES_USER from '../users/user.types';
import { UserService } from '../users/user.service';
import { prisma } from '../../config/db';
import { RateType, TypePropertie, TypeVehicles } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { Decimal } from '@prisma/client/runtime/library';

@injectable()
export class SeedController {
  constructor(
    @inject(TYPES_USER.UserService) private readonly userService: UserService
  ) {
    console.log('SeedController initialized, userService:', !!userService);
  }
  async postResgisterManyUser(req: Request, res: Response) {
    const data = await this.userService.addManyUser(SEED_USER);

    res.status(200).send({
      message: 'Usuarios creados',
      title: 'Usuarios registrados',
      data,
    });
  }
  async postRegisterManyRolesUser(req: Request, res: Response) {
    const data = null;

    res.status(200).send({
      message: 'Usuarios creados',
      title: 'Usuarios registrados',
      data,
    });
  }

  async seedDataBase() {
    const users = await prisma.user.findMany({
      select: { id: true },
      take: 312,
    });

    if (!users) {
      throw new Error('No hay suficientes usuarios (mínimo 312).');
    }

    console.log(`Se encontraron ${users.length} usuarios.`);

    // 1. Crear servicios
    const serviceNames = [
      'Wifi',
      'Piscina',
      'Cable',
      'Desayuno',
      'Limpieza',
      'Gimnasio',
      'Estacionamiento',
      'Aire Acondicionado',
      'Mascotas Permitidas',
      'Lavandería',
    ];

    const services = await Promise.all(
      serviceNames.map((name) =>
        prisma.service.create({
          data: {
            name,
            description: faker.lorem.sentence(),
            isFree: Math.random() < 0.5,
            createdBy: users[0]?.id ?? '',
          },
        })
      )
    );

    console.log('Servicios creados.');

    const propertyOwners = users.slice(0, 100);
    const propertyRates: { id: number; propertyId: string }[] = [];

    // 2. Crear propiedades para 100 usuarios
    for (const owner of propertyOwners) {
      const isDwelling = faker.datatype.boolean();

      const property = await prisma.properties.create({
        data: {
          description: faker.lorem.sentence(),
          fkIdUSer: owner.id,
          createdById: owner.id,
          type: isDwelling ? TypePropertie.DWELLING : TypePropertie.VEHICLE,
        },
      });

      if (isDwelling) {
        await prisma.dwelling.create({
          data: {
            city: faker.location.city(),
            county: faker.location.state(),
            address: faker.location.streetAddress(),
            latitude: new Decimal(faker.location.latitude()),
            longitude: new Decimal(faker.location.longitude()),
            propertieId: property.id,
          },
        });
      } else {
        await prisma.vehicles.create({
          data: {
            brand: faker.vehicle.manufacturer(),
            model: faker.vehicle.model(),
            type: faker.helpers.arrayElement([
              TypeVehicles.MECHANICAL,
              TypeVehicles.AUTOMATIC,
            ]),
            description: faker.lorem.words(3),
            propertieId: property.id,
          },
        });
      }

      const rate = await prisma.rate.create({
        data: {
          type: faker.helpers.arrayElement(Object.values(RateType)),
          price: new Decimal(faker.number.float({ min: 10, max: 100 })),
          createdBy: owner.id,
        },
      });

      const propRate = await prisma.propertyRate.create({
        data: {
          propertyId: property.id,
          rateId: rate.id,
          createdBy: owner.id,
        },
      });

      propertyRates.push({ id: propRate.id, propertyId: property.id });

      const selectedServices = faker.helpers
        .shuffle(services)
        .slice(0, faker.number.int({ min: 1, max: 10 }));

      for (const service of selectedServices) {
        const sRate = await prisma.rate.create({
          data: {
            type: faker.helpers.arrayElement(Object.values(RateType)),
            price: new Decimal(faker.number.float({ min: 5, max: 50 })),
            createdBy: owner.id,
          },
        });

        await prisma.serviceRate.create({
          data: {
            serviceId: service.id,
            rateId: sRate.id,
            createdBy: owner.id,
          },
        });
      }
    }

    console.log('Propiedades creadas.');

    // 3. Crear reservaciones para los demás usuarios
    const reservationUsers = users.slice(100);
    for (const user of reservationUsers) {
      const randomPropRate = faker.helpers.arrayElement(propertyRates);
      const startDate = faker.date.recent({ days: 60 });
      const endDate = new Date(startDate);
      endDate.setDate(
        endDate.getDate() + faker.number.int({ min: 1, max: 15 })
      );

      await prisma.reservation.create({
        data: {
          userId: user.id,
          propertyRateId: randomPropRate.id,
          startDate,
          endDate,
          createdBy: user.id,
        },
      });
    }

    console.log('Reservaciones creadas.');
    console.log('✅ Seed finalizado.');
  }
}
