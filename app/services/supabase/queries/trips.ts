import { supabase } from "../supabase";
import { ProfileType } from "./profiles";

export type TripType = {
  id: string;
  departure: string;
  origin: string;
  destination: string;
  seats: number;
  driver: string; // Just the ID reference
  created_at?: string;
  updated_at?: string;
};

export type TripCreateParams = {
  departure: string;
  origin: string;
  destination: string;
  seats: number;
  driver_id: string;
};

export type SearchParams = {
  origin?: string;
  destination?: string;
  departureDate?: string;
};

export type CityType = {
  origin: string;
  destination: string;
};

export const tripService = {
  /**
   * Busca todas as viagens cadastradas no banco de dados
   */
  findAll: async (): Promise<TripType[]> => {
    const { data, error } = await supabase
      .from("trips")
      .select(
        "id, departure, origin, destination, seats, created_at, updated_at, driver:profiles!trips_driver_id_fkey(id, first_name, last_name, profile_image)"
      );

    if (error) {
      console.error("Erro ao buscar viagens:", error.message);
      throw new Error("Não foi possível buscar as viagens");
    }

    return (data ?? []).map(trip => ({
      id: trip.id,
      departure: trip.departure,
      origin: trip.origin,
      destination: trip.destination,
      seats: trip.seats,
      driver: trip.driver[0].id,
      created_at: trip.created_at,
      updated_at: trip.updated_at
    })) as TripType[];
  },

  /**
   * Cria uma nova viagem no banco de dados
   */
  create: async (tripData: TripCreateParams): Promise<TripType> => {
    const { data, error } = await supabase
      .from("trips")
      .insert({
        departure: tripData.departure,
        origin: tripData.origin,
        destination: tripData.destination,
        seats: tripData.seats,
        driver_id: tripData.driver_id,
      })
      .select("id, departure, origin, destination, seats, created_at, updated_at")
      .single();

    if (error) {
      console.error("Erro ao criar viagem:", error.message);
      throw new Error("Não foi possível criar a viagem");
    }

    return {
      id: data.id,
      departure: data.departure,
      origin: data.origin,
      destination: data.destination,
      seats: data.seats,
      driver: tripData.driver_id,
      created_at: data.created_at,
      updated_at: data.updated_at
    };
  },

  /**
   * Busca viagens com base nos parâmetros de busca
   */
  search: async (params: SearchParams): Promise<TripType[]> => {
    let query = supabase
      .from("trips")
      .select(
        "id, departure, origin, destination, seats, created_at, updated_at, driver:profiles!trips_driver_id_fkey(id, first_name, last_name, profile_image)"
      );

    if (params.origin) {
      query = query.ilike('origin', `%${params.origin}%`);
    }
    
    if (params.destination) {
      query = query.ilike('destination', `%${params.destination}%`);
    }

    if (params.departureDate) {
      const date = new Date(params.departureDate);
      const formattedDate = date.toISOString().split('T')[0];
      query = query.gte('departure', `${formattedDate}T00:00:00`)
                   .lt('departure', `${formattedDate}T23:59:59`);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Erro ao buscar viagens:", error.message);
      throw new Error("Não foi possível buscar as viagens");
    }

    return (data ?? []).map(trip => ({
      id: trip.id,
      departure: trip.departure,
      origin: trip.origin,
      destination: trip.destination,
      seats: trip.seats,
      driver: trip.driver[0].id,
      created_at: trip.created_at,
      updated_at: trip.updated_at
    })) as TripType[];
  },

  findCities: async (): Promise<CityType[]> => {
    const { data, error } = await supabase
      .from("trips")
      .select("origin, destination");
    
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