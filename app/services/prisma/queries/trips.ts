import { prisma } from "../db";

// Tipagem do que será retornado pelo serviço
export type TripType = {
  id: string;
  departure: Date;
  origin: string;
  destination: string;
  seats: number;
  driver: {
    firstName: string;
    profileImage?: string | null;
  };
};

/**
 * Serviço para manipulação de Viagens (Trips)
 */
export const tripService = {
  /**
   * Busca todas as viagens cadastradas no banco de dados
   * @returns {Promise<TripType[]>} Lista de viagens com informações do motorista
   */
  findAll: async (): Promise<TripType[]> => {
    return await prisma.trip.findMany({
      select: {
        id: true,
        departure: true,
        origin: true,
        destination: true,
        seats: true,
        driver: {
          select: {
            firstName: true,
            profileImage: true,
          },
        },
      },
    });
  },
};
