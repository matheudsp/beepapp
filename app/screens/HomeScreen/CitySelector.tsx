// CitySelector.tsx
import React, { useEffect, useState } from "react";
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from "react-native";
import CitySuggestionsModal from "./CitySuggestionsModal"; // Importe o modal
import { translate, type TxKeyPath } from "@/i18n";
import { supabase } from "@/services/supabase/supabase";


const CITIES = [
  "São Paulo",
  "Rio de Janeiro",
  "Belo Horizonte",
  "Brasília",
  "Curitiba",
  "Salvador",
  "Fortaleza",
  "Manaus",
  "Recife",
  "Porto Alegre",
  "Floriano",
];
interface CitySelectorProps {
  value: string;
  onChangeText: (text: string) => void;
  labelTx: TxKeyPath;
  placeholderTx: TxKeyPath;
}
interface TripData {
  origin: string;
  destination: string;
}
export const CitySelector: React.FC<CitySelectorProps> = ({
  value,
  onChangeText,
  labelTx,
  placeholderTx
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false)

  const [cities, setCities] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  useEffect(() => {
    (async function load() {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("trips")
        .select("origin, destination");

      if (data && Array.isArray(data)) {
        const uniqueCities = new Set<string>(); // Use a Set to ensure uniqueness

        data.forEach((trip: TripData) => {
          if (trip.origin) {
            uniqueCities.add(trip.origin);
          }
          if (trip.destination) {
            uniqueCities.add(trip.destination);
          }
        });

        setCities(Array.from(uniqueCities)); // Convert the Set back to an array
      } else {
        // Handle error or no data case
        if (error) {
          console.error("Error fetching trips:", error);
        } else {
          console.warn("No trip data received.");
        }
        setCities([]); // Set cities to an empty array in case of error or no data
      }
      setIsLoading(false);
    })();
  }, [supabase]);

  const handleSelectCity = (city: string) => {
    onChangeText(city);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{translate(labelTx)}</Text>
      <TouchableOpacity
        style={styles.input}
        onPress={() => setModalVisible(true)}
      >
        <Text>{value || translate(placeholderTx
        )}</Text>
      </TouchableOpacity>

      <CitySuggestionsModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        cities={cities}
        onSelectCity={handleSelectCity}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,

  },
  label: {
    marginBottom: 5,
  },
  input: {
    borderWidth: 0,


    padding: 10,
  },
});



export default CitySelector;