import { collection, getDocs, limit, orderBy, query, startAfter, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../api/firebaseConfig";

const useAccount=(username)=>{
    const [account, setAccount] = useState(null);
    const [posts, setPosts] = useState(null);
    const [lastVisible, setLastVisible]= useState(undefined);

    const fetchPostsByUsername = async (username) => {
        let postsQuery;
        if(lastVisible){
            postsQuery=query(collection(db, "posts"), where('username', '==', username), orderBy("date", 'desc'), startAfter(lastVisible), limit(10));
         }
         else{
           postsQuery = query(collection(db, "posts"), where('username', '==', username), orderBy("date", 'desc'), limit(10));
         }
        const snap = await getDocs(postsQuery);
        const temp = [];
      
        for (const document of snap.docs) {
          const postData = { ...document.data(), id: document.id, path: document.ref.path };
          temp.push(postData);
        }
        setLastVisible(snap.docs[snap.docs.length-1]);
        return temp;
      };


    const fetchUserData = async () => {
      const userQuery = query(collection(db, 'users'), where('username', '==', username), limit(1));
      const userDocPromise = getDocs(userQuery);
      const postsPromise = fetchPostsByUsername(username);
  
      const [userDoc, posts] = await Promise.all([userDocPromise, postsPromise]);
  
      
    setAccount(userDoc.docs[0].data());
    setPosts(posts);
    };

    const fetchMoreUserPosts=async ()=>{
        return fetchPostsByUsername(username);
    }
  
    useEffect(() => {
      fetchUserData();
    }, [username]);
    return {fetchMoreUserPosts, account, posts }
}
export default useAccount;