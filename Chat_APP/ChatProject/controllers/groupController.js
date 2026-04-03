exports.createGroup = async (req, res) => {
  const { name, members } = req.body;
  const creator = req.user.id;

  const group = await db.query(
    "INSERT INTO groups (name, created_by) VALUES ($1,$2) RETURNING *",
    [name, creator]
  );

  for (let member of members) {
    await db.query(
      "INSERT INTO group_members (group_id, user_id) VALUES ($1,$2)",
      [group.rows[0].id, member]
    );
  }

  res.json({ success: true, group: group.rows[0] });
};