//* MySQL DB CONNECTION 
export async function connectDB(prisma) {
  try {
    await prisma.$connect();
    console.log("connected to MySQL! - DB接続成功💾".yellow.underline);
  } catch (error) {
    console.error("Error connecting to the database - DB接続が失敗しました😢".red.underline, error);
  } finally {
    await prisma.$disconnect();
  }
}

