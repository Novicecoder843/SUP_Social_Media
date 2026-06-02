const multer = require("multer");
const path = require("path");

/////////////////////////////////////////////////////
// STORAGE
/////////////////////////////////////////////////////

const storage =
  multer.diskStorage({

    destination:
      (req,file,cb)=>{

        cb(
          null,
          "uploads/"
        );
      },

    filename:
      (req,file,cb)=>{

        cb(
          null,
          Date.now() +
          path.extname(
            file.originalname
          )
        );
      }
  });

/////////////////////////////////////////////////////
// FILE FILTER
/////////////////////////////////////////////////////

const fileFilter =
  (req,file,cb)=>{

    const allowed =
      [
        "image/png",
        "image/jpeg",
        "image/jpg",
        "video/mp4",
        "video/mpeg",
        "video/webm"
      ];

    if(
      allowed.includes(
        file.mimetype
      )
    ){

      cb(null,true);

    } else {

      cb(
        new Error(
          "Invalid file type"
        ),
        false
      );
    }
  };

/////////////////////////////////////////////////////
// MULTER
/////////////////////////////////////////////////////

module.exports =
  multer({

    storage,

    fileFilter,

    limits:{
      fileSize:
        50 * 1024 * 1024
    }
  });