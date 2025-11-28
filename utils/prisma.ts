import {neonConfig, Pool} from '@neondatabase/serverless'
import {PrismaNeon} from '@prisma/adapter-neon'
import {PrismaClient} from '@prisma/client'
import ws from 'ws'

const connectionString = process.env.DATABASE_URL!

neonConfig.webSocketConstructor = ws as any;

const pool = new Pool({connectionString})
const adapter = new PrismaNeon(pool as any)
const prisma = new PrismaClient({adapter})

export default prisma