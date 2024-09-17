import { collection, doc, getDoc, getDocs, limit, orderBy, query, startAfter } from "firebase/firestore";
import { useEffect, useRef, useState } from "react"
import { db } from "../api/firebaseConfig";

export const useConversation=(originalPost)=>{
    const [responses, setResponses]=useState([]);
    const [mainPost, setMainPost]= useState(originalPost);
    const [lastVisible,setLastVisible]= useState() 
    useEffect(()=>{
        getChildrenPosts(originalPost); 
    },[]);



    const getMorePosts=async()=>{
        if(responses.length!==0){
        const querySnapshot= await getDocs(query(collection(db, mainPost.path, 'replies'), orderBy('date', 'desc'),  startAfter(lastVisible),limit(10))); 
        querySnapshot.forEach((each)=>{
           setResponses((prev)=>[...prev, {...each.data(), path: each.ref.path}]);
        })
        setLastVisible(querySnapshot.docs[querySnapshot.docs.length-1]);
        }
    }

    const getChildrenPosts=async(post)=>{
        setResponses([]);
        const querySnapshot= await getDocs(query(collection(db, post.path, 'replies'), orderBy('date', 'desc'), limit(10))); 
        //set current last visible to be the last document fetched
        setLastVisible(querySnapshot.docs[querySnapshot.docs.length-1]);


        //iterate over all documents and add to responses list
         querySnapshot.forEach((each)=>{
            setResponses((prev)=>[...prev, {...each.data(), path: each.ref.path}]);
         })

      
    }
    const toggleMainPost=async(newPost)=>{
        setMainPost(newPost);
        getChildrenPosts(newPost);
    }

    const getParentPost=async()=>{
        const pathArray= mainPost.path.split('/');
        if(pathArray.length>=4){
            parentPath=pathArray.slice(0,-2).join('/');
            console.log(parentPath);
            const snap =await getDoc(doc(db, parentPath));
            if(snap.exists()){
                toggleMainPost({...snap.data(), path:parentPath});
            }
        }
    }

    const hasParent=()=>{
        const pathArray= mainPost.path.split('/');
        if(pathArray.length>=4) return true;
        return false; 
    }


    return {toggleMainPost, hasParent, getParentPost, getChildrenPosts, responses, mainPost, getMorePosts};

}