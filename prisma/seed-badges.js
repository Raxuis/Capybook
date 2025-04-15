const badges = require('../models/badges.json');
const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Seeding badges...');

    for (const badge of badges) {
        await prisma.badge.upsert({
            where: {name: badge.name},
            update: badge,
            create: badge
        });
    }

    console.log('Badges seeded successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
