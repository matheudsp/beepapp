// app/models/Booking/BookingStore.ts
import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { BookingModel } from "./Booking"
import { withSetPropAction } from "../helpers/withSetPropAction"
import { getRootStore } from "../helpers/getRootStore"
import { supabase } from "@/services/supabase/supabase"

export const BookingStoreModel:any = types
  .model("BookingStore")
  .props({
    bookings: types.array(BookingModel),
    isLoading: types.optional(types.boolean, false)
  })
  .actions(withSetPropAction)
  .actions((store) => ({
    async fetchUserBookings() {
      try {
        store.setProp("isLoading", true)
        
        const rootStore = getRootStore(store)
        const currentUserId = rootStore.profileStore.currentProfile?.id
        
        if (!currentUserId) {
          throw new Error("User not authenticated")
        }
        
        const { data, error } = await supabase
          .from("bookings")
          .select(`
            id, trip_id, passenger_id, pickup_point, dropoff_point, status,
            created_at, updated_at
          `)
          .eq("passenger_id", currentUserId)
        
        if (error) throw error
        
        const bookingsData = data.map(booking => ({
          id: booking.id,
          trip_id: booking.trip_id,
          passenger_id: booking.passenger_id,
          pickup_point: booking.pickup_point,
          dropoff_point: booking.dropoff_point,
          status: booking.status,
          created_at: booking.created_at,
          updated_at: booking.updated_at
        }))
        
        store.setProp("bookings", bookingsData)
        return bookingsData
      } catch (error) {
        console.error("Error fetching user bookings:", error)
        return []
      } finally {
        store.setProp("isLoading", false)
      }
    },
    
    async bookTrip(tripId: string, bookingData: { pickup_point: string, dropoff_point: string }) {
      try {
        store.setProp("isLoading", true)
        
        const rootStore = getRootStore(store)
        const currentUserId = rootStore.profileStore.currentProfile?.id
        
        if (!currentUserId) {
          throw new Error("User not authenticated")
        }
        
        const { data, error } = await supabase
          .from("bookings")
          .insert({
            trip_id: tripId,
            passenger_id: currentUserId,
            pickup_point: bookingData.pickup_point,
            dropoff_point: bookingData.dropoff_point,
            status: "PENDING"
          })
          .select()
          .single()
        
        if (error) throw error
        
        const newBooking = {
          id: data.id,
          trip_id: data.trip_id,
          passenger_id: data.passenger_id,
          pickup_point: data.pickup_point,
          dropoff_point: data.dropoff_point,
          status: data.status,
          created_at: data.created_at,
          updated_at: data.updated_at
        }
        
        store.bookings.push(newBooking)
        return newBooking
      } catch (error) {
        console.error("Error booking trip:", error)
        throw error
      } finally {
        store.setProp("isLoading", false)
      }
    },
    
    async cancelBooking(bookingId: string) {
      try {
        store.setProp("isLoading", true)
        
        const { error } = await supabase
          .from("bookings")
          .update({ status: "CANCELED" })
          .eq("id", bookingId)
        
        if (error) throw error
        
        // Update local state
        const bookingIndex = store.bookings.findIndex(b => b.id === bookingId)
        if (bookingIndex >= 0) {
          store.bookings[bookingIndex].setProp("status", "CANCELED")
        }
        
        return true
      } catch (error) {
        console.error("Error canceling booking:", error)
        return false
      } finally {
        store.setProp("isLoading", false)
      }
    }
  }))
  .views((store) => ({
    get pendingBookings() {
      return store.bookings.filter(booking => booking.status === "PENDING")
    },
    
    get confirmedBookings() {
      return store.bookings.filter(booking => booking.status === "CONFIRMED")
    },
    
    get canceledBookings() {
      return store.bookings.filter(booking => booking.status === "CANCELED")
    },
    
    getBookingsByTripId(tripId: string) {
      return store.bookings.filter(booking => booking.trip_id === tripId)
    }
  }))

export interface BookingStore extends Instance<typeof BookingStoreModel> {}
export interface BookingStoreSnapshot extends SnapshotOut<typeof BookingStoreModel> {}