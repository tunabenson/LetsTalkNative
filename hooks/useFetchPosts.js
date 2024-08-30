import { useState, useEffect } from 'react';
import { db, storage } from '../api/firebaseConfig';
import { collection, query, orderBy, limit, getDocs, startAfter, where, getDoc, doc } from 'firebase/firestore';
import ForumHeader from '../components/forum/ForumHeader';
import { getDownloadURL, ref } from 'firebase/storage';

const useFetchPosts = (forumname) => {
  const [posts, setPosts] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [lastVisible, setLastVisible] = useState(null);
  const [header, setHeader]=useState(undefined); 
  const [photoUrl, setPhotoUrl]= useState();
  const fetchPosts = async () => {
    setRefreshing(true);
    try {
      let postQuery;
      if(!forumname){
        postQuery= query(collection(db, "posts"), orderBy("date", 'desc'), limit(10));
      }
      else{
        postQuery=query(collection(db, "posts"), orderBy("date", 'desc'), where('forum', '==', forumname), limit(10));
      }
      const querySnapshot = await getDocs(postQuery);
      const fetchedPosts = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id, path: doc.ref.path }));
      if (querySnapshot.docs.length > 0) {
        setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
      }
      else{
        setLastVisible(undefined);
      }
      setPosts(fetchedPosts);
     
    } catch (error) {
      console.error('Error fetching recommended posts:', error);
    } finally {
      setTimeout(() => setRefreshing(false), 1000);
    }
  };

  const fetchMorePosts = async () => {
    if (!lastVisible) return;

    try {
      let moreQuery;
      if(!forumname){
        moreQuery= query(collection(db, "posts"), orderBy("date", 'desc'), startAfter(lastVisible), limit(10));
      }
      else{
        moreQuery=query(collection(db, "posts"), orderBy("date", 'desc'), startAfter(lastVisible), where('forum', '==', forumname), limit(10));
      }
      const querySnapshot = await getDocs(moreQuery);
      const fetchedPosts = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id, path: doc.ref.path }));
      if (querySnapshot.docs.length > 0) {
        setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
      }
      else{
        setLastVisible(undefined)
      }
      setPosts(prevPosts => [...prevPosts, ...fetchedPosts]);
   
    } catch (error) {
      console.error('Error fetching more posts:', error);
    }
  };

  useEffect(() => {
  
    const getForumHeader=async()=>{
      const snapshot= await getDocs(query( collection(db,'forums'), where('name', '==', forumname), limit(1)));
      //async load url with state
   try{  
    getDownloadURL(ref(storage, `forums/${forumname}.jpg`)).then((value)=>setPhotoUrl(value)).catch((reason)=>{})
      console.log(snapshot.docs[0].data());
    }catch{(error)=>{}};
      if(snapshot.docs[0].exists()){
        setHeader(<ForumHeader forumDescription={snapshot.docs[0].data()} photoUrl={photoUrl}/>);
      }
    }

    fetchPosts();
    if(forumname){
      getForumHeader(); 
    }    
   
  }, []);

  return { posts, refreshing, fetchPosts, fetchMorePosts, header};
};

export default useFetchPosts;
