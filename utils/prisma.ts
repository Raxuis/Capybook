import {neonConfig, Pool} from '@neondatabase/serverless'
import { PrismaNeon } from '@prisma/adapter-neon'
import { PrismaClient } from '@prisma/client'
import ws from 'ws'

const connectionString = process.env.DATABASE_URL as string
neonConfig.webSocketConstructor = ws;
const pool = new Pool({ connectionString })
const adapter = new PrismaNeon(pool)
const prisma = new PrismaClient({ adapter, log: ['query', 'info', 'warn', 'error'] })

export default prisma
