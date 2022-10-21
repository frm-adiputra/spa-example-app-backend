async function updateTimestamp(context) {
  const org = await context.service.get(context.id, context.params);
  context.data.createdAt = org.createdAt;
  context.data.updatedAt = new Date();
}

function addOrderByRecentlyUpdated(context) {
  const query = context.service.createQuery(context.params);
  query.orderBy("updatedAt", "desc");
  context.params.knex = query;
}
module.exports = {
  updateTimestamp,
  addOrderByRecentlyUpdated,
};
