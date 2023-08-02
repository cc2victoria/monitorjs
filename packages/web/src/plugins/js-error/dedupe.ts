import { reportSelfError } from '@monitorjs/shared';
import { JsError } from '@monitorjstypes';
const _shouldDropEvent = (currentEvent: JsError, previousEvent: JsError): boolean => {
  if (!previousEvent) {
    return false;
  }

  if (!currentEvent) {
    return false;
  }

  if (_isSameMessage(currentEvent.message, previousEvent.message)) {
    return true;
  }

  if (_isSameMessage(currentEvent.stack, previousEvent.stack)) {
    return true;
  }

  return false;
};

const _isSameMessage = (curentMessage: String | undefined, perviousMessage: String | undefined): boolean => {
  return curentMessage && perviousMessage && curentMessage === perviousMessage ? true : false;
};

export const dedupeFn = () => {
  let _previousError: JsError;

  return (currentError: JsError) => {
    try {
      if (_shouldDropEvent(_previousError, currentError)) {
        _previousError = currentError;

        return undefined;
      }
    } catch (error) {
      reportSelfError(error, 'dedupeFn');
    }

    _previousError = currentError;
    return currentError;
  };
};
