import React, { useEffect, useState } from 'react';
import moment from 'moment';
import {FaThumbsUp} from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { Button, Textarea } from 'flowbite-react';

export default function Comment({comment,onLike,onEdit}) {
    const [user,setUser]=useState(null);
    const {currentUser} = useSelector((state)=>state.user);
    const [isEditing,setIsEditing]=useState(false);
    const [editedComment,setEditedComment]=useState(comment.content);
    useEffect(()=>{
        const getUser= async()=>{
            try{
                const res= await fetch(`/api/user/${comment.userId}`);
                const data =await res.json();
                if(res.ok){
                    setUser(data);
                }
            } catch(error){
                console.log(error.message);
            }
           
        }
            getUser();
    },[comment])

    const handleEdit=(event)=>{
        setIsEditing(true);
        setEditedComment(comment.content);
    }
    const handleSave= async ()=>{
        try{
            const res =await fetch(`/api/comment/editComment/${comment._id}`,{
                method:'PUT',
                headers:{
                    'Content-Type': 'application/json'
                },
                body:JSON.stringify({
                    content:editedComment
                })
            });
            if(res.ok){
                setIsEditing(false);
                onEdit(comment._id,editedComment)
            }
        } catch(error){
            console.log(error.message)
        }
    }
  return (
    <div className='flex p-4 border-b dark:border-gray-600 text-sm'>
        <div className='flex-shrink-0 mr-3'>
            <img className='h-10 w-10 rounded-full bg-gray-200' src={user ? user.profilePicture : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'} alt="" />
        </div>
        <div className='flex-1'>
            <div className='flex items-center mb-1'>
                <span className='font-bold mr-1 text-sm truncate'>{user ? `@${user.username}`: 'anonymous user'}</span>
                <span className='text-gray-500 text-xs'>{moment(comment.createdAt).fromNow()}</span>

            </div>
            {
                isEditing ? (<>
                                <Textarea className='mb-2' placeholder='Edit a comment...'  maxLength='200' onChange={(e)=>setEditedComment(e.target.value)} value={editedComment}/>
                                <div className='flex justify-end gap-2 text-sm'>
                                    <Button type='Button' size='sm' gradientDuoTone='purpleToBlue' onClick={handleSave}>Save</Button>
                                    <Button type='Button' size='sm' gradientDuoTone='purpleToBlue' outline onClick={()=>setIsEditing(false)}>Cancel</Button>
                                </div>
                            </>
                    
                ):(
                    <>
                        <p className='text-gray-500 pb-2'>{comment.content}</p>
                        <div className='flex items-center pt-2 text-xs border-t dark:border-gray-700 max-w-fit gap-2'>
                            <button type='button' onClick={()=>onLike(comment._id)} className={`text-gray-400 hover:text-blue-500 ${ 
                                                                                                                                        currentUser && comment.likes.includes
                                                                                                                                        (currentUser._id) && '!text-blue-500'
                                                                                                                                        }`}><FaThumbsUp className='text-sm'/>
                            </button>
                            <p>
                                {
                                    comment.numbersOfLikes > 0 && comment.numbersOfLikes +' '+ (comment.numbersOfLikes === 1 ? 'like' :'likes')
                                }
                            </p>
                            {
                                currentUser && (currentUser._id === comment.userId || currentUser.isAdmin) && (
                                    <button type='button' className='text-gray-400 hover:text-blue-500' onClick={handleEdit}>Edit</button>
                                )

                                
                            }
                        </div>
                    </>
                    
                )
            }
            
        </div>
    </div>
    
  )
}
