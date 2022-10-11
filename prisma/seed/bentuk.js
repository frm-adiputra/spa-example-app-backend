module.exports = async (prisma) => {
  const count = 100
  for (let i = 1; i <= count; i++) {
    await prisma.bentuk.create({
      data: {
        bentuk: `Bentuk ${i}`,
      },
    });  
  }
};
