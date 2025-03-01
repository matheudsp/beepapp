import postgres from "postgres";
import "dotenv/config";

const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
  throw new Error("Couldn't find db url");
}
const sql = postgres(dbUrl);

async function main() {
  await sql`
   create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, email, first_name, last_name)
  values (
    new.id, 
    new.email, 
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''), 
    COALESCE(NEW.raw_user_meta_data->>'last_name', '')
    );
  return new;
end;
$$;
     `;
  await sql`
   -- trigger the function every time a user is created
  create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

   `;

  await sql`ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;`;
  await sql`ALTER TABLE trips ENABLE ROW LEVEL SECURITY;`;
  await sql`ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;`;
  await sql`ALTER TABLE _prisma_migrations ENABLE ROW LEVEL SECURITY;`;

  console.log("Functions and triggers created successfully!");
  process.exit();
}


main().catch((error) => {
  console.error("Error setting up triggers:", error);
  process.exit(1);
});