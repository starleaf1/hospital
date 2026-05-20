import { PrismaClient, UserRole, ServicePointType, EncounterStatus } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

// Simple mock for password hash
const hashPassword = (password: string) => {
  return crypto.createHash('sha256').update(password).digest('hex');
};

async function main() {
  console.log('Starting to seed database...');

  // 1. Clean existing data (optional but good for repeatable seeds)
  await prisma.invoiceItem.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.tariffMaster.deleteMany();
  await prisma.clinicalAction.deleteMany();
  await prisma.encounter.deleteMany();
  await prisma.patient.deleteMany();
  await prisma.servicePoint.deleteMany();
  await prisma.user.deleteMany();
  await prisma.tenant.deleteMany();

  // 2. Create a Tenant (Hospital)
  const hospital = await prisma.tenant.create({
    data: {
      name: 'City Central Hospital',
      systemName: 'city-central',
    }
  });
  console.log(`Created Tenant: ${hospital.name} with ID: ${hospital.id}`);

  // 2.5 Create Clinical Actions
  const action1 = await prisma.clinicalAction.create({
    data: {
      code: 'TND-001',
      name: 'Konsultasi Dokter Umum'
    }
  });
  console.log(`Created Clinical Action: ${action1.name} (${action1.code})`);

  // 2.6 Create Tariff Masters for test Tenant
  const tariffMandiri = await prisma.tariffMaster.create({
    data: {
      tenantId: hospital.id,
      clinicalActionId: action1.id,
      insuranceType: 'MANDIRI',
      classType: 'NON_KELAS',
      jasaSarana: 50000,
      jasaDokter: 80000,
      jasaPerawat: 10000,
      costBHP: 10000,
      totalTariff: 150000
    }
  });
  console.log(`Created MANDIRI Tariff for ${action1.name}: ${tariffMandiri.totalTariff}`);

  const tariffBpjs = await prisma.tariffMaster.create({
    data: {
      tenantId: hospital.id,
      clinicalActionId: action1.id,
      insuranceType: 'BPJS',
      classType: 'KELAS_1',
      jasaSarana: 15000,
      jasaDokter: 25000,
      jasaPerawat: 5000,
      costBHP: 5000,
      totalTariff: 50000
    }
  });
  console.log(`Created BPJS Tariff for ${action1.name}: ${tariffBpjs.totalTariff}`);

  // 3. Create a Hospital Admin User
  const admin = await prisma.user.create({
    data: {
      tenantId: hospital.id,
      email: 'admin@citycentral.com',
      passwordHash: hashPassword('admin123'), // Secure password for demonstration
      name: 'Dr. Sarah Jenkins',
      roles: [UserRole.HOSPITAL_ADMIN, UserRole.DOCTOR, UserRole.CASHIER],
    }
  });
  console.log(`Created Admin User: ${admin.name} (Roles: ${admin.roles.join(', ')})`);

  // 4. Create Service Points
  const outpatient = await prisma.servicePoint.create({
    data: {
      tenantId: hospital.id,
      name: 'General Outpatient Clinic',
      type: ServicePointType.OUTPATIENT,
    }
  });

  const emergency = await prisma.servicePoint.create({
    data: {
      tenantId: hospital.id,
      name: 'Emergency Room',
      type: ServicePointType.EMERGENCY,
    }
  });
  console.log('Created Service Points.');

  // 5. Create Patients
  const patient1 = await prisma.patient.create({
    data: {
      tenantId: hospital.id,
      nik: '1234567890123456',
      name: 'Alice Johnson',
      birthDate: new Date('1990-05-15'),
      gender: 'Female',
    }
  });

  const patient2 = await prisma.patient.create({
    data: {
      tenantId: hospital.id,
      nik: '6543210987654321',
      name: 'Bob Smith',
      birthDate: new Date('1985-10-20'),
      gender: 'Male',
    }
  });
  console.log('Created Patients.');

  // 6. Create Encounters
  await prisma.encounter.create({
    data: {
      tenantId: hospital.id,
      patientId: patient1.id,
      servicePointId: outpatient.id,
      status: EncounterStatus.COMPLETED,
    }
  });

  await prisma.encounter.create({
    data: {
      tenantId: hospital.id,
      patientId: patient2.id,
      servicePointId: emergency.id,
      status: EncounterStatus.IN_PROGRESS,
    }
  });
  console.log('Created Encounters.');
  console.log('Seeding finished successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
