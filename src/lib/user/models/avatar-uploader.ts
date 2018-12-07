import multer from "multer";
import * as path from "path";

const dir = path.resolve(path.dirname("lib"), "public", "uploads");

class AvatarUploader {
    private storage?: multer.StorageEngine;
    private uploader?: multer.Instance;

    constructor() {
        this.initStorage();
        this.initUploader();
    }

    public getAvatar() {
        return this.uploader!.single("avatar");
    }

    private initStorage() {
        this.storage = multer.diskStorage({
            destination: dir,
            filename: (req, file, cb) => {
                cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
            },
        });
    }

    private initUploader() {
        this.uploader = multer({
            storage: this.storage,
            limits: { fileSize: 1000000 },
            fileFilter: (req, file, cb) => {
                checkFileType(file, cb);
            },
        });
    }
}

function checkFileType(file: any, cb: any) {
    const filetypes = /jpeg|jpg|png|gif/;

    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb("Error: Images Only!");
    }
}

const avatar = (new AvatarUploader()).getAvatar();

export default avatar;
