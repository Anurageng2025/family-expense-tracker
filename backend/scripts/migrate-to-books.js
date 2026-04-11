"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function migrate() {
    console.log('Starting migration: Assigning transactions to default books...');
    try {
        const families = await prisma.family.findMany();
        console.log(`Found ${families.length} families.`);
        for (const family of families) {
            console.log(`Processing family: ${family.familyName} (${family.id})`);
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
    }
    catch (error) {
        console.error('CRITICAL MIGRATION ERROR:');
        if (error instanceof Error) {
            console.error('Message:', error.message);
            console.error('Stack:', error.stack);
        }
        else {
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
//# sourceMappingURL=migrate-to-books.js.map