import { PrismaClient } from "@prisma/client"

export const prisma = new PrismaClient({
  log:["error","info","query","warn"]
});



export async function prismaConnect() {
  try {
      await prisma.$connect();
      
    console.log("✅ Database connected");
  } catch (error) {
    console.error("❌ Database connection failed", error);
    process.exit(1); 
  }
}

