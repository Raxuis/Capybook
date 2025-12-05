/**
 * Script to test database connection and user authentication
 * Run with: tsx scripts/test-db-setup.ts
 * Or in CI: node scripts/test-db-setup.js (after build)
 */

import {PrismaClient} from '@prisma/client';
import bcrypt from 'bcryptjs';

const TEST_USER = {
    email: 'test@example.com',
    password: 'password123',
    name: 'Test User',
};

async function testDatabaseSetup() {
    console.log('🔍 Testing database setup...\n');

    const prisma = new PrismaClient({
        log: ['query', 'info', 'warn', 'error'],
    });

    try {
        // Test 1: Database connection
        console.log('✓ Testing database connection...');
        await prisma.$connect();
        console.log('  ✓ Connected to database');
        console.log(`  Database URL: ${process.env.DATABASE_URL?.split('@')[1] || 'not set'}\n`);

        // Test 2: Check if user exists
        console.log('✓ Checking for test user...');
        let user = await prisma.user.findUnique({
            where: {email: TEST_USER.email},
            select: {
                id: true,
                email: true,
                username: true,
                name: true,
                password: true,
                role: true,
            },
        });

        if (!user) {
            console.log('  ⚠ User not found, creating...');
            const hashedPassword = await bcrypt.hash(TEST_USER.password, 10);
            const username = TEST_USER.email.split('@')[0];

            user = await prisma.user.create({
                data: {
                    email: TEST_USER.email,
                    username,
                    password: hashedPassword,
                    name: TEST_USER.name,
                    role: 'USER',
                },
            });
            console.log('  ✓ User created');
        } else {
            console.log('  ✓ User already exists');
        }

        console.log('  User details:', {
            id: user.id,
            email: user.email,
            username: user.username,
            hasPassword: !!user.password,
            passwordLength: user.password?.length,
            passwordPreview: user.password?.substring(0, 20) + '...',
        });
        console.log();

        // Test 3: Verify password
        console.log('✓ Testing password verification...');
        if (!user.password) {
            throw new Error('User has no password!');
        }

        const isValid = await bcrypt.compare(TEST_USER.password, user.password);
        console.log(`  Password match: ${isValid ? '✓ PASSED' : '✗ FAILED'}`);

        if (!isValid) {
            console.log('  ❌ Password verification failed!');
            console.log('  Expected password:', TEST_USER.password);
            console.log('  Stored hash:', user.password);
            throw new Error('Password verification failed!');
        }
        console.log();

        // Test 4: Test with wrong password
        console.log('✓ Testing with wrong password...');
        const isInvalid = await bcrypt.compare('wrongpassword', user.password);
        console.log(`  Wrong password rejected: ${!isInvalid ? '✓ PASSED' : '✗ FAILED'}`);
        console.log();

        // Test 5: Count total users
        const userCount = await prisma.user.count();
        console.log(`✓ Total users in database: ${userCount}\n`);

        console.log('✅ All tests passed!\n');
        console.log('Test user credentials:');
        console.log(`  Email: ${TEST_USER.email}`);
        console.log(`  Password: ${TEST_USER.password}`);
        console.log();

    } catch (error) {
        console.error('❌ Test failed:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

testDatabaseSetup();