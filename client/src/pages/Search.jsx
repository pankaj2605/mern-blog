import { Button, Select, TextInput } from 'flowbite-react'
import React, { useEffect, useState } from 'react';
import { useLocation,useNavigate } from 'react-router-dom';
import PostCard from '../components/PostCard';

export default function Search() {
    const [sidebarData,setSidebarData] =useState({
                                                    searchTerm:'',
                                                    sort:'desc',
                                                    category:'',});
    
    const [posts,setPosts] =useState([]);
    const [loading,setLoading]= useState(false);
    const [showMore,setShowMore]=useState(false);
    const location=useLocation();
    const navigate=useNavigate();

    useEffect(()=>{
        const urlParams= new URLSearchParams(location.search);
        const searchTermFromUrl =urlParams.get('searchTerm');
        const sortFromUrl = urlParams.get('sort');
        const categoryFromUrl =urlParams.get('category');

        if(searchTermFromUrl || sortFromUrl || categoryFromUrl){
            setSidebarData((prevData)=>({
                ...prevData,
                searchTerm:searchTermFromUrl,
                sort:sortFromUrl,
                category:categoryFromUrl,
            }))
        }
        const fetchPosts =async()=>{
            setLoading(true);
            const searchQuery=urlParams.toString();
            try{
                setLoading(true);
                const res= await fetch(`/api/post/getposts?${searchQuery}`);
                const data = await res.json();
                if(!res.ok){
                    setLoading(false);
                    return;
                }
                if(res.ok){
                    setLoading(false);
                    setPosts(data.posts);
                    if(data.posts.length < 9){
                        setShowMore(false)
                      }
                }
            }catch(error){
                console.log(error)
            }}
            fetchPosts();
    },[location.search])

    const handleShowMore =async()=>{
        const startIndex =posts.length;
        const urlParams=new URLSearchParams(location.search);
        urlParams.set('startIndex',startIndex);
        const searchQuery=urlParams.toString();
          try{
            const res =await fetch(`/api/post/getposts?${searchQuery}`);
            const data =await res.json();
            if(!res.ok){
                return
            }
            if(res.ok){
              setPosts((prev)=>[...prev,...data.posts]);
              if(data.posts.length < 9){
                setShowMore(false)
              }
            }
          }catch(error){
            console.log(error.message)
          }
      }

    const handleChange=(event)=>{
        if(event.target.id === 'searchTerm'){
            setSidebarData((prevData)=>({...prevData,searchTerm:event.target.value}))
        }
        if(event.target.id === 'sort'){
            const order =event.target.value || 'desc';
            setSidebarData((prevData)=>({...prevData,sort:order}))
        }
        if(event.target.id === 'category'){
            const category =event.target.value || 'uncategorized';
            setSidebarData((prevData)=>({...prevData,category}))
        }
    } 
    const handleSubmit=(event)=>{
        event.preventDefault();
        const urlParams =new URLSearchParams(location.search);
        urlParams.set('searchTerm', sidebarData.searchTerm);
        urlParams.set('sort',sidebarData.sort);
        urlParams.set('category',sidebarData.category);
        const searchQuery=urlParams.toString();
        navigate(`/search?${searchQuery}`)
    }
  return (
    <div className='flex flex-col md:flex-row'>
        <div className='p-7 border-b md:border-r md:min-h-screen border-gray-300'>
            <form className='flex flex-col gap-8' onSubmit={handleSubmit}>
                <div className='flex items-center gap-2'>
                    <label className='whitespace-nowrap font-semibold'>Search Term:</label>
                    <TextInput placeholder='search...' id='searchTerm' type='text' className='' value={sidebarData.searchTerm} onChange={handleChange} />
                </div>
                <div className='flex items-center gap-2'>
                <label className='font-semibold'>Sort:</label> 
                <Select onChange={handleChange} value={sidebarData.sort} id='sort'>
                    <option value='desc'>Latest</option>
                    <option value='asc'>Oldest</option>
                </Select>
                </div>
                <div className='flex items-center gap-2'>
                <label className='font-semibold'>Category:</label> 
                <Select onChange={handleChange} value={sidebarData.category} id='category'>
                    <option value="uncategorized">uncategorized</option>
                    <option value="javascript">JavaScript</option>
                    <option value="reactjs">React.js</option>
                    <option value="nodejs">Node.js</option>
                    <option value="nextjs">Next.js</option>
                </Select>
                </div>
                <Button type='submit' outline gradientDuoTone='purpleToPink'>Apply Filters</Button>
            </form>
        </div>
        <div className='w-full'>
            <h1 className='text-3xl font-semibold sm:border-b border-gray-300 p-3 mt-5'>Posts Results</h1>
            <div className='p-7 flex flex-wrap gap-4'>
                {
                    !loading && posts.length === 0 && 
                    <p className='text-xl text-gray-500'>No posts found.</p>
                }
                {
                    loading && (
                        <p className='text-xl text-gray-500'>Loading....</p>
                    )
                }
                {
                    !loading && posts && posts.map((post)=>(
                        <PostCard key={post._id} post={post}/>
                    ))
                }
                {
                    showMore && <button className='text-teal-500 text-lg hover:underline p-7' onClick={handleShowMore}>Show More</button>
                }
            </div>
        </div>
    </div>
  )
}
