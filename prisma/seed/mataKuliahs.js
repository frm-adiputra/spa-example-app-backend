module.exports = async (prisma) => {
    await prisma.mataKuliahs.create({
        data: {
            kode: 'MK001',
            nama: 'MK Satu',
            sks: 3
        }
    })
}
