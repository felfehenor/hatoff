const atlasCanvases = {};
const spriteCanvases = {};

function clampHue(degrees) {
  degrees = isFinite(degrees) ? degrees % 360 : 0;
  return degrees > 0 ? degrees : degrees + 360;
}

function rgbToHSV({ r, g, b }) {
  const max = Math.max(r, g, b);
  const delta = max - Math.min(r, g, b);

  const hh = delta
    ? max === r
      ? (g - b) / delta
      : max === g
      ? 2 + (b - r) / delta
      : 4 + (r - g) / delta
    : 0;

  return {
    h: 60 * (hh < 0 ? hh + 6 : hh),
    s: max ? (delta / max) * 100 : 0,
    v: (max / 255) * 100,
  };
}

function hsvToRGB({ h, s, v }) {
  h = (h / 360) * 6;
  s = s / 100;
  v = v / 100;

  const hh = Math.floor(h),
    b = v * (1 - s),
    c = v * (1 - (h - hh) * s),
    d = v * (1 - (1 - h + hh) * s),
    module = hh % 6;

  return {
    r: [v, c, b, b, d, v][module] * 255,
    g: [d, v, v, c, b, b][module] * 255,
    b: [b, b, d, v, v, c][module] * 255,
  };
}

function hsvToHSL({ h, s, v }) {
  const hh = ((200 - s) * v) / 100;

  return {
    h,
    s:
      hh > 0 && hh < 200
        ? ((s * v) / 100 / (hh <= 100 ? hh : 200 - hh)) * 100
        : 0,
    l: hh / 2,
  };
}

function hslToHSV({ h, s, l }) {
  s *= (l < 50 ? l : 100 - l) / 100;

  return {
    h: h,
    s: s > 0 ? ((2 * s) / (l + s)) * 100 : 0,
    v: l + s,
  };
}

function rgbToHSL({ r, g, b }) {
  return hsvToHSL(rgbToHSV({ r, g, b }));
}

function hslToRGB({ h, s, l }) {
  return hsvToRGB(hslToHSV({ h, s, l }));
}

function transformRGBTupleByHSLValues(rgbData, mod) {
  const hsl = rgbToHSL({ r: rgbData[0], g: rgbData[1], b: rgbData[2] });
  const rgb = hslToRGB({
    h: hsl.h + mod[0],
    s: hsl.s + mod[1],
    l: hsl.l + mod[2],
  });

  return [rgb.r, rgb.g, rgb.b];
}

self.onmessage = (event) => {
  const { action } = event.data;

  if (action === 'initatlas') {
    const { key, canvas, image } = event.data;

    const context = canvas.getContext('2d', {
      willReadFrequently: true,
    });

    context.drawImage(image, 0, 0, image.width, image.height);

    atlasCanvases[key] = canvas;
  }

  if (action === 'transferspritecanvas') {
    const { id, canvas } = event.data;
    spriteCanvases[id] = canvas;
  }

  if (action === 'renderpartontowhole') {
    const { id, key, coordinates, imageSize, imgRotation, partCanvas } =
      event.data;

    const spriteCanvas = spriteCanvases[id];

    const refImageData = atlasCanvases[key]
      ?.getContext('2d')
      ?.getImageData(
        coordinates.x,
        coordinates.y,
        coordinates.width,
        coordinates.height,
      );

    if (!refImageData) return;

    const partCtx = partCanvas.getContext('2d');
    partCtx?.putImageData(refImageData, 0, 0);

    const partImageData = partCtx?.getImageData(0, 0, imageSize, imageSize);

    const partImageDataBits = partImageData?.data ?? [];

    for (let i = 0; i < partImageDataBits.length; i += 4) {
      const rgb = [
        partImageDataBits[i + 0],
        partImageDataBits[i + 1],
        partImageDataBits[i + 2],
      ];

      const newRGB = transformRGBTupleByHSLValues(rgb, imgRotation);

      partImageDataBits[i + 0] = newRGB[0];
      partImageDataBits[i + 1] = newRGB[1];
      partImageDataBits[i + 2] = newRGB[2];
    }

    // apply it to the result
    partCtx?.putImageData(partImageData, 0, 0);
    spriteCanvas
      .getContext('2d')
      ?.drawImage(partCanvas, 0, 0, imageSize, imageSize);

    self.postMessage({ action: 'piece', id });
  }

  if (action === 'clear') {
    const { id } = event.data;
    spriteCanvases[id]
      .getContext('2d')
      .clearRect(0, 0, spriteCanvases[id].width, spriteCanvases[id].height);
  }

  if (action === 'destroy') {
    const { id } = event.data;
    spriteCanvases[id]
      ?.getContext('2d')
      ?.clearRect(0, 0, spriteCanvases[id].width, spriteCanvases[id].height);

    delete spriteCanvases[id];
  }
};
