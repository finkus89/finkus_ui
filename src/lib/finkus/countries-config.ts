export type CountryId = "CO";

export interface CountryConfig {
  id: CountryId;          // Código interno del país (ISO2 simplificado)
  name: string;           // Nombre visible del país
  dialCode: string;       // Indicativo telefónico (e.g. "+57")
  iso2: string;           // Código ISO-2 para futuras banderas o librerías
  defaultTimezone: string; // Zona horaria principal
}

// MVP: Solo Colombia inicialmente. Se agregarán más países cuando corresponda.
export const COUNTRIES_CONFIG: Record<CountryId, CountryConfig> = {
  CO: {
    id: "CO",
    name: "Colombia",
    dialCode: "+57",
    iso2: "co",
    defaultTimezone: "America/Bogota",
  },
};
