// app/models/Trip/TripStore.ts
import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { TripModel } from "./Trip"
import { withSetPropAction } from "../helpers/withSetPropAction"
import { getRootStore } from "../helpers/getRootStore"
import { supabase } from "@/services/supabase/supabase"
import { format } from "date-fns"

export const TripStoreModel = types
  .model("TripStore")
  .props({
    trips: types.array(TripModel),
    isLoading: types.optional(types.boolean, false),
    searchParams: types.model({
      origin: types.optional(types.string, ""),
      destination: types.optional(types.string, ""),
      departureDate: types.optional(types.string, "")
    })
  })
  .actions(withSetPropAction)
  .actions((store) => ({
    async fetchTrips() {
      try {
        store.setProp("isLoading", true)
        
        // Get profiles first to ensure we have the driver data
        const { data: profilesData, error: profilesError } = await supabase
          .from("profiles")
          .select("id, first_name, last_name, email, phone_number, profile_image, role")
        
        if (profilesError) throw profilesError
        
        // Add all profiles to the store
        const rootStore = getRootStore(store)
        profilesData.forEach(profile => {
          const existingProfile = rootStore.profileStore.profiles.find((p: { id: any }) => p.id === profile.id)
          if (!existingProfile) {
            rootStore.profileStore.profiles.push({
              id: profile.id,
              first_name: profile.first_name,
              last_name: profile.last_name,
              email: profile.email,
              profile_image: profile.profile_image,
              cpf: null,
              phone_number: profile.phone_number,
              role: profile.role
            })
          }
        })
        
        // Now fetch trips
        const { data: tripsData, error: tripsError } = await supabase
          .from("trips")
          .select("id, departure, origin, destination, seats, driver_id, created_at, updated_at")
        
        if (tripsError) throw tripsError
        
        const trips = tripsData.map(trip => ({
          id: trip.id,
          departure: trip.departure,
          origin: trip.origin,
          destination: trip.destination,
          seats: trip.seats,
          driver: trip.driver_id,
          created_at: trip.created_at,
          updated_at: trip.updated_at
        }))
        
        store.setProp("trips", trips)
        return trips
      } catch (error) {
        console.error("Error fetching trips:", error)
        return []
      } finally {
        store.setProp("isLoading", false)
      }
    },
    
    async searchTrips() {
      try {
        store.setProp("isLoading", true)
        const { origin, destination, departureDate } = store.searchParams
        
        let query = supabase
          .from("trips")
          .select("id, departure, origin, destination, seats, driver_id, created_at, updated_at")
        
        if (origin) {
          query = query.ilike("origin", `%${origin}%`)
        }
        
        if (destination) {
          query = query.ilike("destination", `%${destination}%`)
        }
        
        if (departureDate) {
          // Format date properly for PostgreSQL timestamp comparison
          const startDate = new Date(departureDate)
          startDate.setHours(0, 0, 0, 0)
          
          const endDate = new Date(departureDate)
          endDate.setHours(23, 59, 59, 999)
          
          query = query
            .gte("departure", startDate.toISOString())
            .lte("departure", endDate.toISOString())
        }
        
        const { data, error } = await query
        
        if (error) throw error
        
        const trips = (data ?? []).map(trip => ({
          id: trip.id,
          departure: trip.departure,
          origin: trip.origin,
          destination: trip.destination,
          seats: trip.seats,
          driver: trip.driver_id,
          created_at: trip.created_at,
          updated_at: trip.updated_at
        }))
        
        store.setProp("trips", trips)
        return trips
      } catch (error) {
        console.error("Error searching trips:", error)
        return []
      } finally {
        store.setProp("isLoading", false)
      }
    },

    async createTrip(tripData: { 
      departure: Date | string, 
      origin: string, 
      destination: string, 
      seats: number 
    }) {
      try {
        store.setProp("isLoading", true)
        
        const rootStore = getRootStore(store)
        const currentUserId:any = rootStore.profileStore.currentProfile?.id
        
        if (!currentUserId) {
          throw new Error("User not authenticated")
        }
        
        if (!rootStore.profileStore.isDriver) {
          throw new Error("Only drivers can create trips")
        }
        
        // Convert departure to ISO string if it's a Date object
        const departure = tripData.departure instanceof Date 
          ? tripData.departure.toISOString() 
          : tripData.departure
        
        const { data, error } = await supabase
          .from("trips")
          .insert({
            departure,
            origin: tripData.origin,
            destination: tripData.destination,
            seats: tripData.seats,
            driver_id: currentUserId
          })
          .select()
          .single()
        
        if (error) throw error
        
        const newTrip = {
          id: data.id,
          departure: data.departure,
          origin: data.origin,
          destination: data.destination,
          seats: data.seats,
          driver: data.driver_id,
          created_at: data.created_at,
          updated_at: data.updated_at
        }
        
        store.trips.push(newTrip)
        return newTrip
      } catch (error) {
        console.error("Error creating trip:", error)
        throw error
      } finally {
        store.setProp("isLoading", false)
      }
    },

    setSearchParams(params: { origin?: string; destination?: string; departureDate?: string }) {
      store.searchParams = { ...store.searchParams, ...params }
    }
  }))
  .views((store) => ({
    get tripsForList() {
      return store.trips
    },
    
    get availableOrigins() {
      return [...new Set(store.trips.map(trip => trip.origin))].sort()
    },
    
    get availableDestinations() {
      return [...new Set(store.trips.map(trip => trip.destination))].sort()
    },
    
    getTripsForDriver(driverId: string) {
      return store.trips.filter(trip => trip.driver?.id === driverId)
    },
    
    getTripById(tripId: string) {
      return store.trips.find(trip => trip.id === tripId)
    }
  }))

export interface TripStore extends Instance<typeof TripStoreModel> {}
export interface TripStoreSnapshot extends SnapshotOut<typeof TripStoreModel> {}