import { ActivationErrorCode } from "../enum/activation-error-code";

export const ActivationErrorCodeLabels: {[key: string]: string} = {};
export const ActivationErrorCodeDescriptions: {[key: string]: string} = {};

ActivationErrorCodeLabels[ActivationErrorCode.INCORRECT_ACTIVATION_TOKEN] = 'Некорректный код активации';
ActivationErrorCodeLabels[ActivationErrorCode.ALREADY_ACTIVATED] = 'Профиль уже был активирован ранее';
ActivationErrorCodeLabels[ActivationErrorCode.ACTIVATION_TOKEN_EXPIRED] = 'Срок действия ссылки истёк';
ActivationErrorCodeLabels[ActivationErrorCode.NOT_ACTIVATED] = 'Необходима активация';

ActivationErrorCodeDescriptions[ActivationErrorCode.INCORRECT_ACTIVATION_TOKEN] = 'Не удалось активировать профиль из-за некорректного кода активации.';
ActivationErrorCodeDescriptions[ActivationErrorCode.ALREADY_ACTIVATED] = 'Ваш профиль уже был активирован, повторная активация не требуется.';
ActivationErrorCodeDescriptions[ActivationErrorCode.ACTIVATION_TOKEN_EXPIRED] = 'Не удалось активировать профиль, так как срок действия ссылки истёк. Вы можете запросить письмо для активации повторно.';
ActivationErrorCodeDescriptions[ActivationErrorCode.NOT_ACTIVATED] = 'Вы зарегистрированы в системе Marketplace, но еще не подтвердили свою регистрацию. Для активации аккаунта перейдите по ссылке, отправленной на электронную почту, указанную Вами при регистрации.';
