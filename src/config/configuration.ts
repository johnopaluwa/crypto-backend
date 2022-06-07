export default () => ({
  port: parseInt(process.env.PORT, 10) || 2001,
  database: {
    host: process.env.DATABASE_HOST,
  },
});
