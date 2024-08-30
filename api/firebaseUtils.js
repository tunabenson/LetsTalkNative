import { httpsCallable } from "firebase/functions";
import { auth, db, functions } from "./firebaseConfig";
import { collection, deleteDoc, doc, getCountFromServer, getDoc, getDocs, limit, orderBy, query, setDoc, Timestamp, where } from "firebase/firestore";


export async function deletePost({path}) {
    const deletePostFunction = httpsCallable(functions,'deletePost');
    await deletePostFunction({path});
}
  
  
  export async function createPost({post, forum,  path, isResponse}){
    const createPostFunction = httpsCallable(functions,'createPost');
    const result = await createPostFunction({post, forum, path, isResponse});
    return result.data;
  }
  
  
  export async function uploadImageForUser( {base64Image}){
    const uploadImageToUserFunction= httpsCallable(functions, 'resizeImage'); 
    try {
      const response= await uploadImageToUserFunction({image:base64Image});
      console.log(response.data);
    } catch (error) {
      console.error('Error resizing image:', error);
    }
  }
  
  
  export async function getArticleTitleFromURL({url}){
    const getTitle= httpsCallable(functions, 'getArticleTitle'); 
    try {
      const response= await getTitle({url});
      console.log(response.data)
      return {...response.data, link:url }
    } catch (error) {
      console.error('Error fetching title:', error);
    }
  }
  
  export const fetchLikeDislikeCounts = async (path) => {
    try {
      const collLikes = collection(db, path, 'likes');
      const collDislikes = collection(db, path, 'dislikes');
      const snapshotLikes = await getCountFromServer(collLikes);
      const snapshotDislikes = await getCountFromServer(collDislikes);
      const likes= snapshotLikes.data().count || 0;
      const dislikes= snapshotDislikes.data().count || 0;
      return { likes, dislikes };
    } catch (error) {
      console.error('Error fetching like/dislike counts:', error);
      return { likes: 0, dislikes: 0 };
    }
  };
  
 /*
 problematic implementation here:
 liked and disliked data coming from client side. 
 insecure please fix by check value in backend instead. 
 --Ideas: 
  **create cloud function to handle behavior and call from front** 
  first check value in backend then update accordingly. 
  */
  export const updateLikesInFirebase = async ({ liked, path, displayName }) => {
    try {
      const likeRef = doc(db, path, 'likes', displayName);  
      if (liked) {
        await setDoc(likeRef, {time: Timestamp.now()});   
      } else {
        await deleteDoc(likeRef);
      }
    } catch (error) {
      console.error('Error updating like status in Firebase:', error);
    }
  };

  export const updateDislikesInFirebase = async ({ disliked, path, displayName }) => {
    try {
      const dislikeRef = doc(db, path, 'dislikes', displayName);
  
      if (disliked) {
        await setDoc(dislikeRef, { time: Timestamp.now() });
      } else {
        await deleteDoc(dislikeRef);
      }
    } catch (error) {
      console.error('Error updating dislike status in Firebase:', error);
    }
  };
  

  export const getUsernameAndEmailAvailability = async (email, username) => {
  const checkAvailabilityFunction= httpsCallable(functions, 'checkUsernameAndEmailAvailability');
  try {
    const available = await checkAvailabilityFunction({email, username});
    return available.data;
  } catch (error) {
    console.error('Error with checking username availability', error.message);
  }
};
  /**
   * @deprecated
   * @param {path, startAfter} responseDescription  
   * @returns 
   */
 export const getResponse=async({path, startAfter})=>{
  
    const getResponse= httpsCallable(functions,'getConversation');
    try{
      const data= await getResponse({path, startAfter});
      return data;
    }catch(error){
     console.log( error.message);

    }
 }
 export const editPost=async({text, forum,path})=>{
  const editPostFunction= httpsCallable(functions,'editPost');
  const data= await editPostFunction({text, forum, path});
  return data;
}





const getForumInfo=async({forumname})=>{
  const snapshot= await getDoc(doc(db, `forums/${forumname}`));
  return snapshot.data();
}


export const getCompletePostFromSearch=async(item)=>{
    const snapshot= await getDoc(doc(db, item.path)); 
    return {...snapshot.data(), path: item.path};
}

export const getForumAvailability= async(data)=>{
  const checkAvailabilityFunction= httpsCallable(functions, 'checkForumNameAvailability');
  const response= await checkAvailabilityFunction(data);
  return response.data;
}


export const getUserForums=async ()=>{
  let data=[];
  const forumsSnapshot=  await getDocs(query(collection(db, 'forums'), where('author', '==',  auth.currentUser.displayName), orderBy('date', 'desc'), limit(15)));
  forumsSnapshot.forEach((result)=>{
    data.push({...result.data()});
  })
  return data;
}
export const getUserRequests=async ()=>{
  let data=[]
  const requestsSnapshot= await getDocs(query(collection(db, 'requests'), where('author', '==',  auth.currentUser.displayName), orderBy('date', 'desc'), limit(15)));
  requestsSnapshot.forEach((result)=>{
    data.push({...result.data()});
  })
  return data;
}

export const getLikedPosts=async()=>{

}