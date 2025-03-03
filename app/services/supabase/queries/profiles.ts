import { supabase } from "../supabase";
export type ProfileType = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number?: string | null;
  profile_image?: string | null;
  role: "DRIVER" | "PASSENGER";
};

export const profileService = {
  /**
   * Busca todos os perfis cadastrados no banco de dados
   * @returns {Promise<ProfileType[]>} Lista de perfis
   */
  findAll: async (): Promise<ProfileType[]> => {
    const { data, error } = await supabase
      .from("profiles")
      .select("id, first_name, last_name, email, phone_number, profile_image, role");

    if (error) {
      console.error("Erro ao buscar perfis:", error.message);
      throw new Error("Não foi possível buscar os perfis");
    }

    return data as ProfileType[];
  },

  /**
   * Busca um perfil pelo ID
   * @param id ID do perfil
   * @returns {Promise<ProfileType | null>} Perfil encontrado ou null
   */
  findById: async (id: string): Promise<ProfileType | null> => {
    const { data, error } = await supabase
      .from("profiles")
      .select("id, first_name, last_name, email, phone_number, profile_image, role")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Erro ao buscar perfil:", error.message);
      return null;
    }

    return data as ProfileType;
  },
};
