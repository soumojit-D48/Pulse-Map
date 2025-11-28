// lib/prisma.ts

import { PrismaClient } from '@/app/generated/prisma'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma






// // // lib/prisma.ts
// import  PrismaClient  from '@prisma/client';

// const globalForPrisma = globalThis as unknown as {
//   prisma: PrismaClient | undefined;
// };

// const prisma = globalForPrisma.prisma ?? new PrismaClient({
//   log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
// });

// if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// export default prisma;






// // lib/prisma.ts
// import PrismaClient from '@prisma/client';

// const globalForPrisma = globalThis as unknown as {
//   prisma?: InstanceType<typeof PrismaClient>;
// };

// const prisma =
//   globalForPrisma.prisma ??
//   new PrismaClient({
//     log:
//       process.env.NODE_ENV === 'development'
//         ? ['query', 'error', 'warn']
//         : ['error'],
//   });

// if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// export default prisma;


// // lib/prisma.ts
// import PrismaClient from '@prisma/client';

// // Just call it as a function to get the client
// const prisma = PrismaClient({
//   log:
//     process.env.NODE_ENV === 'development'
//       ? ['query', 'error', 'warn']
//       : ['error'],
// });

// export default prisma;





// lib/prisma.ts
// import { PrismaClient } from "@/app/generated/prisma";

// const globalForPrisma = globalThis as unknown as {
//   prisma: PrismaClient | undefined;
// };

// const prisma =
//   globalForPrisma.prisma ??
//   new PrismaClient({
//     datasourceUrl: process.env.DATABASE_URL,   // 🔥 REQUIRED for Prisma 7
//     log:
//       process.env.NODE_ENV === "development"
//         ? ["query", "error", "warn"]
//         : ["error"],
//   });

// if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// export default prisma;










// import { PrismaClient } from "@prisma/client";
// import { NeonAdapter } from "@prisma/adapter-neon";
// import { Pool } from "@neondatabase/serverless";

// const globalForPrisma = globalThis as unknown as {
//   prisma: PrismaClient | undefined;
// };

// const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
//   adapter: new NeonAdapter({ pool }),
// });

// if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;

// export default prisma;
