const express= require("express");
const router = express.Router();
const User=require('../Model/model');
const multer=require('multer');
const vision = require('@google-cloud/vision');
const fs = require('fs');

const CREDENTIAL = JSON.parse(
    JSON.stringify({
      "type": "service_account",
      "project_id": "named-archway-409017",
      "private_key_id": "6ce395e6958504cf0eb7a00cd539389e7bf875ef",
      "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDPXdt3x1ADSNnp\n0hsEXrtEehoibdqYmdkRGIp/Rb0fjnJHkiZd83ijgPIc/CZrXei8JfJY4VKitgQf\nvLa5P8Zx2JNAoKYaaFK6Ityld1Q/oivQbR/kQ/6XmcTmsocGaF21GnmvcRYpWP5u\n2ktck2fIJLnIzw+x7EdV2Gmz3+H+yA8BU//mS9dkz8RT66RpQe8Xk3Va/Gx3ellE\n3+7u8r2T8UtJV27bwT0/wwVGusdhY4aYrbej70nS7vYYb0om0vguMlA3ZkJPKdAS\n2Ydc2AkxmpKKgWFbBKFJ5QdNv365+627HpfexgzPNMUGvOwqI+W/1FXBtnBcyw07\nXhdQ93uHAgMBAAECggEAH5kQsS7DfXdOD/gTuoBo5BAAXXtZ0jkB6j36v1a0G9Ph\nNrtex0rV+NbUOHXKW5VCuoYZvftk/nrieVI7PFKAfaaKbFBOdJBYUsQEf94wDfDl\n4OulRBYsUZN9J8jPvw/g1OYvi/vybDiDBLHqG+Aw8el5ZHpQzO7RFpP/Kgk/xEps\nj3OxPiq3D2lub17H0ID8t4RcxefhOMulpDZ+RXP+Ce6Ql3RU4654DvBnmX5TgHEj\n/TsUOx6s3/PzYoAUmLZGX7jFpafKy44svfmpZ6ngdvULGcrSZ1MZRYQiKVNuGyk6\nqo2GrMILKPJYJl8AcnSWY1sILFqWiFecC0cE+J5juQKBgQD/cnucCbq3oehCM+bN\nYYNtZEp02xwgIp6Xd2iTrtMhlsaDn0Ts/eDephMnBmHcfd+cTWOem99rUoOKjmxk\nqBnoyyNPZ8+ZRU2zHRfbE/+H3WS887kuHtk8SMKvNikRxHSgovN2iteLEjr7f2Oc\nne/c37Tcm2+idLHLqmGZh/OdYwKBgQDP0LzomnjpBMyljsp5CVAgBJbDPfOmO7sc\nyPFF1osIfKSpPl1Iz7Maz5O5ZAqwJdEQzASu8Kjb8po/It6hAxaiYwmrkD3bh9b2\nHnrx2YXLc9+l2iuDh1x8yVm5W1WZwzS3Qb5a2qjXZvUPMedGDz147XwwrYzb9wgd\nDEFH5q7EjQKBgQDR6+Ha9D/mIn680OwuAaHA5vctGtb9LZYIwU9Gdhf5dW+DwQIi\ng+wk7HO20U7gpOx7BToFoPC0wKVq2uoGugI4xZ8p5RS8TzCwLgtptQB8RZtAkEWw\nuhcprF2ZITgU6s4xKFhNJYJGPmAMR76zeTMh3xFBbdcKuT1XMphsVEYGIwKBgQCk\nIDhCAFXDus2hZ2+TPf6w+s7S7eey/vOdHTooLPPrRP2KyL1F1vueDhieT1t9mLBP\n8sE0JM9HvoeBm5l2UokawNsPS0D/U347LQFuZpwbfa1BQFgjbdFmoGMjV/X4FUpZ\n/StId+7nB+I9GO2N0FV9Xxo5G6fmxWf8AQTBs3eNtQKBgCW2cU1CT2CScvEAz+vz\nuU6IssL2X0IN/b8rvOpC8hn/mjqpWUtYybkT5Oxuuapztu5vMLagYIKzINz0zKPN\nqGl2vThZTDRJtXv0vvzBv2fk3ftM9B93xWrha4ExIipqqKOCzIZcb3qzDQQoJkX7\nkCGzet9LveD1aZx5M7/ITqWW\n-----END PRIVATE KEY-----\n",
      "client_email": "dhruv-709@named-archway-409017.iam.gserviceaccount.com",
      "client_id": "102749229370313380951",
      "auth_uri": "https://accounts.google.com/o/oauth2/auth",
      "token_uri": "https://oauth2.googleapis.com/token",
      "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
      "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/dhruv-709%40named-archway-409017.iam.gserviceaccount.com",
      "universe_domain": "googleapis.com"
    })
  );
  
  const Config = {
    credentials: {
      private_key: CREDENTIAL.private_key,
      client_email: CREDENTIAL.client_email,
    },
  };
  
  const client = new vision.ImageAnnotatorClient(Config);
// ocr();

// createUser.js
console.log('CreateUser route file executed.');


const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"./uploads/");
    },
    filename:(req,file,cb)=>{
        cb(null,file.originalname)
    }
})

const upload= multer({storage:storage});


// Extracting info from card 
var extractedInfo = {
    identification_number: '',
    first_name: '',
    lastName: '',
    dob: '',
    issueDate: '',
    expiryDate: '',
  };
const extractInfoFromOCR = (annotations) => {
   
    const highConfidenceText = annotations
      .filter((annotation) => annotation.confidence >= 0.98)
      .map((annotation) => annotation.description)
      .join('\n');

    console.log('Extracted Text (High Confidence):', highConfidenceText);
    extractedInfo = {
        identification_number: '',
        first_name: '',
        lastName: '',
        dob: '',
        issueDate: '',
        expiryDate: '',
      };
        
    const lines = annotations[0].description.split('\n');
let prev_line='';
    console.log(lines);
  
    lines.forEach((line) => {
      

        

        const idCardNumberMatch = line.match(/(\d{1} \d{4} \d{5} \d{2} \d{1})/);
        if (idCardNumberMatch !== null) {
          extractedInfo.identification_number = idCardNumberMatch[0];
        }
        
  
    //   if (line.includes('Name')) {
        const nameMatch = line.match(/Name (.+)/);
        
        if(nameMatch!=null)
        extractedInfo.first_name = nameMatch[1];
    //   }
  
      
        const lastNameMatch = line.match(/Last name (.+)/);
        // console.log("NAme ",lastNameMatch);
        if(lastNameMatch!=null)
        extractedInfo.lastName = lastNameMatch ? lastNameMatch[1] : '';
      
        const issueDateMatch = line.match(/(\d+ [A-Z][a-z]+ \d{4})/);
        // console.log("exc ",expiryDateMatch);
        if(issueDateMatch!=null && extractedInfo.issueDate=='' && extractedInfo.dob!='')
        extractedInfo.issueDate =issueDateMatch[1];
      
        const dobMatch = line.match(/Date of Birth (\d+ \S+ \d{4})/);
        if(dobMatch!=null && extractedInfo.dob=='')
        extractedInfo.dob = dobMatch ? dobMatch[1] : '';
      
  
    //   if (line.includes('Date of Issue')) {
    //     const issueDateMatch = prev_line.match(/(\d+ \S+ \d{4})/);
    //     console.log("asdfa ",issueDateMatch);
    //     extractedInfo.issueDate = issueDateMatch[0];
    //   }
    
  
    //   if (line.includes('Date of Expiry')) {
        const expiryDateMatch = line.match(/(\d+ \S+ \d{4})/);
        // console.log("exc ",expiryDateMatch);
        if(expiryDateMatch!=null)
        extractedInfo.expiryDate =expiryDateMatch[1];
    //   }
      prev_line=line;
    });
  
    return extractedInfo;
    
  };
// Detect text from image

const detectText = async (file_path) => {
    try {
      const imageBuffer = fs.readFileSync(file_path);
  
      const [result] = await client.textDetection(imageBuffer);
      const annotations = result.textAnnotations;
  
      const extractedInfo = extractInfoFromOCR(annotations);
  
      console.log('Extracted Information:', extractedInfo);
      return extractedInfo;
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

router.post('/create_user',upload.single('uploadedImage'), async(req,res)=>{
    console.log(req.file);
    try{

        
 
     await detectText(req.file.path);
    //  if user already present the update the existing detail
     let user=await User.findOne({identification_number:extractedInfo.identification_number});
     if(user){

        const updatedata={};
        
        await User.replaceOne({ _id: user._id }, extractedInfo);
         res.json(user);

         return;
     }
     console.log("here");
     user = new User(extractedInfo);
     const newuser= await user.save();
    // res.json(extractedInfo);
       res.json(newuser);

   
   }
   catch(errors){
       console.error(errors.message);
       res.status(500).json("ERROR found");
   }

});

module.exports = router;