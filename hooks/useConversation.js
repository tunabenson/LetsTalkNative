import { collection, getDocs, limit, orderBy, query, startAfter } from "firebase/firestore";
import { useEffect, useRef, useState } from "react"
import { db } from "../api/firebaseConfig";

export const useConversation=(originalPost)=>{
    const [responses, setResponses]=useState();
    const [mainPost, setMainPost]= useState(originalPost);
    const lastVisible= useRef(undefined); 
    const getMorePosts= useRef(null); 
    useEffect(()=>{
        getChildrenPosts(originalPost); 
    },[]);



    const getChildrenPosts=async(post)=>{
        setResponses([]);
        const querySnapshot= await getDocs(query(collection(db, post.path, 'replies'), orderBy('date', 'desc'), limit(10))); 
        //set current last visible to be the last document fetched
        lastVisible.current=querySnapshot.docs[querySnapshot.docs.length-1];


        //iterate over all documents and add to responses list
         querySnapshot.forEach((each)=>{
            setResponses((prev)=>[...prev, {...each.data(), path: each.ref.path}]);
         })

         //set getMorePosts.curr to be a function
         getMorePosts.current=async()=>{
            const querySnapshot= await getDocs(query(collection(db, post.path, 'replies'), startAfter(lastVisible.current), orderBy('date', 'desc'), limit(10))); 
            querySnapshot.forEach((each)=>{
               setResponses((prev)=>[...prev, {...each.data(), path: each.ref.path}]);
            })
            lastVisible.current=querySnapshot.docs[querySnapshot.docs.length-1];
        };
    }




    const toggleMainPost=async(newPost)=>{
        setMainPost(newPost);
        getChildrenPosts(newPost);
    }

    return {toggleMainPost, getChildrenPosts, responses, mainPost, getMorePosts};

}