import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function migrate() {
  console.log('Starting migration: Assigning transactions to default books...');

  try {
    const families = await prisma.family.findMany();
    console.log(`Found ${families.length} families.`);

    for (const family of families) {
      console.log(`Processing family: ${family.familyName} (${family.id})`);

      // 1. Create default book if it doesn't exist
      let defaultBook = await prisma.book.findFirst({
        where: { familyId: family.id, isDefault: true },
      });

      if (!defaultBook) {
        console.log(`Creating default 'Ongoing' book for family ${family.id}`);
        defaultBook = await prisma.book.create({
          data: {
            familyId: family.id,
            name: 'Ongoing',
            isDefault: true,
          },
        });
      }

      // 2. Assign orphan incomes to this book
      const orphanIncomes = await prisma.income.updateMany({
        where: {
          user: { familyId: family.id },
          bookId: null,
        },
        data: {
          bookId: defaultBook.id,
        },
      });
      console.log(`Updated ${orphanIncomes.count} orphan incomes.`);

      // 3. Assign orphan expenses to this book
      const orphanExpenses = await prisma.expense.updateMany({
        where: {
          user: { familyId: family.id },
          bookId: null,
        },
        data: {
          bookId: defaultBook.id,
        },
      });
      console.log(`Updated ${orphanExpenses.count} orphan expenses.`);
    }
  } catch (error) {
    console.error('CRITICAL MIGRATION ERROR:');
    if (error instanceof Error) {
      console.error('Message:', error.message);
      console.error('Stack:', error.stack);
    } else {
      console.error(error);
    }
    throw error;
  }

  console.log('Migration complete!');
}

migrate()
  .catch((e) => {
    console.error('Migration failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
