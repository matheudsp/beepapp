import { supabase } from "../supabase";

export type TripType = {
  id: string;
  departure: string;
  origin: string;
  destination: string;
  seats: number;
  driver: {
    first_name: string;
    last_name: string;
    profile_image?: string | null;
  };
};

export type CityType = {
  origin: string;
  destination: string;
};

export const tripService = {
  /**
   * Busca todas as viagens cadastradas no banco de dados
   * @returns {Promise<TripType[]>} Lista de viagens com informações do motorista
   */
  findAll: async (): Promise<TripType[]> => {
    const { data, error } = await supabase
      .from("trips")
      .select(
        "id, departure, origin, destination, seats, driver:profiles!trips_driver_id_fkey(id, first_name, last_name, profile_image)"
      )

    if (error) {
      console.error("Erro ao buscar viagens:", error.message);
      throw new Error("Não foi possível buscar as viagens");
    }

    // Garante que `data` é um array antes de chamar `.map()`
    return (data ?? []).map(trip => ({
      id: trip.id,
      departure: trip.departure,
      origin: trip.origin,
      destination: trip.destination,
      seats: trip.seats,
      driver: trip.driver && {
        first_name: trip.driver[0].first_name,
        last_name: trip.driver[0].last_name,
        profile_image: trip.driver[0].profile_image || null,
      }
    })) as TripType[];
  },

  findCities: async (): Promise<CityType[]> => {
    const { data, error } = await supabase
      .from("trips")
      .select("origin, destination")
    
    if (error) {
      console.error("Erro ao buscar viagens:", error.message);
      throw new Error("Não foi possível buscar as viagens");
    }
    
    return (data ?? []).map(trip => ({
      origin: trip.origin,
      destination: trip.destination,
    }));
  }
};