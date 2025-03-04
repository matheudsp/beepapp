import { Instance, SnapshotOut, types, type IAnyModelType } from "mobx-state-tree";
import { tripService } from "@/services/supabase/queries/trips";
import {  TripModel } from "./Trip";
// import { BookingModel } from "../Booking/Booking";
import { withSetPropAction } from "../helpers/withSetPropAction";
import { getRootStore } from "../helpers/getRootStore";

export const TripStoreModel = types
  .model("TripStore")
  .props({
    trips: types.array(TripModel),
    // bookings: types.array(BookingModel),
    isLoading: false,
    searchParams: types.model({
      origin: types.optional(types.string, ""),
      destination: types.optional(types.string, ""),
      departureDate: types.optional(types.string, "")
    })
  })
  .actions(withSetPropAction)
  .actions((store) => ({
    /**
     * Busca as viagens diretamente do banco via Supabase
     */
    async fetchTrips() {
      try {
        store.setProp("isLoading", true);
        
        // First make sure we've fetched profiles
        const rootStore = getRootStore(store);
        // await rootStore.profileStore.fetchAllProfiles(); // You'll need to add this method
        
        const trips = await tripService.findAll();
        store.setProp("trips", trips);
        return trips;
      } catch (error) {
        console.error("Erro ao buscar viagens:", error);
        return [];
      } finally {
        store.setProp("isLoading", false);
      }
    },

    /**
     * Busca viagens com base nos parâmetros de busca
     */
    async searchTrips() {
      try {
        store.setProp("isLoading", true);
        const { origin, destination, departureDate } = store.searchParams;
        const trips = await tripService.search({ origin, destination, departureDate });
        store.setProp("trips", trips);
        return trips;
      } catch (error) {
        console.error("Erro ao buscar viagens:", error);
        return [];
      } finally {
        store.setProp("isLoading", false);
      }
    },

    /**
     * Cria uma nova viagem (apenas para motoristas)
     */
    async createTrip(tripData: any) {
      try {
        const rootStore = getRootStore(store);
        const currentUserId = rootStore.profileStore.currentProfile?.id;
        
        if (!currentUserId) {
          throw new Error("Usuário não autenticado");
        }
        
        if (!rootStore.profileStore.isDriver) {
          throw new Error("Apenas motoristas podem criar viagens");
        }
        
        const newTrip = await tripService.create({
          ...tripData,
          driver_id: currentUserId
        });
        
        store.trips.push(newTrip);
        return newTrip;
      } catch (error) {
        console.error("Erro ao criar viagem:", error);
        throw error;
      }
    },

    /**
     * Reserva uma vaga em uma viagem (como passageiro)
     */
    // async bookTrip(tripId: string, bookingData: any) {
    //   try {
    //     const rootStore = getRootStore(store);
    //     const currentUserId = rootStore.profileStore.currentProfile?.id;
        
    //     if (!currentUserId) {
    //       throw new Error("Usuário não autenticado");
    //     }
        
    //     const booking = await tripService.bookTrip(tripId, {
    //       ...bookingData,
    //       passenger_id: currentUserId
    //     });
        
    //     store.bookings.push(booking);
    //     return booking;
    //   } catch (error) {
    //     console.error("Erro ao reservar viagem:", error);
    //     throw error;
    //   }
    // },

    // /**
    //  * Busca reservas do usuário atual
    //  */
    // async fetchUserBookings() {
    //   try {
    //     const rootStore = getRootStore(store);
    //     const currentUserId = rootStore.profileStore.currentProfile?.id;
        
    //     if (!currentUserId) {
    //       throw new Error("Usuário não autenticado");
    //     }
        
    //     const bookings = await tripService.getUserBookings(currentUserId);
    //     store.setProp("bookings", bookings);
    //     return bookings;
    //   } catch (error) {
    //     console.error("Erro ao buscar reservas:", error);
    //     return [];
    //   }
    // },

  

    /**
     * Atualiza os parâmetros de busca
     */
    setSearchParams(params: { origin?: string; destination?: string; departureDate?: string }) {
      store.searchParams = { ...store.searchParams, ...params };
    }
  }))
  .views((store) => ({
    /**
     * Retorna a lista de viagens, filtrando pelos favoritos se necessário
     */
    get tripsForList() {
      return store.trips;
    },

    /**
     * Retorna as reservas do usuário atual com status "PENDING"
     */
    // get pendingBookings() {
    //   return store.bookings.filter(booking => booking.status === "PENDING");
    // },
    
    // /**
    //  * Retorna as reservas do usuário atual com status "CONFIRMED"
    //  */
    // get confirmedBookings() {
    //   return store.bookings.filter(booking => booking.status === "CONFIRMED");
    // }
  }))
  .actions((store) => ({
   
  }));

export interface TripStore extends Instance<typeof TripStoreModel> {}
export interface TripStoreSnapshot extends SnapshotOut<typeof TripStoreModel> {}