// app/api/auth/[...nextauth]/route.ts

import { handlers } from "@src/lib/auth/auth";

export const { GET, POST } = handlers;
