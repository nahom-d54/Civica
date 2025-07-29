import { defaultStatements, adminAc } from "better-auth/plugins/admin/access";
import { createAccessControl } from "better-auth/plugins/access";

export const statement = {
  ...defaultStatements,
  feedback: ["create", "update", "delete", "view"],
  proposals: ["create", "update", "delete", "view"],
  implementations: ["create", "update", "delete", "view"],
  votes: ["create", "update", "delete", "view"],
  complients: ["create", "update", "delete", "view"],
  admins: ["create", "update", "delete", "view"],
} as const;

export const ac = createAccessControl(statement);

export const user = ac.newRole({
  proposals: ["view"],
  feedback: ["view"],
  implementations: ["view"],
  votes: ["view"],
  complients: ["view"],
});

export const admin = ac.newRole({
  proposals: ["create", "update", "delete", "view"],
  implementations: ["create", "update", "delete", "view"],
});

export const superadmin = ac.newRole({
  ...adminAc.statements,
  proposals: ["create", "update", "delete", "view"],
  feedback: ["create", "update", "delete", "view"],
  implementations: ["create", "update", "delete", "view"],
  votes: ["create", "update", "delete", "view"],
  complients: ["create", "update", "delete", "view"],
  admins: ["create", "update", "delete", "view"],
});
