

import { createClient } from "@supabase/supabase-js"
const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL as string,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY as string,
  {
    auth: {
      autoRefreshToken: true,
      detectSessionInUrl: false,
    },
  }
)

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Criar perfis (usuários)
  const driverAuth = await supabase.auth.signUp({
    email: "mdsp.personal@gmail.com",
    password: "password",
    options: {
      data: {
        first_name: "Carlos",
        last_name: "Souza",
      }
    }
  })

  // await supabase.auth.admin.updateUserById(
  //   driverAuth.data.user?.id! as string,
  //   {email_confirm:true}
  // )

  if (driverAuth.error) { console.log("Error SignUp:" ,driverAuth.error.message) }
  console.log('id user /n/n/n', driverAuth.data.user?.id as string)
  console.log('metadata user /n/n/n', driverAuth.data.user?.user_metadata)

  const driver = await prisma.profile.update({
    where: { id: driverAuth.data.user?.id! },
    data: {
      phone_number: "11999999999",
      profile_image: 'https://plus.unsplash.com/premium_photo-1683121366070-5ceb7e007a97?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8dXNlciUyMHByb2ZpbGV8ZW58MHx8MHx8fDA%3D',
      cpf: "123.456.789-00",
      role: Role.DRIVER
    },
  });


  const passengerAuth = await supabase.auth.signUp({
    email: "matheuzimdsp@gmail.com",
    password: "password",
    options: {
      data: {
        first_name: "Mariana",
        last_name: "Lima",
      }
    }
  })
  // await supabase.auth.admin.updateUserById(
  //   passengerAuth.data.user?.id! as string,
  //   {email_confirm:true}
  // )
  
  if (passengerAuth.error) { console.log("Error SignUp:" ,passengerAuth.error.message) }
  console.log('id user /n/n/n', passengerAuth.data.user?.id as string)
  console.log('metadata user /n/n/n', passengerAuth.data.user?.user_metadata)

  const passenger = await prisma.profile.update({
    where: { id: passengerAuth.data.user?.id! },
    data: {
      phone_number: "11988888888",
      profile_image: 'https://plus.unsplash.com/premium_photo-1683121366070-5ceb7e007a97?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8dXNlciUyMHByb2ZpbGV8ZW58MHx8MHx8fDA%3D',
      cpf: "987.654.321-00",
      role: Role.PASSENGER,
    },
  });

  // Criar viagem
  const trip = await prisma.trip.create({
    data: {
      driver_id: driver.id,
      departure: new Date("2024-03-05T10:00:00Z"),
      origin: "Floriano",
      destination: "Teresina",
      seats: 4,
    },
  });

  // Criar reserva (booking)
  await prisma.booking.create({
    data: {
      trip_id: trip.id,
      passenger_id: passenger.id,
      pickup_point: "Rodoviária Tietê",
      dropoff_point: "Centro do Rio",
      status: BookingStatus.PENDING,
    },
  });

  console.log("Seeding completed.");
}


main()
  .catch((error) => {
    console.error("Error seeding database:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
