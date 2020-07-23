export class Attachment {
  id: number;
  type:	"image" | "file";
  originalFilename:	string;
  md5: string;
  size: number;
  createdAt: string;
}
