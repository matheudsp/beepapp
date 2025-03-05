// CitySuggestionsModal.tsx
import { Icon } from "@/components";
import type { ThemedStyle } from "@/theme";
import { useAppTheme } from "@/utils/useAppTheme";
import React, { useState } from "react";
import {
  Modal,
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  type ViewStyle,
  type TextStyle,
} from "react-native";
import { Text } from "@/components";
interface CitySuggestionsModalProps {
  visible: boolean;
  onClose: () => void;
  cities: string[];
  onSelectCity: (city: string) => void;
}

const CitySuggestionsModal: React.FC<CitySuggestionsModalProps> = ({
  visible,
  onClose,
  cities,
  onSelectCity,
}) => {
  const [searchText, setSearchText] = useState("");
  const { themed, theme: {colors} } = useAppTheme()
  const filteredCities = cities.filter((city) =>
    city.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <Modal visible={visible} animationType="fade" transparent={true} >
      <View style={themed($modalContainer)}>

        <View style={themed($modalContent)}>
          <Text preset="heading" style={{marginBottom:8}}>Busque a cidade</Text>
          <TextInput
            style={themed($searchInput)}
            placeholder="Buscar cidade..."
            value={searchText}
            onChangeText={setSearchText}
          />
          <FlatList
            data={filteredCities}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={themed($suggestionItem)}
                onPress={() => {
                  onSelectCity(item);
                  onClose();
                }}
              >
                <Text style={themed($suggestionText)}>{item} </Text>
                <Icon color={'rgba(255,255,255,0.9)' } icon="next" />
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity style={themed($closeButton)} onPress={onClose}>
            <Text style={themed($closeButtonText)}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const $modalContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flex: 1,

  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "rgba(0, 0, 0, 0.5)",

})
const $modalContent: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  backgroundColor: colors.background,
  padding: spacing.lg,
  borderRadius: spacing.xs,
  width: "90%",
  paddingVertical: spacing.lg

})

const $searchInput: ThemedStyle<TextStyle> = ({ spacing, colors }) => ({

  borderWidth: 0,
  borderRadius: spacing.xxs,
  padding: spacing.md,
  backgroundColor: colors.palette.neutral300,
  color: colors.textDim,
  fontSize: spacing.md,
  fontWeight: '600',
  marginBottom: spacing.xs


})


const $suggestionText: ThemedStyle<TextStyle> = ({ spacing, colors }) => ({
  color: 'rgba(255,255,255,0.9)',
  fontSize: spacing.md,
  fontWeight: '600',
  flex: 1,
  alignItems: 'center',
  marginLeft: spacing.lg


})
const $suggestionItem: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  padding: spacing.sm,
  borderRadius: spacing.xxs,
  backgroundColor: colors.palette.primary500,
  marginVertical: spacing.xxs,
  flex: 1,
  flexDirection: 'row',


})
const $closeButton: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginTop: 10,
  alignSelf: "flex-end",

})
const $closeButtonText: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  color: colors.error,
  fontWeight: '600',
  fontSize: spacing.md

})

export default CitySuggestionsModal;