import { User, UserRole } from "@prisma/client";
import { prisma } from "@src/lib/prisma";

type UserDisplay = Pick<
  User,
  "id" | "name" | "email" | "emailVerified" | "createdAt" | "updatedAt" | "role"
>;

const formatDate = (date: Date | null) => {
  return date ? date.toISOString().split("T")[0] : "N/A";
};

const getUsersData = async (): Promise<UserDisplay[]> => {
  return await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      emailVerified: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export default async function AdminPage() {
  const users = await getUsersData();
  const admins = users.filter((user) => user.role === UserRole.ADMIN);
  const regularUsers = users.filter((user) => user.role === UserRole.USER);

  return (
    <div className="p-6 max-w-full mx-auto">
      <h1 className="text-3xl font-bold mb-8">User Management</h1>
      <div className="space-y-12">
        <UserSection title="Admins" users={admins} />
        <UserSection title="Regular Users" users={regularUsers} />
      </div>
    </div>
  );
}

function UserSection({ title, users }: { title: string; users: UserDisplay[] }) {
  return (
    <section>
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="w-full table-fixed">
          <thead className="bg-gray-50">
            <tr>
              {["Name", "Email", "Email Verified", "Created At", "Updated At"].map((header) => (
                <th
                  key={header}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 truncate">{user.name || "N/A"}</td>
                <td className="px-6 py-4 truncate">{user.email}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.emailVerified ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                  >
                    {user.emailVerified ? "Yes" : "No"}
                  </span>
                </td>
                <td className="px-6 py-4 truncate">{formatDate(user.createdAt)}</td>
                <td className="px-6 py-4 truncate">{formatDate(user.updatedAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
