module.exports = async (prisma) => {
  await prisma.userRoles.create({
    data: {
      email: "soulicia@gmail.com",
      role: "ADMIN_UNIV",
    },
  });
  await prisma.userRoles.create({
    data: {
      email: "soulicia@gmail.com",
      role: "ADMIN_FAKULTAS",
    },
  });
  await prisma.userRoles.create({
    data: {
        email: 'someone@gmail.com',
        role: 'ADMIN_FAKULTAS',
    }
})
};
