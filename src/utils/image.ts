export async function loadImage(src: string, width?: number, height?: number, flipY?: boolean) {
  const image = new Image(width, height);

  return new Promise<HTMLImageElement>((resolve, reject) => {
    image.src = src;
    image.onerror = reject;
    image.onload = resolve.bind(null, image);

    if (flipY) {
      const { onload } = image;
      image.onload = () => {
        const can = document.createElement('canvas');
        const ctx = can.getContext('2d')!;
        can.width = image.width;
        can.height = image.height;
        ctx.transform(1, 0, 0, -1, 0, image.height);
        ctx.drawImage(image, 0, 0);
        image.src = can.toDataURL('image/png');
        image.onload = onload;
      };
    }
  });
}