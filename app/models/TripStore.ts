import { Instance, SnapshotOut, types } from "mobx-state-tree";
import { tripService } from "@/services/supabase/queries/trips";
import { Trip, TripModel } from "./Trip";
import { withSetPropAction } from "./helpers/withSetPropAction";

export const TripStoreModel = types
  .model("TripStore")
  .props({
    trips: types.array(TripModel),
    favorites: types.array(types.reference(TripModel)),
    favoritesOnly: false,
  })
  .actions(withSetPropAction)
  .actions((store) => ({
    /**
     * Busca as viagens diretamente do banco via Prisma ORM.
     */
    async fetchTrips() {
      try {
        const trips = await tripService.findAll();

        store.setProp("trips", trips);
        console.log(trips)
      } catch (error) {
        console.error("Erro ao buscar viagens:", error);
      }
    },

    /**
     * Adiciona uma viagem aos favoritos, evitando duplicações.
     */
    addFavorite(trip: Trip) {
      if (!store.favorites.includes(trip)) {
        store.favorites.push(trip);
      }
    },

    /**
     * Remove uma viagem dos favoritos.
     */
    removeFavorite(trip: Trip) {
      store.favorites.remove(trip);
    },
  }))
  .views((store) => ({
    /**
     * Retorna a lista de viagens, filtrando pelos favoritos se necessário.
     */
    get tripsForList() {
      return store.favoritesOnly ? store.favorites : store.trips;
    },

    /**
     * Verifica se uma viagem está nos favoritos.
     */
    hasFavorite(trip: Trip) {
      return store.favorites.includes(trip);
    },
  }))
  .actions((store) => ({
    /**
     * Alterna uma viagem entre favorita e não favorita.
     */
    toggleFavorite(trip: Trip) {
      store.hasFavorite(trip) ? store.removeFavorite(trip) : store.addFavorite(trip);
    },
  }));

export interface TripStore extends Instance<typeof TripStoreModel> { }
export interface TripStoreSnapshot extends SnapshotOut<typeof TripStoreModel> { }
