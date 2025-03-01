/**
 * This Api class lets you define an API endpoint and methods to request
 * data and process it.
 *
 * See the [Backend API Integration](https://docs.infinite.red/ignite-cli/boilerplate/app/services/#backend-api-integration)
 * documentation for more details.
 */



import type { TripSnapshotIn } from "../../models/Trip"
import { tripService } from "../prisma/queries/trips"

export class Api {
  async getTrips(): Promise<{ trips: TripSnapshotIn[] } | { error: string }> {
    try {
      const trips = await tripService.findAll();

      const formattedTrips: TripSnapshotIn[] = trips.map((trip) => ({
        id: trip.id,
        departure: trip.departure.toISOString(),
        origin: trip.origin,
        destination: trip.destination,
        seats: trip.seats,
        driver: {
          firstName: trip.driver.firstName,
          profileImage: trip.driver.profileImage ?? null,
        },
      }));

      return { trips: formattedTrips };
    } catch (err) {
      console.error("Erro ao buscar viagens:", err);
      return { error: err instanceof Error ? err.message : "Erro desconhecido" };
    }
  }
}

export const api = new Api()
