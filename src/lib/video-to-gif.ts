const EMOJI_SIZE = 128;
const MAX_DURATION = 5; // seconds
const MAX_VIDEO_SIZE = 20 * 1024 * 1024; // 20MB
const FPS = 10;

const VIDEO_TYPES = ["video/mp4", "video/quicktime", "video/webm"];

export const isVideoFile = (file: File): boolean => VIDEO_TYPES.includes(file.type);

export const validateVideoFile = (file: File): string | null => {
  if (!VIDEO_TYPES.includes(file.type)) {
    return "MP4, MOV, WebM 동영상만 지원합니다";
  }
  if (file.size > MAX_VIDEO_SIZE) {
    return "동영상 크기는 20MB 이하여야 합니다";
  }
  return null;
};

export const getVideoDuration = (file: File): Promise<number> =>
  new Promise((resolve, reject) => {
    const video = document.createElement("video");
    video.preload = "metadata";
    video.onloadedmetadata = () => {
      URL.revokeObjectURL(video.src);
      resolve(video.duration);
    };
    video.onerror = () => {
      URL.revokeObjectURL(video.src);
      reject(new Error("동영상을 읽을 수 없습니다"));
    };
    video.src = URL.createObjectURL(file);
  });

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let ffmpegInstance: any = null;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getFFmpeg = async (onProgress?: (progress: number) => void): Promise<any> => {
  if (ffmpegInstance?.loaded) {
    if (onProgress) {
      ffmpegInstance.on("progress", ({ progress }: { progress: number }) =>
        onProgress(Math.round(progress * 100))
      );
    }
    return ffmpegInstance;
  }

  const origin = window.location.origin;

  // public/ffmpeg/ 에서 로컬 ESM 로드 (같은 origin이라 Worker CORS 문제 없음)
  // @ts-expect-error local ESM import
  const { FFmpeg } = await import(/* webpackIgnore: true */ `${origin}/ffmpeg/ffmpeg/index.js`);
  const ffmpeg = new FFmpeg();

  ffmpeg.on("log", ({ message }: { message: string }) => {
    if (process.env.NODE_ENV === "development") {
      console.log("[FFmpeg]", message);
    }
  });

  if (onProgress) {
    ffmpeg.on("progress", ({ progress }: { progress: number }) =>
      onProgress(Math.round(progress * 100))
    );
  }

  await ffmpeg.load({
    coreURL: `${origin}/ffmpeg/core/ffmpeg-core.js`,
    wasmURL: `${origin}/ffmpeg/core/ffmpeg-core.wasm`,
  });

  ffmpegInstance = ffmpeg;
  return ffmpeg;
};

type ConvertOptions = {
  onProgress?: (progress: number) => void;
};

export const convertVideoToGif = async (file: File, options?: ConvertOptions): Promise<File> => {
  const duration = await getVideoDuration(file);
  if (duration > MAX_DURATION) {
    throw new Error(
      `동영상 길이는 ${MAX_DURATION}초 이하여야 합니다 (현재 ${Math.round(duration)}초)`
    );
  }

  const ffmpeg = await getFFmpeg(options?.onProgress);

  const origin = window.location.origin;
  // @ts-expect-error local ESM import
  const { fetchFile } = await import(/* webpackIgnore: true */ `${origin}/ffmpeg/util/index.js`);

  const inputName = "input" + getExtension(file.type);
  await ffmpeg.writeFile(inputName, await fetchFile(file));

  // 동영상 → 128x128 GIF 변환 (10fps, 256색)
  await ffmpeg.exec([
    "-i",
    inputName,
    "-vf",
    `fps=${FPS},scale=${EMOJI_SIZE}:${EMOJI_SIZE}:force_original_aspect_ratio=increase,crop=${EMOJI_SIZE}:${EMOJI_SIZE},split[s0][s1];[s0]palettegen=max_colors=256[p];[s1][p]paletteuse=dither=bayer`,
    "-loop",
    "0",
    "-t",
    String(MAX_DURATION),
    "output.gif",
  ]);

  const data = await ffmpeg.readFile("output.gif");
  const blob = new Blob([new Uint8Array(data as Uint8Array)], { type: "image/gif" });

  // Cleanup
  await ffmpeg.deleteFile(inputName);
  await ffmpeg.deleteFile("output.gif");

  const gifName = file.name.normalize("NFC").replace(/\.[^.]+$/, ".gif");
  return new File([blob], gifName, { type: "image/gif" });
};

const getExtension = (mimeType: string): string => {
  switch (mimeType) {
    case "video/mp4":
      return ".mp4";
    case "video/quicktime":
      return ".mov";
    case "video/webm":
      return ".webm";
    default:
      return ".mp4";
  }
};
