export type FileAttachment = {
  id: number;
  name: string;
  extension: string;
  size: string;
  src: string;
  content_type: string;
};

export type AudioAttachment = {
  id: number;
  scr: string;
};

export type Attachment = {
  file?: FileAttachment;
  audio?: AudioAttachment;
};
