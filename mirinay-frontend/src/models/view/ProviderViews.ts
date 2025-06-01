import ViewProperties from "./ViewProperties.ts";

// Propriedades retornadas pelo ViewProvider
export default interface ProviderViews {
    primary: ViewProperties;
    secondary?: ViewProperties;
    tertiary?: ViewProperties;
}
