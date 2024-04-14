import { isFunction, path, compose } from "~/common/func";

export const isMobileKeyboardAvailable = () => compose(isFunction, path(['Keyboard', 'hide']))(window)