// CitySelector.tsx
import React, { useEffect, useState } from "react";
import { View, TextInput, TouchableOpacity,  StyleSheet, type TextStyle, type ViewStyle } from "react-native";
import CitySuggestionsModal from "./CitySuggestionsModal"; // Importe o modal
import { translate, type TxKeyPath } from "@/i18n";
import { supabase } from "@/services/supabase/supabase";
import type { ThemedStyle } from "@/theme";
import { useAppTheme } from "@/utils/useAppTheme";
import { Text } from "@/components";


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
  const { themed} = useAppTheme()
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
    <View style={themed($container)}>
      <Text preset="default" style={themed($label)}>{translate(labelTx)}</Text>
      <TouchableOpacity
        style={themed($input)}
        onPress={() => setModalVisible(true)}
      >
        <Text  preset="bold" style={themed($text)}>{value || translate(placeholderTx
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



const $container: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom:spacing.sm,
  
})

const $label: ThemedStyle<TextStyle> = ({ spacing,colors}) => ({
  marginBottom:spacing.sm,
  color:	'rgba(255,255,255,0.90)',
  
})
const $text: ThemedStyle<TextStyle> = ({ spacing,colors }) => ({
  color:	'rgba(255,255,255,0.50)',
  fontWeight:"500",
  fontSize:spacing.md
})


const $input: ThemedStyle<ViewStyle> = ({ spacing ,colors}) => ({
  borderWidth:0,
  padding:spacing.md,
  backgroundColor: colors.palette.primary500,
  borderRadius:spacing.xxs
})



export default CitySelector;