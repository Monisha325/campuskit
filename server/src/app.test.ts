import { after, before, test } from "node:test";
import assert from "node:assert/strict";
import type { AddressInfo } from "node:net";
import type { Server } from "node:http";
import { app } from "./app.js";

let server: Server;
let baseUrl: string;

before(async () => {
  server = app.listen(0);
  await new Promise<void>((resolve) => server.once("listening", resolve));
  const { port } = server.address() as AddressInfo;
  baseUrl = `http://127.0.0.1:${port}`;
});

after(async () => {
  await new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
});

test("health endpoint returns ok", async () => {
  const response = await fetch(`${baseUrl}/health`);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { status: "ok" });
});

test("seeded equipment is publicly available", async () => {
  const response = await fetch(`${baseUrl}/equipment`);
  const equipment = await response.json() as { name: string }[];
  assert.equal(response.status, 200);
  assert.ok(equipment.some((item) => item.name === "3D Printer"));
});

test("demo student can log in", async () => {
  const response = await fetch(`${baseUrl}/auth/login`, {
    body: JSON.stringify({ email: "student@test.edu", password: "Test@1234" }),
    headers: { "Content-Type": "application/json" },
    method: "POST"
  });
  const result = await response.json() as { token: string; user: { role: string } };
  assert.equal(response.status, 200);
  assert.ok(result.token);
  assert.equal(result.user.role, "student");
});
