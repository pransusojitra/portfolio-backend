const User = require('../models/User');

const ensureDefaultAdmin = async () => {
  const shouldSeed =
    process.env.NODE_ENV === 'development' ||
    process.env.ALLOW_DEFAULT_ADMIN_SEED === 'true';

  if (!shouldSeed) return;

  const email = process.env.DEFAULT_ADMIN_EMAIL || 'admin@example.com';
  const password = process.env.DEFAULT_ADMIN_PASSWORD || 'password123';
  const name = process.env.DEFAULT_ADMIN_NAME || 'Admin';

  const existingAdmin = await User.findOne({ email });
  if (existingAdmin) return;

  await User.create({
    name,
    email,
    password,
    role: 'admin',
  });

  console.log(`Default admin created: ${email}`);
};

module.exports = ensureDefaultAdmin;
