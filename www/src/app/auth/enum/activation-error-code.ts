export enum ActivationErrorCode {
  INCORRECT_ACTIVATION_TOKEN = 'incorrect-activation-token',
  ALREADY_ACTIVATED = 'already-activated',
  ACTIVATION_TOKEN_EXPIRED = 'activation-token-expired',
  NOT_ACTIVATED = 'not-activated',
  INVALID_GRANT = 'invalid_grant' // Здесь именно с символом подчёркивания
}
