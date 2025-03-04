import { TextField } from "@/components/TextField";
import type { TxKeyPath } from "@/i18n";
import type { ThemedStyle } from "@/theme";
import { useAppTheme } from "@/utils/useAppTheme";
import React, { useRef, useState } from "react";
import { View, FlatList, TouchableOpacity, Text, type TextInput, type ViewStyle } from "react-native";


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
  "Floriano"
];
interface CitySelectorProps {
  value: string;
  onChangeText: (text: string) => void; // Define corretamente o tipo
  labelTx: TxKeyPath | undefined;
  placeholderTx: TxKeyPath | undefined;
}


export const CitySelector: React.FC<CitySelectorProps> = ({
  value,
  onChangeText,
  labelTx,
  placeholderTx,
}) => {
  const [filteredCities, setFilteredCities] = useState<string[]>([]);
  const Input = useRef<TextInput>(null)
  const { themed, theme: { colors } } = useAppTheme()
  
  const handleSearch = (text: string) => {
    onChangeText(text);

    if (text.length > 0) {
      const filtered = CITIES.filter((city) =>
        city.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredCities(filtered);
    } else {
      setFilteredCities([]);
    }
  };

  const handleSelectCity = (city: string) => {
    onChangeText(city);
    setFilteredCities([]); // Esconde as sugestões após selecionar
  };

  return (
    <View style={{ position: "relative" }}>
      <TextField
        value={value}
        onChangeText={handleSearch}
        style={themed($textInput)}
      containerStyle={themed($textField)}
      inputWrapperStyle={themed(textInputWrapper)} // Mantendo os estilos do TextField
          labelTx={labelTx}
       placeholderTx={placeholderTx}
      onSubmitEditing={() => Input.current?.focus()}
      />
    

      {filteredCities.length > 0 && (
        <FlatList
          data={filteredCities}
          keyExtractor={(item) => item}
          style={{
            position: "absolute",
            top: 60, // Ajuste para alinhar corretamente abaixo do TextField
            width: "100%",
            backgroundColor: "white",
            borderRadius: 8,
            borderWidth: 1,
            borderColor: "#ccc",
            zIndex: 10,
          }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={{ padding: 12, borderBottomWidth: 1, borderBottomColor: "#ddd" }}
              onPress={() => handleSelectCity(item)}
            >
              <Text>{item}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const $textInput: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  height: spacing.xxl,

})

const textInputWrapper: ThemedStyle<ViewStyle> = ({ colors }) => ({
  borderWidth: 0,
  backgroundColor: colors.palette.primaryopacity
})
const $textField: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.xxxs,
  width: '95%',


})