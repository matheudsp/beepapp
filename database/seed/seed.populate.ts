import { createClient } from "@supabase/supabase-js";
import "dotenv/config";

const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL as string,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY as string,
  {
    auth: {
      autoRefreshToken: true,
      detectSessionInUrl: false,
    },
  }
);

async function main() {
  console.log("Seeding database...");

  // Criar perfis (usuários)
  const { data: driverAuth, error: driverError } = await supabase.auth.signUp({
    email: "mdsp.personal@gmail.com",
    password: "password",
    options: {
      data: {
        first_name: "Carlos",
        last_name: "Souza",
      },
    },
  });

  if (driverError) {
    console.error("Error SignUp:", driverError.message);
    return;
  }

  console.log("Driver ID:", driverAuth.user?.id);

  await supabase.from("profiles").update({
    phone_number: "11999999999",
    profile_image: "https://plus.unsplash.com/premium_photo-1683121366070-5ceb7e007a97?fm=jpg&q=60&w=3000",
    cpf: "123.456.789-00",
    role: "DRIVER",
  }).eq("id", driverAuth.user?.id);

  const { data: passengerAuth, error: passengerError } = await supabase.auth.signUp({
    email: "matheuzimdsp@gmail.com",
    password: "password",
    options: {
      data: {
        first_name: "Mariana",
        last_name: "Lima",
      },
    },
  });

  if (passengerError) {
    console.error("Error SignUp:", passengerError.message);
    return;
  }

  console.log("Passenger ID:", passengerAuth.user?.id);

  await supabase.from("profiles").update({
    phone_number: "11988888888",
    profile_image: "https://plus.unsplash.com/premium_photo-1683121366070-5ceb7e007a97?fm=jpg&q=60&w=3000",
    cpf: "987.654.321-00",
    role: "PASSENGER",
  }).eq("id", passengerAuth.user?.id);

  // Criar viagem
  const { data: trip, error: tripError } = await supabase.from("trips").insert([
    {
      driver_id: driverAuth.user?.id,
      departure: "2024-03-05T10:00:00Z",
      origin: "Floriano",
      destination: "Teresina",
      seats: 4,
    },
  ]).select("id").single();

  if (tripError) {
    console.error("Error creating trip:", tripError.message);
    return;
  }

  console.log("Trip ID:", trip.id);

  // Criar reserva (booking)
  const { error: bookingError } = await supabase.from("bookings").insert([
    {
      trip_id: trip.id,
      passenger_id: passengerAuth.user?.id,
      pickup_point: "Rodoviária Tietê",
      dropoff_point: "Centro do Rio",
      status: "PENDING",
    },
  ]);

  if (bookingError) {
    console.error("Error creating booking:", bookingError.message);
    return;
  }

  console.log("Seeding completed.");
}

main().catch((error) => {
  console.error("Error seeding database:", error);
});
