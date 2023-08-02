export const transportByImage = (url: string, body?: string) => {
  let imgSender: HTMLImageElement | undefined = new Image();

  imgSender.onload = imgSender.onerror = () => {
    imgSender = undefined;
  };

  imgSender.src = `${url}${body ? `?param=${JSON.stringify(body)}` : ''}`;
};
