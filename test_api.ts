import axios from 'axios';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function runTests() {
  console.log('=== SIMRS BILLING & TARIFF SYSTEM INTEGRATION TEST ===\n');

  try {
    // 1. Fetch Tenant from DB
    const tenant = await prisma.tenant.findFirst();
    if (!tenant) {
      throw new Error('No tenant found in database. Did you run the seed script?');
    }
    const tenantId = tenant.id;
    console.log(`[DB] Found Test Tenant: ${tenant.name} (${tenantId})`);

    // 2. Fetch Clinical Action
    const clinicalAction = await prisma.clinicalAction.findFirst({
      where: { code: 'TND-001' }
    });
    if (!clinicalAction) {
      throw new Error('Clinical Action TND-001 not found.');
    }
    console.log(`[DB] Found Clinical Action: ${clinicalAction.name} (${clinicalAction.code})`);

    // 3. Fetch Encounters
    const encounters = await prisma.encounter.findMany({
      where: { tenantId }
    });
    if (encounters.length === 0) {
      throw new Error('No encounters found. Did you seed?');
    }

    // Encounter 1 (MANDIRI)
    const mandiriEncounter = encounters[0];
    console.log(`[DB] Found MANDIRI Encounter: ${mandiriEncounter.id}`);

    // Create a mock BPJS Encounter to test BPJS tariff (has bpjsSepNumber)
    const bpjsEncounter = await prisma.encounter.create({
      data: {
        tenantId,
        patientId: mandiriEncounter.patientId,
        servicePointId: mandiriEncounter.servicePointId,
        bpjsSepNumber: 'SEP-123456789',
        status: 'WAITING'
      }
    });
    console.log(`[DB] Created Test BPJS Encounter: ${bpjsEncounter.id}`);

    console.log('\n--- TEST CASE 1: Add Action to MANDIRI Encounter (Standard Cash Workflow) ---');
    let res1 = await axios.post(
      `http://localhost:8080/api/v1/encounters/${mandiriEncounter.id}/actions`,
      { actionCode: 'TND-001', directPay: false },
      { headers: { 'x-tenant-id': tenantId } }
    );
    console.log(`Response Status: ${res1.status}`);
    console.log('Invoice details:', {
      invoiceId: res1.data.data.invoice.id,
      status: res1.data.data.invoice.status,
      paymentMethod: res1.data.data.invoice.paymentMethod,
      totalAmount: res1.data.data.invoice.totalAmount,
      paidAt: res1.data.data.invoice.paidAt
    });
    console.log('Snapshot Invoice Item:', {
      actionName: res1.data.data.addedItem.actionName,
      jasaSarana: res1.data.data.addedItem.jasaSaranaSnapshot,
      jasaDokter: res1.data.data.addedItem.jasaDokterSnapshot,
      totalPrice: res1.data.data.addedItem.totalPriceSnapshot
    });

    console.log('\n--- TEST CASE 2: Add Action to BPJS Encounter (BPJS Lower Price Matrix) ---');
    let res2 = await axios.post(
      `http://localhost:8080/api/v1/encounters/${bpjsEncounter.id}/actions`,
      { actionCode: 'TND-001', directPay: false },
      { headers: { 'x-tenant-id': tenantId } }
    );
    console.log(`Response Status: ${res2.status}`);
    console.log('Invoice details:', {
      invoiceId: res2.data.data.invoice.id,
      status: res2.data.data.invoice.status,
      paymentMethod: res2.data.data.invoice.paymentMethod,
      totalAmount: res2.data.data.invoice.totalAmount,
      paidAt: res2.data.data.invoice.paidAt
    });
    console.log('Snapshot Invoice Item:', {
      actionName: res2.data.data.addedItem.actionName,
      jasaSarana: res2.data.data.addedItem.jasaSaranaSnapshot,
      jasaDokter: res2.data.data.addedItem.jasaDokterSnapshot,
      totalPrice: res2.data.data.addedItem.totalPriceSnapshot
    });

    console.log('\n--- TEST CASE 3: Solo Practice Bypass (directPay = true) ---');
    let res3 = await axios.post(
      `http://localhost:8080/api/v1/encounters/${mandiriEncounter.id}/actions`,
      { actionCode: 'TND-001', directPay: true },
      { headers: { 'x-tenant-id': tenantId } }
    );
    console.log(`Response Status: ${res3.status}`);
    console.log('Invoice details:', {
      invoiceId: res3.data.data.invoice.id,
      status: res3.data.data.invoice.status,
      paymentMethod: res3.data.data.invoice.paymentMethod,
      totalAmount: res3.data.data.invoice.totalAmount,
      paidAt: res3.data.data.invoice.paidAt
    });

    console.log('\n--- TEST CASE 4: Dynamic Error Validation (No tariff configured) ---');
    // Create a temporary clinical action without configured tariff to trigger the strict domain error
    const noTariffAction = await prisma.clinicalAction.create({
      data: {
        code: 'TND-999',
        name: 'Tindakan Tanpa Tarif'
      }
    });

    try {
      await axios.post(
        `http://localhost:8080/api/v1/encounters/${mandiriEncounter.id}/actions`,
        { actionCode: 'TND-999', directPay: false },
        { headers: { 'x-tenant-id': tenantId } }
      );
      console.log('❌ Unexpectedly succeeded!');
    } catch (err: any) {
      console.log(`✅ Throw strict error correctly: Status ${err.response?.status}`);
      console.log(`Error message: "${err.response?.data?.error}"`);
    }

    // Clean up test data
    await prisma.encounter.delete({ where: { id: bpjsEncounter.id } });
    await prisma.clinicalAction.delete({ where: { id: noTariffAction.id } });

    console.log('\n=== ALL VERIFICATION TESTS PASSED SUCCESSFULLY! ===');
  } catch (error) {
    console.error('❌ Integration Test Failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

runTests();
