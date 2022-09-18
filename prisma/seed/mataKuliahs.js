module.exports = async (prisma) => {
    await prisma.mataKuliahs.create({
        data: {
            kode: 'MK001',
            nama: 'MK Satu',
            sks: 3
        }
    })
    await prisma.mataKuliahs.create({
        data: {
            kode: 'MK002',
            nama: 'MK Dua',
            sks: 2
        }
    })
}
