// @ts-nocheck
import { isFunction } from '@monitorjs/shared';
import { ResourceErrorPayload } from '@monitorjstypes';

export const isHTMLLinkElement = (target: EventTarget): boolean => {
  return target.tagName.toLowerCase() === 'link';
};

export const getElementAttr = (target: EventTarget, attr: string): string => {
  if (isFunction(target.getAttribute)) {
    return target.getAttribute(attr) || '';
  }
  return target[attr] || '';
};

export const getDataFromEvent = (event: Event): ResourceErrorPayload => {
  const target = event.target || event.srcElement;

  if (!target) {
    return;
  }

  const tagName = target.tagName;

  if (!tagName) {
    return;
  }

  return {
    url: getElementAttr(target, isHTMLLinkElement(target) ? 'href' : 'src'),
    type: tagName,
    xpath: '',
  };
};
