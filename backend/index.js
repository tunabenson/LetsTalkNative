
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
const Perspective = require('perspective-api-client');
const db = admin.firestore();
const perspective = new Perspective({apiKey: functions.config().perspective.api_key});
const { TextServiceClient } = require('@google-ai/generativelanguage');
const { GoogleAuth } = require('google-auth-library');
const palmClient = new TextServiceClient({
  authClient: new GoogleAuth().fromAPIKey(functions.config().palm.api_key),
});

//-------------------------------------------------------------------------------------------------------------
exports.BiasEvaluation= functions.firestore.document('posts/{postId}').onWrite(async (change, context) => {
    if(!(change.after.data().usePoliticalAnalysis)){
      return null;
    }
    const newValue = change.after.data();
    if(change.before.get('text')===change.after.get('text'))return;
    // Check if the document was created or updated and contains the 'text' field
    if (!newValue || !newValue.text) {
      console.log('No text field found or document was deleted');
      return;
    }

    const { text } = newValue;

    // Construct a custom prompt
    const customPrompt = `Define the political views for the text below? 
Options: 
-left
 -center
 -right

Please print each category name along with a number from 0-1000 indicating the strength of that category. 
format exactly like this:  "right:x, center:y, left:z "

Text: ${text}

you may use context clues like the forum name:${newValue.forum} to evaluate this
`;

    try {
      // Call the PaLM API
      const [response] = await palmClient.generateText({

        model:'models/text-bison-001',
        prompt: {
          text: customPrompt,
        },
        temperature: 0.3, 
        candidateCount: 3, 
      });

      const generatedText = response.candidates[2].output;
      
      if(generatedText){
        const biasEvaluation = {};
        generatedText.split(',').forEach(pair => {
          const [key, value] = pair.split(':').map(part => part.trim());
          biasEvaluation[key] = parseFloat(value);
        });
        await change.after.ref.update({ generatedText, biasEvaluation});
    }
    else{ 
        await change.after.ref.update({generatedText:'not related'});
    }
    
      // Update the Firestore document with the generated text
    

      console.log('Document updated with generated text:', generatedText);
    } catch (error) {
      console.error('Error generating text with PaLM API:', error);
    }
  });
//-------------------------------------------------------------------------------------------------------------
  exports.createPost = functions.runWith({timeoutSeconds: 540,memory: '2GB'}).https.onCall(async (data, context) => {
    const currentUser = context.auth; 
    if (!currentUser) {
      throw new functions.https.HttpsError('unauthenticated', 'The function must be called while authenticated.');
    }

    const text = data.post.text;
    
    // Check toxicity
    try {
      const result = await perspective.analyze(text, {attributes: ['toxicity', 'IDENTITY_ATTACK', 'INSULT', 'THREAT', 'SEVERE_TOXICITY']});
      
   
      for (const [key, value] of Object.entries(result.attributeScores)) {
        if (value?.summaryScore?.value >= 0.4) {
          return {header: 'Declined', message: 'Sorry, your post does not meet our community guidelines, please rewrite before posting'};
        }
      }
    } catch (error) {
      console.error('Error evaluating toxicity:', error.message); 
      throw new functions.https.HttpsError('internal', 'Error evaluating toxicity.');
    }
    
if(!data?.isResponse){
  const customPrompt = `identify whether or not the text below is relevant and contributing to mature discussion to the forum below?
Options:
-yes
-no
Please print ONLY one category
Text: ${text}
Forum: ${data.forum}`;

    try {
      const [response] = await palmClient.generateText({
        model: 'models/text-bison-001', 
        prompt: {
          text: customPrompt,
        },
        temperature: 0.2, // Adjust temperature in future?
        candidateCount: 1, // Num responses
      });
      const generatedText = response.candidates[0]?.output;
      if (!generatedText || generatedText.trim() === 'no') {
        return {header: 'Declined', message: 'Sorry, your post is either not contributing or irrelevant to the forum'};
      }
    } catch (error) {
      console.error('Error with PaLM:', error.message);
    }}
    try {
      db.collection(data.path).add({
        ...data.post,
        forum: data.forum,
        date: admin.firestore.Timestamp.now()
      });
      return {header: 'Success', message: `Your post has been uploaded to the forum ${data?.forum}`};
    } catch (error) {
      console.error('Error saving post:', error.message);
      console.log(data);
      throw new functions.https.HttpsError('unavailable', 'Error saving post.');
    }
  });
//-------------------------------------------------------------------------------------------------------------
const firebase_tools = require('firebase-tools');
const { getAuth } = require('firebase-admin/auth');
//-------------------------------------------------------------------------------------------------------------
exports.deletePost = functions.runWith({timeoutSeconds: 540,memory: '2GB'}).https.onCall(async (data, context) => {
    const { path } = data;
    const currentUser = context.auth;
    const user= (await getAuth().getUser(currentUser.token.uid));
   
    // Check if the user is authenticated
    if (!currentUser) {
      throw new functions.https.HttpsError('unauthenticated', 'The function must be called while authenticated.');
    }

    // Reference to the post in Firestore
    const postRef = db.doc(path);
    const postDoc = await postRef.get();

    // Check if the post exists
    if (!postDoc.exists) {
      throw new functions.https.HttpsError('not-found', 'Post not found.');
    }

    const username = postDoc.get('username');

    // Check if the current user is the owner of the post
    if (username !==  user.displayName) {
      throw new functions.https.HttpsError('permission-denied', `User does not have permission to delete this post.${user.displayName}`);
    }

    // Delete the post and all its subcollections

    firebase_tools.firestore
      .delete(postRef.path, {
        project: process.env.GCLOUD_PROJECT,
        recursive: true,
        force: true,
        token: functions.config().fb.token,
      });
      
    
});
//-------------------------------------------------------------------------------------------------------------
/**
 * @deprecated not being used currently
 */
exports.sendWelcomeEmail = functions.auth.user().onCreate(async (user) => {
  const email = user.email;
  const displayName = user.displayName;

  try {
    // Generate email verification link
    const verificationLink = await admin.auth().generateEmailVerificationLink(email);

    // Create email content
    const mailOptions = {
      from: "example@gmail.com",
      to: email,
      subject: 'Glad to see you here!',
      html: `
        <h1>Welcome, ${displayName || 'Valued User'}!</h1>
        <p>We're thrilled to have you with us. Thank you for signing up! We can't wait for you to explore all that our platform has to offer. To get started, please verify your email address by clicking the link below:</p>
        <a href="${verificationLink}" style="display: inline-block; padding: 10px 20px; background-color: #28a745; color: #ffffff; text-decoration: none; border-radius: 5px;">Verify Email</a>
        <p>If you didn't sign up for this account, please ignore this email.</p>

      `
    };

    const nodemailer = require('nodemailer');
    
    const transporter = nodemailer.createTransport({
      service: 'gmail',
    
      auth: {
        
        user: 'leaveblank',
        pass: 'leaveblank',
      },
    });

    await transporter.sendMail(mailOptions);
    console.log('Welcome email sent to:', email);

  } catch (error) {
    console.error('Error sending welcome email:', error);
  }
});
//-------------------------------------------------------------------------------------------------------------
const { HttpsError } = require('firebase-functions/v1/auth');
const parser = require('html-metadata-parser');
const userAgents = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; WOW64; rv:54.0) Gecko/20100101 Firefox/54.0",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.246",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.3 Safari/605.1.15",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:78.0) Gecko/20100101 Firefox/78.0",
  "Mozilla/5.0 (Linux; Android 10; SM-A505FN) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.125 Mobile Safari/537.36",
  "Mozilla/5.0 (iPhone; CPU iPhone OS 13_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.2 Mobile/15E148 Safari/604.1",
  "Mozilla/5.0 (iPad; CPU OS 13_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/85.0.4183.109 Mobile/15E148 Safari/604.1",
  "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:55.0) Gecko/20100101 Firefox/55.0"
];

//-------------------------------------------------------------------------------------------------------------
exports.getArticleTitle=functions.https.onCall(async (data, context)=>{
  try {
    const agent=userAgents[Math.floor(Math.random() * userAgents.length)];
    
    const result = await parser.parse(data.url, {headers:
          {'User-Agent': agent,

}});




    const title = result.meta.title; // Access title from meta data
    let imageUrl = null;

    // Try to get the image URL from Open Graph data if available
    if (result.og && result.og.image) {
      imageUrl = result.og.image;
      return { title, imageUrl };
    }

    return { title };
  
  } catch (error) {
    console.error('Failed to retrieve metadata:', error);
    return {title:'Article',};
  }
}
);
//-------------------------------------------------------------------------------------------------------------
exports.checkUsernameAndEmailAvailability = functions.https.onCall(async (data, context) => {
  const email = data.email;
  const username = data.username;

  if (!email || !username) {
      throw new functions.https.HttpsError('invalid-argument', 'Email and username must be provided.');
  }

  // Check if email exists in Authentication service
  let emailExists = false;
  try {
      const userRecord = await admin.auth().getUserByEmail(email);
      if (userRecord) {
          emailExists = true;
      }
  } catch (error) {
      if (error.code !== 'auth/user-not-found') {
          throw new functions.https.HttpsError('internal', error.code);
      }
  }

  // Check if username exists in Firestore in authentication service
  const usernameQuerySnapshot = await db.collection('users').where('username', '==', username).get();
  const usernameExists = !usernameQuerySnapshot.empty;

  return {
      emailExists: emailExists,
      usernameExists: usernameExists
  };

});
//-------------------------------------------------------------------------------------------------------------
exports.getConversation= functions.https.onCall(async (data, context)=>{
  const determineDepth = (path) => {
    const segments = path.split('/').filter(segment => segment.length > 0);
    return segments.length;
  };
  let path=data.path; //path to original post
  if(determineDepth(path)<100){
    const startAfter= data.startAfter;
        path=path.concat('/replies');
        let snapshot;
        if(startAfter){
          snapshot= await db.collection(path).orderBy('date', 'desc').startAfter(startAfter).limit(1).get();
        }
        else{
          snapshot= await db.collection(path).orderBy('date', 'desc').limit(1).get();
        }
      if(snapshot.empty){
        throw new HttpsError('not-found', 'there is no replies to this post');
      }
      const response= snapshot.docs[0].data();
      response.path=snapshot.docs[0].ref.path;
      return  response;
  }   
});
//-------------------------------------------------------------------------------------------------------------
exports.editPost= functions.runWith({timeoutSeconds: 540,memory: '1GB'}).https.onCall(async(data, context)=>{
  const currentUser = context.auth.uid; 
    if (!currentUser) {
      throw new functions.https.HttpsError('unauthenticated', 'The function must be called while authenticated.');
    }

    const post = await db.doc(data.path).get();
   

    // Check if the post exists
    if (!post.exists) {
      throw new functions.https.HttpsError('not-found', 'Post not found.');
    }

    const username = post.get('username');
    // Check if the current user is the owner of the post
    if (username !==  (await admin.auth().getUser(currentUser)).displayName) {
      throw new functions.https.HttpsError('permission-denied', `User does not have permission to edit this post.${currentUser}`);
    }


    const text = data.text;
    try {
      const result = await perspective.analyze(text, {attributes: ['toxicity', 'IDENTITY_ATTACK', 'INSULT', 'THREAT']});
      for (const [key, value] of Object.entries(result.attributeScores)) {
        if (value?.summaryScore?.value >= 0.7) {
          return {header: 'Declined', message: 'Sorry, your post does not meet our community guidelines, please rewrite before posting'};
        }
      }
    } catch (error) {
      console.error('Error evaluating toxicity:', error.message); 
      throw new functions.https.HttpsError('internal', 'Error evaluating toxicity.');
    }
    

    try {
      await db.doc(data.path).update({text:data.text}).catch((reason)=>{
        return {header: 'Failed', message: `Your post has been edited`};
      })
      return {header: 'Success', message: `Your post has been edited`};
    } catch (error) {
      console.error('Error saving post:', error.message);
      console.log(data);
      throw new functions.https.HttpsError('unavailable', 'Error saving post.');
    }
});
//-------------------------------------------------------------------------------------------------------------
const sharp = require('sharp');
const storage = admin.storage();
exports.resizeImage = functions.https.onCall(async (data, context) => {
    if (!data || !data.image) {
        throw new functions.https.HttpsError('invalid-argument', 'The function must be called with an "image" field.');
    }

    const base64Image = data.image;
    const buffer = Buffer.from(base64Image, 'base64');

    try {
        // Resize the image to 200x200 pixels
        const resizedImageBuffer = await sharp(buffer)
            .resize(200, 200)
            .toBuffer();

        // Generate a unique file name
        const filename = `${context.auth.token.uid}.png`;

        // Define the destination bucket and file path
        const bucket = storage.bucket('gs://letstalk-e7a23.appspot.com');
        const file = bucket.file(`profilepic/${filename}`);

        // Upload the resized image to Cloud Storage
        await file.save(resizedImageBuffer, {
            metadata: {
                contentType: 'image/png',
            },
        });

        
        const [url] = await file.getSignedUrl({
            action: 'read',
            expires: '03-01-2500', 

        });
        await admin.firestore().collection('users').doc(context.auth.token.uid).update({"url": url})

    } catch (error) {
        
        throw new functions.https.HttpsError('unknown', `Error processing image: ${error.message}`);
    }
});

//-------------------------------------------------------------------------------------------------------------
const bucket= admin.storage().bucket();
exports.approveForumRequest = functions.firestore
.document('requests/{forumName}')
.onUpdate(async (change, context) => {
  const afterData = change.after.data();
  
  if (afterData.approved && afterData.approved === true) {
    // Create a new document in 'forums' with the same data
    const forumData = change.after.data();
  
    delete forumData.approved;
    try {
      // Add forum to the 'forums' collection
       await admin.firestore().collection('forums').add(forumData);

       await change.after.ref.delete()

        //move photos to proper bin

        const oldFilePath = `requests/${forumData.name}_200x200.jpg`; 
        const newFilePath = `forums/${forumData.name}.jpg`;

        // Move file in storage
        await bucket.file(oldFilePath).copy(bucket.file(newFilePath));
        await bucket.file(oldFilePath).delete();



      console.log(`Forum ${forumName} approved and moved to forums collection.`);
    } catch (error) {
      console.error('Error moving forum to forums collection:', error);
    }
  }
  else if(afterData.approved && afterData.approved===false){
    try {
      await change.after.ref.delete();
    } catch (error) {
      console.error(error);
    }
  }
});
//-------------------------------------------------------------------------------------------------------------
exports.checkForumNameAvailability=functions.https.onCall(async(data, context)=>{
  const forumAvailability= await db.collection('forums').where('name', '==', data.forumName).limit(1).get();
  if(!forumAvailability.empty){
    return {message:'Error',  content:'This Forum already exists'};
  } 
  const numberOfForumsCreated= await db.collection('forums').where('author', '==', (await admin.auth().getUser(context.auth.uid)).displayName).get();
  const numberOfRequestsMade= await db.collection('requests').where('author', '==', (await admin.auth().getUser(context.auth.uid)).displayName).get();
  if(numberOfForumsCreated+numberOfRequestsMade>7){
    return {message: 'Error', content:'You have reached your yearly limit on forum creation, please upgrade to our Politician plan!'}; 
  }
  else {
    return {message: 'Success', content:'Your forum request has been submitted and will be reviewed within a week'}; 
  }
});


