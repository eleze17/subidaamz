import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { NextApiRequest, NextApiResponse } from 'next'
import { createPresignedPost } from '@aws-sdk/s3-presigned-post';
import dotenv from 'dotenv'
import nextConnect from "next-connect";
import { createReadStream, unlink } from 'fs';
import multer from 'multer'

dotenv.config()

const s3Client = new S3Client({
  region: process.env.REGION,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY || '',
    secretAccessKey: process.env.SECRET_KEY || '',
  },
});

interface reqFile extends NextApiRequest{
  file:{
    filename:string,
    path:string
  },


}

const uploadToBucket =  async (req: reqFile) => {
    const stream = createReadStream(req.file.path);
     const params = {
         Bucket:process.env.S3_BUCKET_NAME!,
         Key:req.file.filename?.toString() || '',
         Body:stream
     };

       try {
         const data = await s3Client.send(new PutObjectCommand(params));
         return data; // For unit tests.
       } catch (err) {
         console.log("Error", err);
       }
 };

const storage = multer.diskStorage({
  destination: function (req: Express.Request, file: Express.Multer.File, callback: (error: Error | null, destination: string) => void) {
   callback(null, "data");
  null
},
filename: function (req: Express.Request, file: Express.Multer.File, callback: (error: Error | null, filename: string) => void) {
  
  callback(null,file.fieldname + '-' + Date.now() + '.jpg')
  null

}
});
const  imagenes = multer({storage:storage})

const apiRoute = nextConnect({
  //Handle any other HTTP method
  onNoMatch(req: NextApiRequest, res:NextApiResponse) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

const uploadMiddleware =  imagenes.single('file')

apiRoute.use(uploadMiddleware)
   
export default apiRoute.post( (req:reqFile, res:NextApiResponse)=> {

  console.log(req.file)
    uploadToBucket(req)
    
    .then( () =>{unlink(req.file.path, (err) => {
      if (err) throw err;
      console.log('path/file.txt was deleted');
    });

res.send('cargado')
    
   })})
  
     
  export const config = {
      api: {
        bodyParser:false,
          //sizeLimit: '5mb',
        },
    } 



  

 


  