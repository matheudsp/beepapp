import { supabase } from "../supabase";

export type BookingType = {
  id: string;
  trip_id: string;
  passenger_id: string;
  pickup_point: string;
  dropoff_point: string;
  status: "PENDING" | "CONFIRMED" | "CANCELLED";
};

export const bookingService = {
  /**
   * Busca todas as reservas cadastradas no banco de dados
   * @returns {Promise<BookingType[]>} Lista de reservas
   */
  findAll: async (): Promise<BookingType[]> => {
    const { data, error } = await supabase
      .from("bookings")
      .select("id, trip_id, passenger_id, pickup_point, dropoff_point, status");

    if (error) {
      console.error("Erro ao buscar reservas:", error.message);
      throw new Error("Não foi possível buscar as reservas");
    }

    return data as BookingType[];
  },

  /**
   * Busca uma reserva pelo ID
   * @param id ID da reserva
   * @returns {Promise<BookingType | null>} Reserva encontrada ou null
   */
  findById: async (id: string): Promise<BookingType | null> => {
    const { data, error } = await supabase
      .from("bookings")
      .select("id, trip_id, passenger_id, pickup_point, dropoff_point, status")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Erro ao buscar reserva:", error.message);
      return null;
    }

    return data as BookingType;
  },
};
