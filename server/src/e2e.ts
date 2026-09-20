// Playwright uses an isolated database so e2e runs never alter the developer's demo data.
process.env.DATABASE_PATH = ":memory:";
const port = Number(process.env.PORT ?? 3001);
const { app } = await import("./app.js");

app.listen(port, () => console.log(`CampusKit e2e API listening on http://localhost:${port}`));
