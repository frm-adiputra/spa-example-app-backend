module.exports = async (prisma) => {
    await prisma.posts.create({
        data: {
            title: 'Satu',
            content: 'Satu satu',
            published: false
        }
    })
}
