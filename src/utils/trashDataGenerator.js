import { faker } from "@faker-js/faker";
import { postClient } from "../firebase";

export const USERS = [];

export function createRandomUser() {
  return {
    nombre: faker.name.fullName(),
    nit: faker.datatype.number({ min: 1000, max: 9999 }),
    telefono: faker.phone.number(),
    razonSocial: faker.company.name(),
    codigo: faker.datatype.uuid(),
  };
}

Array.from({ length: 80 }).forEach(() => {
  USERS.push(createRandomUser());
});

try {
  const promises = [];
  USERS.map(async (user) => {
    const userCreate = await postClient(user);
    promises.push(userCreate);
  });
  Promise.all([promises]).then((values) => {
    console.log(values);
  });
} catch (error) {
  console.log(error);
}
